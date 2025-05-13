const HEADERS = {
    "Content-Type": "application/json",
}


export const insertPixel = async (x: number, y: number, color: string) => {
    await fetch("/api/pixel", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            x,
            y,
            color,
        }),
    });
};