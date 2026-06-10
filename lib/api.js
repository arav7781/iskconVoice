/**
 * Calls the Graph Hierarchy API.
 * In dev, Next.js rewrites /api/* to http://localhost:3000/api/*.
 * In production, set NEXT_PUBLIC_API_URL to your hosted backend URL.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || " https://amitsrikar-bfhl.onrender.com";

/**
 * @param {string[]} edges
 * @returns {Promise<object>}
 */
export async function processGraph(edges) {
  const res = await fetch(`${BASE_URL}/api/graph`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ edges }),
  });

  if (!res.ok) {
    let msg = `Server error: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch (_) { }
    throw new Error(msg);
  }

  return res.json();
}
