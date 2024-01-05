import type { SupabaseClient } from "@supabase/supabase-js";
import { serverSupabaseClient } from '#supabase/server'

async function treatmentsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("treatments")
    .select("id, cat_id, date, notes, treatment_type, treatment_outcome")
    .eq("cat_id", catId);

  return data;
}

async function weightsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("weight")
    .select("id, cat_id, date, weight_gr")
    .eq("cat_id", catId);

  return data;
}

async function addFacets(cat: any, treatments: any) {
  const result: any = [];

  for (const [key, value] of Object.entries(cat)) {
    if (key === 'protocol_date' && typeof value === 'string') {
      result.push(key)
    }

    if (typeof value === 'boolean' && value) {
      result.push(key)
    }
  }

  treatments.forEach((treatment: any) => {
    result.push(treatment.treatment_type)
  });

  return result
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { id } = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be present',
    })
  }

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
    .eq("id", id)
    .single();

  if (data) {
    const treatments = await treatmentsByCat(data.id, client)
    const weights = await weightsByCat(data.id, client)
    const facets = await addFacets(data, treatments)

    data.treatments = treatments
    data.weights = weights
    data.facets = facets

    return data
  }
  else {
    throw createError({
      statusCode: 404,
      statusMessage: 'Cat not found',
    })
  }
})