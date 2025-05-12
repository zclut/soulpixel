import { createClient } from '@supabase/supabase-js'


export const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY
)


// QUERIES

export const getCurrentGrid = async () => {
    const { data, error } = await supabase.rpc('get_latest_by_position')
    return { data, error }
}

export const getHistoricalGrid = async () => {
    const { data, error } = await supabase.from('grid').select('*')
    return { data, error }
}

// REALTIME
export const listenToGridChanges = async (callback?: Function) => {
    const channel = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'grid' },
            (payload) => {
                console.log('Change received!', payload)
            }
        )
        .subscribe()
    return channel
}