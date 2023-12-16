export async function useComponent(componentId: number) {
  const client = useSupabaseClient();

  const { data: component } = await useAsyncData(`component-${componentId}`, async () => {
    const { data } = await client
      .from("components")
      .select("*")
      .eq("id", componentId)
      .single();

    return data
  })

  return component
}