export default defineEventHandler((event) => {
  const { 'x-api-key': apiKey } = getRequestHeaders(event)

  if (apiKey) {
    event.context.apiKey = apiKey;
  }
})
