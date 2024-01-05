import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id } = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be present',
    })
  }

  const { data, error } = await client
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {
    throw createError(error)
  }

  return data
})