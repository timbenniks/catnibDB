import { addCatData } from "../lib/helpers"
export async function useCat(catId: number) {
  const client = useSupabaseClient();

  const { data: cat } = await useAsyncData(`cat-${catId}`, async () => {
    const { data } = await client
      .from("cats")
      .select(`*,
        host_family_id(
          id,name,address,email,phone,family_type
        ),
        adoption_family_id(
          id,name,address,email,phone,family_type
        )
      `)
      .eq("id", catId)
      .single();

    return await addCatData(data, client)
  })

  return cat
}