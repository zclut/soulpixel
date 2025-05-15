const HEADERS = {
    "Content-Type": "application/json",
}


export const insertPixel = async (x: number, y: number, color: string) => {
    const response = await fetch("/api/pixel", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            x,
            y,
            color,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to insert pixel");
    }
    const data = await response.json();
    return data;
};