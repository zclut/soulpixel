import { createClient } from '@supabase/supabase-js'


export const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_KEY
)


// QUERIES

export const getCurrentGrid = async () => {
    const { data, error } = await supabase.rpc('get_latest_by_position')
    return { data, error }
}

export const getLeaderboard = async () => {
    const { data, error } = await supabase.rpc('leaderboard')
    return { data, error }
}

export const getHistoricalGrid = async () => {
    const { data, error } = await supabase.from('grid').select('*')
    return { data, error }
}

// INSERTS

export const insertPixel = async (x: number, y: number, color: string, user: string) => {
    const { data, error } = await supabase.from('grid').insert([
        { x, y, color, user },
    ])
    return { data, error }
}

// REALTIME
export const listenToGridChanges = (callback: Function) => {
    const channel = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'grid' },
            (payload) => {
                callback(payload.new)
            }
        )
        .subscribe()
    return channel
}