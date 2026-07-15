export async function readJsonBody(req: Request): Promise<Record<string, any> | null> {
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, any>;
  } catch {
    return null;
  }
}
