export async function useComponents() {
  const client = useSupabaseClient();

  const { data: components } = await useAsyncData(`components`, async () => {
    const { data } = await client
      .from("components")
      .select('*')

    if (!data) {
      return;
    }

    return data
  })

  return components
}