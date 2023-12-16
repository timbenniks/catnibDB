export async function usePages() {
  const client = useSupabaseClient();

  const { data: pages } = await useAsyncData(`pages`, async () => {
    const { data } = await client
      .from("pages")
      .select('*')

    if (!data) {
      return;
    }

    return data
  })

  return pages
}