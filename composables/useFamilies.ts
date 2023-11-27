// import { addCatData } from "../lib/helpers"
export async function useFamilies() {
  const client = useSupabaseClient();

  const { data: families } = await useAsyncData(`families`, async () => {
    const { data } = await client
      .from("families")
      .select('*')

    if (!data) {
      return;
    }

    return data.map((fam: any) => {
      return {
        "id": fam.id,
        "name": fam.name,
        "address": fam.address,
        "email": fam.email,
        "phone": fam.phone,
        "family_type": fam.family_type
      }
    })
  })

  return families
}