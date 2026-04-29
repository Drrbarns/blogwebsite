/**
 * Resolves `DATABASE_URI` for runtime (Payload + Next).
 *
 * **Vercel + Supabase session pooler:** the default pooler URL uses port
 * `5432` (session / “session mode”). That mode caps concurrent clients
 * (often ~15). Serverless invocations each open connections — builds,
 * `/admin`, API routes, ISR — and you quickly hit:
 *
 * `(EMAXCONNSESSION) max clients reached in session mode`
 *
 * That surfaces in production as a generic React Server Components
 * error (digest only in the browser). The transaction pooler on port
 * `6543` accepts far more concurrent connections and is what Supabase
 * recommends for serverless.
 *
 * We auto-rewrite **only** known Supabase *pooler* hosts from `5432` →
 * `6543` when `VERCEL=1`, unless `DATABASE_USE_SESSION_POOLER=true`
 * (escape hatch for dedicated/long-lived servers).
 *
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
 */
export function resolveDatabaseUri(): string {
  const raw = process.env.DATABASE_URI?.trim() ?? "";

  if (!raw) return raw;

  if (process.env.DATABASE_USE_SESSION_POOLER === "true") {
    return raw;
  }

  const isVercel = process.env.VERCEL === "1";
  const isSupabasePooler =
    raw.includes("pooler.supabase.com") || raw.includes("pooler.supabase.co");

  if (isVercel && isSupabasePooler && /:5432(?=[/?]|$)/.test(raw)) {
    const next = raw.replace(/:5432(?=[/?]|$)/, ":6543");
    if (next !== raw) {
      console.warn(
        "[db] Vercel + Supabase pooler: using port 6543 (transaction pool) instead of 5432 (session pool) to avoid EMAXCONNSESSION.",
      );
    }
    return next;
  }

  return raw;
}
