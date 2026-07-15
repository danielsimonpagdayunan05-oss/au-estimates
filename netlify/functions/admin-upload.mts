import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json } from "./_shared/response";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export default async (req: Request) => {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (req.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });

  const body = await readJsonBody(req);
  if (!body || typeof body.dataUrl !== "string" || typeof body.filename !== "string") {
    return badRequest("Expected { filename: string, dataUrl: string (data: URI) }");
  }

  const match = /^data:([\w/+.-]+);base64,(.+)$/.exec(body.dataUrl);
  if (!match) return badRequest("dataUrl must be a base64 data: URI");
  const [, contentType, base64] = match;

  if (!ALLOWED_TYPES.has(contentType)) return badRequest(`Unsupported image type: ${contentType}`);

  const buffer = base64ToArrayBuffer(base64);
  if (buffer.byteLength > MAX_BYTES) return badRequest("Image exceeds 8MB limit");

  const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
  const key = `portfolio/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const store = getStore({ name: "portfolio-images" });
  await store.set(key, buffer, { metadata: { contentType } });

  return json({ key, url: `/api/image?key=${encodeURIComponent(key)}` }, { status: 201 });
};

export const config: Config = { path: "/api/admin/upload" };
