export const CANVAS_LIMITS = {
    minX: -128,
    maxX: 128,
    minY: -64,
    maxY: 64,
}

export const CELL_SIZE = 10

export const COOLDOWN_DURATION = 15 // seconds



export const LEVEL = {
    ECHO: { text: "ECHO", color: "text-purple-500", pixels: 0 },
    AWAKENING: { text: "AWAKENING", color: "text-blue-500", pixels: 10 },
    SPIRIT: { text: "SPIRIT", color: "text-fuchsia-500", pixels: 500 },
    ASCENDED: { text: "ASCENDED", color: "text-pink-500", pixels: 1000 },
    ETERNAL: { text: "ETERNAL", color: "text-yellow-500", pixels: 5000 },
}

export const COLORS = [
    "#6B0119",
    "#BD0037",
    "#FF4500",
    "#FE3781",
    "#DD117E",
    "#FE99A9",
    "#9B6926",
    "#6D462F",
    "#FEB470",
    "#FEA800",
    "#FFD435",
    "#FEFBBB",
    "#01A267",
    "#09CC76",
    "#7EEC57",
    "#02756D",
    "#00CCBE",
    "#009DAA",
    "#52E8F3",
    "#244FA4",
    "#3790EA",
    "#94B3EF",
    "#4839BF",
    "#695BFF",
    "#801D9F",
    "#B449BF",
    "#E4ABFD",
    "#000000",
    "#525252",
    "#888D90",
    "#D5D6D8",
    "#FFFFFF",
];


export const getRarityColor = (
    rarity: string,
    options: {
        background?: boolean;
        text?: boolean;
        border?: boolean;
        progress?: boolean;
    } = { background: true, text: true, border: true }
) => {
    const {
        background = true,
        text = true,
        border = true,
        progress = false,
    } = options;

    const styles: Record<
        string,
        { bg: string; text: string; border: string; progress: string }
    > = {
        common: {
            bg: "bg-purple-900/20",
            text: "text-purple-500",
            border: "border-purple-900/50",
            progress: "bg-purple-800",
        },
        uncommon: {
            bg: "bg-blue-900/20",
            text: "text-blue-500",
            border: "border-blue-900/50",
            progress: "bg-blue-800",
        },
        rare: {
            bg: "bg-fuchsia-900/20",
            text: "text-fuchsia-500",
            border: "border-fuchsia-900/50",
            progress: "bg-fuchsia-800",
        },
        epic: {
            bg: "bg-pink-900/20",
            text: "text-pink-500",
            border: "border-pink-900/50",
            progress: "bg-pink-800",
        },
        legendary: {
            bg: "bg-yellow-900/20",
            text: "text-yellow-500",
            border: "border-yellow-900/50",
            progress: "bg-yellow-800",
        },
    };

    const fallback = styles["common"];
    const style = styles[rarity] || fallback;

    return [
        background ? style.bg : "",
        text ? style.text : "",
        border ? style.border : "",
        progress ? style.progress : "",
    ]
        .filter(Boolean)
        .join(" ");
};