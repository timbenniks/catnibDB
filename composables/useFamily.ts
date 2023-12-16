export async function useFamily(famId: number) {
  const client = useSupabaseClient();

  const { data: family } = await useAsyncData(`family-${famId}`, async () => {
    const { data } = await client
      .from("families")
      .select("*")
      .eq("id", famId)
      .single();

    return data
  })

  return family
}