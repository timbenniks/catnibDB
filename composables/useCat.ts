import { addCatData } from "../lib/helpers"
export async function useCat(catId: number) {
  const client = useSupabaseClient();

  const { data: cat } = await useAsyncData(`cat-${catId}`, async () => {
    const { data } = await client
      .from("cats")
      .select(`*,
        host_family_id(
          id,name,address,email,phone
        ),
        adoption_family_id(
          id,name,address,email,phone
        )
      `)
      .eq("id", catId)
      .single();

    return await addCatData(data, client)
  })

  return cat
}