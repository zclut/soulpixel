import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_KEY
);

// QUERIES
export const getCurrentGrid = async () => {
    const BATCH_SIZE = 1000;
    const { count, error: countError } = await getGridCount();

    if (countError || count === null) return { data: [], error: countError };

    const batches = [];
    for (let i = 0; i < count; i += BATCH_SIZE) {
        const { data, error } = await getCurrentGridBatch(
            i,
            Math.min(i + BATCH_SIZE - 1, count - 1)
        );
        if (error || data == null) return { data: [], error };
        batches.push(...data);
    }

    return { data: batches, error: null };
};

export const getCurrentGridBatch = async (from: number, to: number) => {
    const { data, error } = await supabase
        .from("grid_estado_actual_view")
        .select("*")
        .range(from, to);
    return { data, error };
};

export const getGridCount = async () => {
    const { count, error } = await supabase
        .from("grid_estado_actual_view")
        .select("*", { count: "exact", head: true });
    return { count, error };
};

export const getLeaderboard = async () => {
    const { data, error } = await supabase
        .from("leaderboard_view")
        .select("*")
    return { data, error };
};

export const getHistoricalGrid = async () => {
    const { data, error } = await supabase.from("grid").select("*");
    return { data, error };
};

// INSERTS

export const insertPixel = async (
    x: number,
    y: number,
    color: string,
    user: string
) => {
    const { data, error } = await supabase
        .from("grid")
        .insert([{ x, y, color, user }]);
    return { data, error };
};

// REALTIME
export const listenToGridChanges = (callback: Function) => {
    const channel = supabase
        .channel("custom-all-channel")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "grid" },
            (payload) => {
                callback(payload.new);
            }
        )
        .subscribe();
    return channel;
};
