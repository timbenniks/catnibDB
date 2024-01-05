import { serverSupabaseClient } from '#supabase/server'
import { addCatData } from "../../lib/helpers"

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id } = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be present',
    })
  }

  const { data } = await client
    .from("cats")
    .select(`*,
        host_family_id(
          id,name,address,email,phone,family_type
        ),
        adoption_family_id(
          id,name,address,email,phone,family_type
        )
      `)
    .eq("id", id)
    .single();

  return {
    apiKey: event.context.apiKey,
    ...await addCatData(data, client)
  }
})