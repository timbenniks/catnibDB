export async function usePage(pageId: number) {
  const client = useSupabaseClient();

  const { data: page } = await useAsyncData(`page-${pageId}`, async () => {
    const { data } = await client
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .single();

    return data
  })

  return page
}