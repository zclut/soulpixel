from datetime import datetime, timedelta, timezone
from moviepy import VideoClip
from pathlib import Path
from PIL import Image, ImageDraw
from supabase import create_client, Client
import csv
import dotenv
import math
import numpy as np
import os
import pandas as pd

dotenv_path = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) / '.env'
dotenv.load_dotenv(dotenv_path)

url = os.getenv("PUBLIC_SUPABASE_URL")
key = os.getenv("PUBLIC_SUPABASE_KEY")
supabase: Client = create_client(url, key)


# Canvas Settings
CANVAS_LIMITS = {
    "minX": -128,
    "maxX": 128,
    "minY": -64,
    "maxY": 64,
}
CELL_SIZE = 10
CANVAS_WIDTH = (CANVAS_LIMITS["maxX"] - CANVAS_LIMITS["minX"]) * CELL_SIZE
CANVAS_HEIGHT = (CANVAS_LIMITS["maxY"] - CANVAS_LIMITS["minY"]) * CELL_SIZE
BACKGROUND_COLOR = (36, 36, 36)

# Video settings
FPS = 10
TARGET_DURATION = 15
EXTRA_DURATION = 0.3
TOTAL_DURATION = TARGET_DURATION + EXTRA_DURATION

# Database settings
BATCH_SIZE = 1000

# File settings
TIMESTAMP_FILE = "last_timestamp.txt"
PIXELS_FILE = "pixels.csv"


def get_grid_count():
    timestamp = last_timestamp()
    query = supabase.table("grid").select("id", count="exact")
    if timestamp:
        query = query.gte("created_at", timestamp)

    response = query.execute()
    return response.count


def get_current_grid_batch(start: int, end: int):
    timestamp = last_timestamp()
    query = supabase.table("grid").select("x,y,color,created_at").range(start, end)

    if timestamp:
        query = query.gte("created_at", timestamp)

    response = query.execute()
    return response.data


def get_current_grid():
    count = get_grid_count()

    if count <= 0:
        print("No data available or error fetching count.")
        return [], None
    
    print(f"Total new pixels: {count}")

    batches = []
    for i in range(0, count, BATCH_SIZE):
        batch_end = min(i + BATCH_SIZE - 1, count - 1)
        data = get_current_grid_batch(i, batch_end)
        batches.extend(data)

    return batches, None


def append_to_csv(pixels):
    fieldnames = ["x", "y", "color", "created_at"]
    with open(PIXELS_FILE, mode='a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        csvfile.seek(0, 2)
        if csvfile.tell() == 0:
            writer.writeheader()
        for pixel in pixels:
            writer.writerow(pixel)

    last_timestamp(is_read=False)

def parse_created_at(raw):
    if raw.endswith('+00'):
        raw = raw.replace('+00', '+0000')
    
    try:
        return datetime.strptime(raw, '%Y-%m-%d %H:%M:%S.%f%z')
    except ValueError:
        return datetime.strptime(raw, '%Y-%m-%d %H:%M:%S%z')
    
def load_pixels():
    df = pd.read_csv(PIXELS_FILE)
    df['created_at'] = pd.to_datetime(df['created_at'], format='ISO8601')

    duplicated_mask = df['created_at'].duplicated(keep=False) 

    def add_microseconds(group):
        return [ts + timedelta(microseconds=i) for i, ts in enumerate(group)]

    df.loc[duplicated_mask, 'created_at'] = (
        df.loc[duplicated_mask]
        .groupby('created_at')['created_at']
        .transform(add_microseconds)
    )

    # Ordenamos ya con timestamps únicos
    df = df.sort_values(by='created_at', ascending=True)

    pixels = df.to_dict(orient='records')
    for p in pixels:
        p['x'] = int(p['x'])
        p['y'] = int(p['y'])

    return pixels


def last_timestamp(is_read=True):
    if is_read:
        try:
            with open(TIMESTAMP_FILE, "r") as f:
                last_timestamp = f.read().strip()
        except FileNotFoundError:
            last_timestamp = None
        return last_timestamp
    else:
        with open(TIMESTAMP_FILE, "w") as f:
            timestamp = datetime.now(timezone.utc).isoformat()
            with open(TIMESTAMP_FILE, "w") as f:
                f.write(timestamp)
            return timestamp


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def generate_video(output_path):
    batches, error = get_current_grid()
    if error:
        print(f"Error fetching data: {error}")
        return
    
    append_to_csv(batches)
    pixels = load_pixels()
    total_pixels = len(pixels)

    def make_frame(t):
        # Asegura que el último frame dibuje todos los píxeles
        if t >= TARGET_DURATION:
            count = total_pixels
        else:
            fraction = t / TARGET_DURATION
            count = math.ceil(fraction * total_pixels)

        frame_img = Image.new(
            "RGB", (CANVAS_WIDTH, CANVAS_HEIGHT), BACKGROUND_COLOR)
        draw = ImageDraw.Draw(frame_img)

        for i in range(min(count, total_pixels)):
            p = pixels[i]
            px = (p["x"] - CANVAS_LIMITS["minX"]) * CELL_SIZE
            py = (p["y"] - CANVAS_LIMITS["minY"]) * CELL_SIZE
            draw.rectangle([px, py, px + CELL_SIZE, py +
                           CELL_SIZE], fill=hex_to_rgb(p["color"]))

        return np.array(frame_img)

    video = VideoClip(make_frame, duration=TOTAL_DURATION)
    video.write_videofile(output_path, fps=FPS)


if __name__ == "__main__":
    generate_video("timelapse.mp4")