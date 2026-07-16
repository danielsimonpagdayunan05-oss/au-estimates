import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { readJsonBody } from "./_shared/body";
import { requireAdmin } from "./_shared/auth";
import { badRequest, json } from "./_shared/response";

const IMAGE_MAX_BYTES = 8 * 1024 * 1024; // 8MB
const MODEL_MAX_BYTES = 30 * 1024 * 1024; // 30MB — GLB files with embedded textures run larger than photos

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
// Browsers frequently fail to sniff a MIME type for less common extensions like .glb/.gltf,
// so the declared type on the data: URI is unreliable here — the extension check below is
// what actually decides whether a file is treated as a 3D model.
const MODEL_EXTENSION_TYPES: Record<string, string> = {
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
};

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

  const match = /^data:([\w/+.-]*);base64,(.+)$/.exec(body.dataUrl);
  if (!match) return badRequest("dataUrl must be a base64 data: URI");
  const [, declaredType, base64] = match;

  const extension = body.filename.split(".").pop()?.toLowerCase() ?? "";
  const modelType = MODEL_EXTENSION_TYPES[extension];
  const isModel = Boolean(modelType);
  const isImage = !isModel && IMAGE_TYPES.has(declaredType);

  if (!isModel && !isImage) {
    return badRequest(`Unsupported file type. Allowed: PNG/JPEG/WEBP/GIF images, or GLB/GLTF 3D models.`);
  }

  const contentType = isModel ? modelType : declaredType;
  const buffer = base64ToArrayBuffer(base64);
  const maxBytes = isModel ? MODEL_MAX_BYTES : IMAGE_MAX_BYTES;
  if (buffer.byteLength > maxBytes) return badRequest(`File exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit`);

  const safeName = body.filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
  const folder = isModel ? "models" : "portfolio";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const store = getStore({ name: "portfolio-images" });
  await store.set(key, buffer, { metadata: { contentType } });

  return json({ key, url: `/api/image?key=${encodeURIComponent(key)}` }, { status: 201 });
};

export const config: Config = { path: "/api/admin/upload" };
