import { neon } from '@neondatabase/serverless'

let initialized: Promise<void> | undefined

export function getSql() {
  const config = useRuntimeConfig()
  const databaseUrl = config.databaseUrl || process.env.DATABASE_URL
  if (!databaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Database is not configured. Add DATABASE_URL.' })
  }
  return neon(databaseUrl)
}

export async function ensurePurchasesTable() {
  if (!initialized) {
    const sql = getSql()
    initialized = sql`
      CREATE TABLE IF NOT EXISTS purchases (
        id BIGSERIAL PRIMARY KEY,
        offer_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined).catch((error) => {
      initialized = undefined
      throw error
    })
  }
  await initialized
}