import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id, slug } = getQuery(event)

  if (!id && !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID or slug should be present',
    })
  }

  let query = client
    .from("pages")
    .select("*")

  if (slug) {
    query = query.eq("slug", slug)
  }

  if (id) {
    query = query.eq("id", id)
  }

  const { data, error } = await query.single();

  if (error) {
    throw createError(error)
  }

  return data
})