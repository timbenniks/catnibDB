export default defineEventHandler((event) => {
  const { 'x-api-key': apiKey } = getRequestHeaders(event)
  event.context.apiKey = apiKey || 'jaap'
})
