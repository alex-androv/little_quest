import { z } from 'zod'
import { ensurePurchasesTable, getSql } from '../utils/db'

const restoreSchema = z.object({ deviceId: z.string().min(8).max(100) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = restoreSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Could not identify this device.' })
  }

  await ensurePurchasesTable()
  const sql = getSql()
  const purchases = await sql`
    SELECT offer_id, purchased_at
    FROM purchases
    WHERE device_id = ${parsed.data.deviceId}
    ORDER BY purchased_at DESC
  `

  return {
    purchases: purchases.map((purchase) => ({
      offerId: purchase.offer_id,
      purchasedAt: purchase.purchased_at
    }))
  }
})