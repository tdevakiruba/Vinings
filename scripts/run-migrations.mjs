/**
 * run-migrations.mjs
 * 
 * Programmatically runs all SQL migration and seed scripts in order
 * against the Supabase database using the Management API.
 *
 * Usage: node scripts/run-migrations.mjs
 *
 * Requires environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// REST endpoint for executing SQL via PostgREST rpc
const REST_URL = `${SUPABASE_URL}/rest/v1/rpc`

async function executeSql(sql, filename) {
  console.log(`\n========================================`)
  console.log(`Running: ${filename}`)
  console.log(`========================================`)

  // Use the Supabase SQL endpoint via pg_net or direct connection
  // We'll use the PostgREST approach via a helper function, or fall back to
  // executing via the management API
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ query: sql }),
  })

  // If PostgREST doesn't support raw SQL, use pg module directly
  if (!response.ok) {
    // Fallback: use the pg module for direct SQL execution
    const { default: pg } = await import("pg")
    
    // Extract connection details from the Supabase URL
    const url = new URL(SUPABASE_URL)
    const projectRef = url.hostname.split(".")[0]
    
    const client = new pg.Client({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: SUPABASE_SERVICE_KEY,
      ssl: { rejectUnauthorized: false },
    })

    try {
      await client.connect()
      const result = await client.query(sql)
      console.log(`  -> Success`)
      if (result.rowCount !== null) {
        console.log(`  -> Rows affected: ${result.rowCount}`)
      }
    } catch (err) {
      console.error(`  -> Error: ${err.message}`)
      throw err
    } finally {
      await client.end()
    }
    return
  }

  console.log(`  -> Success (via REST API)`)
}

async function main() {
  const scriptsDir = __dirname
  const sqlFiles = readdirSync(scriptsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort()

  console.log(`Found ${sqlFiles.length} SQL scripts to run:`)
  sqlFiles.forEach((f, i) => console.log(`  ${i + 1}. ${f}`))

  for (const file of sqlFiles) {
    const filepath = join(scriptsDir, file)
    const sql = readFileSync(filepath, "utf-8")
    try {
      await executeSql(sql, file)
    } catch (err) {
      console.error(`\nFailed on ${file}: ${err.message}`)
      console.error(`Stopping migration.`)
      process.exit(1)
    }
  }

  console.log(`\n========================================`)
  console.log(`All ${sqlFiles.length} scripts completed successfully!`)
  console.log(`========================================`)
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
