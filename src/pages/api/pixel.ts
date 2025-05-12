import { insertPixel } from "@/lib/supabase";
import type { APIRoute } from "astro";

type PixelData = {
  x: number;
  y: number;
  color: string;
};

export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json();
  const { x, y, color } = body as PixelData;
  const user = await locals.currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const username = user.username ?? "Incognito";

  const { data, error } = await insertPixel(x, y, color, username);

  if (error) {
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }

  return new Response(
    JSON.stringify({
      message: `${username} add pixel in ${x}, ${y} with color ${color}`,
    })
  );
};
