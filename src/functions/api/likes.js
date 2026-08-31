// functions/api/likes.js
const KV_KEY = "poem-likes";

async function readCounts(env) {
  const raw = await env.LIKES.get(KV_KEY);
  return raw ? JSON.parse(raw) : {};
}

// GET /api/likes  -> 返回所有诗的点赞数 { poemId: count, ... }
export async function onRequestGet({ env }) {
  const counts = await readCounts(env);
  return Response.json(counts);
}

// POST /api/likes  body: { id: "poemId", action: "like" | "unlike" }
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { id, action } = body;
  if (!id || (action !== "like" && action !== "unlike")) {
    return new Response("Bad request", { status: 400 });
  }

  const counts = await readCounts(env);
  const current = counts[id] || 0;
  counts[id] = action === "like" ? current + 1 : Math.max(0, current - 1);

  await env.LIKES.put(KV_KEY, JSON.stringify(counts));

  return Response.json({ id, count: counts[id] });
}
