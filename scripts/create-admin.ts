/**
 * Create or update an admin user.
 *
 *   npm run create-admin -- admin@blog.com admin123 "Site Admin"
 *
 * Falls back to env vars / defaults when args are omitted:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 *
 * Idempotent: if the user already exists, the password and roles are
 * updated in place.
 */
import { getPayload } from "payload";
import config from "../payload.config";

const [, , argEmail, argPassword, argName] = process.argv;

const email = (argEmail ?? process.env.ADMIN_EMAIL ?? "admin@blog.com").trim();
const password = argPassword ?? process.env.ADMIN_PASSWORD ?? "admin123";
const name = argName ?? process.env.ADMIN_NAME ?? "Site Admin";

async function main() {
  if (!email || !password) {
    console.error("[create-admin] email and password are required");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length) {
    const current = existing.docs[0];
    const updated = await payload.update({
      collection: "users",
      id: current.id,
      data: {
        password,
        roles: ["admin"],
        name: current.name ?? name,
      },
    });
    console.log(`[create-admin] updated existing user: ${updated.email} (id=${updated.id})`);
  } else {
    const created = await payload.create({
      collection: "users",
      data: {
        email,
        password,
        name,
        roles: ["admin"],
      },
    });
    console.log(`[create-admin] created new admin: ${created.email} (id=${created.id})`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("[create-admin] failed:", err);
  process.exit(1);
});
