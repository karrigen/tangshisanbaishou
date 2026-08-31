const KV_KEY = "poem-likes";

async function readCounts(env) {
  const raw = await env.LIKES.get(KV_KEY);
  return raw ? JSON.parse(raw) : {};
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/likes") {
      if (request.method === "GET") {
        const counts = await readCounts(env);
        return Response.json(counts);
      }

      if (request.method === "POST") {
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

      return new Response("Method not allowed", { status: 405 });
    }

    // 其他所有请求，交给静态资源处理（就是你的 Astro 构建产物）
    return env.ASSETS.fetch(request);
  },
};
