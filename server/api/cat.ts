import { serverSupabaseClient } from '#supabase/server'
import { addCatData } from "../../lib/helpers"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const client = await serverSupabaseClient(event)
  const { id } = getQuery(event)

  if (!event.context.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No API key present',
    })
  }

  if (!event.context.apiKey !== config.apiKey) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Wrong API key',
    })
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be present',
    })
  }

  const { data, error } = await client
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

  if (error) {
    throw createError(error)
  }

  return await addCatData(data, client)
})