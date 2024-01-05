export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const { 'x-api-key': apiKey } = getRequestHeaders(event)

  if (!apiKey) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No API key present',
    })
  }

  if (apiKey !== config.apiKey) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Wrong API key',
    })
  }
})
