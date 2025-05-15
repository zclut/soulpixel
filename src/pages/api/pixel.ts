import { getLastPixelPlaced, insertPixel } from "@/lib/supabase";
import type { APIRoute } from "astro";
import { COOLDOWN_DURATION } from '@/lib/const';

type PixelData = {
  x: number;
  y: number;
  color: string;
};

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json();
  const { x, y, color } = body as PixelData;
  const user = await locals.currentUser();

  if (!user || !user.username) {
    return new Response("Unauthorized", { status: 401 });
  }
  const username = user.username;

  const response = await checkLastPixel(username)
  if (response) {
    return response;
  }

  const { data, error } = await insertPixel(x, y, color, username);

  if (error) {
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
  const created_at = new Date();
  const hora = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(created_at);
    
  return new Response(
    JSON.stringify({
      "user": username,
      "x": x,
      "y": y,
      "color": color,
      "created_at": hora,
    })
  );
};


const checkLastPixel = async (username: string) => {
  const { data, error } = await getLastPixelPlaced(username);

  if (error) {
    return new Response("Error fetching last pixel", { status: 500 });
  }

  const lastPixel = data[0] ?? null;
  if (lastPixel && lastPixel.created_at) {
    const lastTime = new Date(lastPixel.created_at).getTime();
    const now = Date.now();
    const elapsedSeconds = (now - lastTime) / 1000;

    if (elapsedSeconds < COOLDOWN_DURATION - 3) {
      const remaining = Math.ceil(COOLDOWN_DURATION - elapsedSeconds);
      return new Response(
        JSON.stringify({
          error: "Cooldown in effect",
          remaining_seconds: remaining,
        }),
        { status: 429 }
      );
    }
  }
}