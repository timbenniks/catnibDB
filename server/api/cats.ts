import { serverSupabaseClient } from '#supabase/server'
import { addCatData } from "../../lib/helpers"

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

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