export default defineEventHandler((event) => {
  //const { 'x-api-key': apiKey } = getRequestHeaders(event)
  const apiKey = 'jaap'
  event.context.apiKey = apiKey;
})
