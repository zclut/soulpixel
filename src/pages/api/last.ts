import { getLastPixelPlaced } from "@/lib/supabase";
import type { APIRoute } from "astro";


export const GET: APIRoute = async ({ locals }) => {
    const user = await locals.currentUser();
    if (!user || !user.username) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user_id = user.username;
    const { data, error } = await getLastPixelPlaced(user_id);

    if (error) {
        return new Response("Error fetching last pixel placed", { status: 500 });
    }
    if (!data || data.length === 0) {
        return new Response("No data found", { status: 404 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

}