import { z } from 'zod'
import { ensurePurchasesTable, getSql } from '../utils/db'

const purchaseSchema = z.object({
  offerId: z.enum(['monthly', 'yearly']),
  deviceId: z.string().min(8).max(100)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = purchaseSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Please choose a valid plan and try again.' })
  }

  await ensurePurchasesTable()
  const sql = getSql()
  const rows = await sql`
    INSERT INTO purchases (offer_id, device_id)
    VALUES (${parsed.data.offerId}, ${parsed.data.deviceId})
    RETURNING id, offer_id, purchased_at
  `

  return {
    success: true,
    purchase: {
      id: String(rows[0].id),
      offerId: rows[0].offer_id,
      purchasedAt: rows[0].purchased_at
    }
  }
})