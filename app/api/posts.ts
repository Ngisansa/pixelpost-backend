import { API_BASE } from "./config";

export async function createPost(data: any) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return await res.json();
}
