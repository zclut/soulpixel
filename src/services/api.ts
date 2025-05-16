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


export const getCurrentGrid = async () => {
    const response = await fetch("/api/grid", {
        method: "GET",
        headers: HEADERS,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch grid");
    }
    const data = await response.json();
    return data;
};

export const getLastPixelPlaced = async () => {
    const response = await fetch("/api/last", {
        method: "GET",
        headers: HEADERS,
    });

    if (!response.ok) {
        throw new Error("Failed to fetch last pixel placed");
    }
    const data = await response.json();
    return data;
};