import { addCatData } from "../lib/helpers"
export async function useCats() {
  const client = useSupabaseClient();

  const { data: cats } = await useAsyncData(`cats`, async () => {
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

    if (!data) {
      return;
    }

    let result = await Promise.all(
      data.map(async (cat: any) => {
        return await addCatData(cat, client);
      })
    );

    return result;

  })

  return cats
}