import { serverSupabaseClient } from '#supabase/server'
import { addCatData } from "../../lib/helpers"

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { per_page, order_by, order_direction } = getQuery(event)

  const { data, error } = await client
    .from("cats")
    .select(`*,
        host_family_id(
          id,name,address,email,phone
        ),
        adoption_family_id(
          id,name,address,email,phone
        )
      `)
    .order(order_by as string || 'id', { ascending: order_direction === 'asc' })
    .limit(Number(per_page || 20))

  if (error) {
    throw createError(error)
  }

  let result = await Promise.all(
    data.map(async (cat: any) => {
      return await addCatData(cat, client);
    })
  );

  return result
})