import type { SupabaseClient } from "@supabase/supabase-js";
import algoliasearch from "algoliasearch";
import slugify from '@sindresorhus/slugify';
import camelCase from "camelcase";

export async function newCat(name: any, client: SupabaseClient) {
  const newCat = {
    name,

    sex: "male",
    images: "",
    color: "",
    chip_id: "",

    birth_date: null,
    adoption_date: null,
    arrival_date: null,
    protocol_date: null,
    host_family_id: null,
    adoption_family_id: null,

    notes: "",
    care_received: "",
    character: "",
    history: "",

    reserved: false,
    adopted: false,
    deceased: false,
    chipped: false,
    certificate_healthy: false,
    health_book: false,
    sterilised: false,
    with_dogs: false,
    with_cats: false,
    deed_of_transfer: false,
  }

  const { data, error } = await client
    .from('cats')
    .insert(newCat)
    .select()
    .single()

  return { data, error }
}

export async function updateCat(catObject: any, client: SupabaseClient) {
  const catToUpdate = JSON.parse(JSON.stringify(catObject))

  const toSave = {
    name: catToUpdate.name,
    birth_date: catToUpdate.birth_date,
    adoption_date: catToUpdate.adoption_date,
    chipped: catToUpdate.chipped,
    certificate_healthy: catToUpdate.certificate_healthy,
    health_book: catToUpdate.health_book,
    sterilised: catToUpdate.sterilised,
    with_dogs: catToUpdate.with_dogs,
    with_cats: catToUpdate.with_cats,
    character: catToUpdate.character,
    reserved: catToUpdate.reserved,
    adopted: catToUpdate.adopted,
    deceased: catToUpdate.deceased,
    sex: catToUpdate.sex,
    images: catToUpdate.images,
    color: catToUpdate.color,
    arrival_date: catToUpdate.arrival_date,
    history: catToUpdate.history,
    protocol_date: catToUpdate.protocol_date,
    care_received: catToUpdate.care_received,
    host_family_id: catToUpdate.host_family_id?.id || null,
    adoption_family_id: catToUpdate.adoption_family_id?.id || null,
    chip_id: catToUpdate.chip_id,
    notes: catToUpdate.notes,
    deed_of_transfer: catToUpdate.deed_of_transfer,
  }

  const { error } = await client
    .from('cats')
    .update(toSave)
    .eq('id', catToUpdate.id)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  updateAlgolia(catObject)

  return res
}

export async function deleteCat(catId: number, client: SupabaseClient) {
  const { error } = await client
    .from('cats')
    .delete()
    .eq('id', catId)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function newFamily(name: any, client: SupabaseClient) {
  const newFamily = {
    name,

    email: "",
    phone: "",
    address: "",
    family_type: "host",
  }

  const { data, error } = await client
    .from('families')
    .insert(newFamily)
    .select()
    .single()

  return { data, error }
}

export async function updateFamily(familyObject: any, client: SupabaseClient) {
  const familyToUpdate = JSON.parse(JSON.stringify(familyObject))

  const toSave = {
    name: familyToUpdate.name,
    email: familyToUpdate.email,
    phone: familyToUpdate.phone,
    address: familyToUpdate.address,
    family_type: familyToUpdate.family_type,
  }

  const { error } = await client
    .from('families')
    .update(toSave)
    .eq('id', familyToUpdate.id)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function deleteFamily(famId: number, client: SupabaseClient) {
  const { error } = await client
    .from('families')
    .delete()
    .eq('id', famId)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function newPage(title: any, client: SupabaseClient) {
  const newPage = {
    title,

    slug: slugify(title),
    description: "",
    image: "",
    components: [],
    published: false
  }

  const { data, error } = await client
    .from('pages')
    .insert(newPage)
    .select()
    .single()

  return { data, error }
}

export async function updatePage(pageObject: any, client: SupabaseClient) {
  const pageToUpdate = JSON.parse(JSON.stringify(pageObject))

  const toSave = {
    title: pageToUpdate.title,
    slug: pageToUpdate.slug,
    description: pageToUpdate.description,
    image: pageToUpdate.image,
    components: pageToUpdate.components,
    published: pageToUpdate.published,
  }

  const { error } = await client
    .from('pages')
    .update(toSave)
    .eq('id', pageObject.id)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function deletePage(pageId: number, client: SupabaseClient) {
  const { error } = await client
    .from('pages')
    .delete()
    .eq('id', pageId)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function newComponent(title: any, client: SupabaseClient) {
  const newComponent = {
    title,
    api_id: camelCase(title),
    fields: [],
  }

  const { data, error } = await client
    .from('components')
    .insert(newComponent)
    .select()
    .single()

  return { data, error }
}

export async function updateComponent(componentObject: any, client: SupabaseClient) {
  const componentToUpdate = JSON.parse(JSON.stringify(componentObject))

  const toSave = {
    title: componentToUpdate.title,
    api_id: componentToUpdate.api_id,
    fields: componentToUpdate.fields,
  }

  const { error } = await client
    .from('components')
    .update(toSave)
    .eq('id', componentToUpdate.id)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function deleteComponent(componentId: number, client: SupabaseClient) {
  const { error } = await client
    .from('components')
    .delete()
    .eq('id', componentId)

  let res: 'error' | 'success' = 'success'

  if (error) {
    res = 'error'
  }

  return res
}

export async function updateAlgolia(cat: any) {
  const { public: {
    algoliaId, algoliaAdminApiKey, algoliaIndex }
  } = useRuntimeConfig();

  const algoliaClient = algoliasearch(
    algoliaId,
    algoliaAdminApiKey
  )

  const algoliaIndexManager = algoliaClient.initIndex(algoliaIndex)
  const catForAlgolia = JSON.parse(JSON.stringify(cat))

  catForAlgolia.objectID = cat.id

  await algoliaIndexManager
    .saveObject(catForAlgolia, { autoGenerateObjectIDIfNotExist: true })
    .catch((err) => console.log(err))
}

export async function treatmentsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("treatments")
    .select("id, cat_id, date, notes, treatment_type, treatment_outcome")
    .eq("cat_id", catId);

  return data;
}

export async function weightsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("weight")
    .select("id, cat_id, date, weight_gr")
    .eq("cat_id", catId);

  return data;
}

export function translateLabel(label: string) {
  let translated = '';

  switch (label) {
    case "certificate_healthy":
      translated = "Certificate Medicale"
      break;
    case "chipped":
      translated = "Chipped"
      break;
    case "deceased":
      translated = "Deceased"
      break;
    case "deed_of_transfer":
      translated = "Deed of transfer"
      break;
    case "health_book":
      translated = "Carnet De Santé"
      break;
    case "protocol_date":
      translated = "Protocole"
      break;
    case "adopted":
      translated = "Adopte"
      break;
    case "sterilised":
      translated = "Stérilisée"
      break;
    case "with_cats":
      translated = "Bon Avec Chats"
      break;
    case "with_dogs":
      translated = "Bon Avec Chiens"
      break;
    case "reserved":
      translated = "Reserved"
      break;
    case "vaccination_first":
      translated = "1st vaccination"
      break;
    case "vaccination_second":
      translated = "2nd vaccination"
      break;
    case "test_fiv":
      translated = "Tested for FIV"
      break;
    case "test_felv":
      translated = "Tested for FELV"
      break;
    case "deworm":
      translated = "Dewormed"
      break;
    case "antiparasite_internal":
      translated = "Internal antiparasite"
      break;
    case "antiparasite_external":
      translated = "External antiparasite"
      break;
    case "corona":
      translated = "Corona"
      break;
    case "giardiasis":
      translated = "Giardiasis"
      break;
    case "ringworm":
      translated = "Ringworm"
      break;
    case "diarrhea":
      translated = "Diarrhea"
      break;
    case "cat_fluother":
      translated = "Cat fluother"
      break;
    case "text":
      translated = "Text"
      break;
    case "rich_text":
      translated = "Rich Text"
      break;
    case "dropdown":
      translated = "Drop down"
      break;
    case "checkbox":
      translated = "Checkbox"
      break;
    case "image":
      translated = "Image"
      break;
    case "cats":
      translated = "Cats"
      break;
  }

  return translated;
}

export function addFacets(cat: any, treatments: any) {
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

export async function addCatData(cat: any, client: SupabaseClient) {
  const treatments = await treatmentsByCat(cat.id, client);
  const weights = await weightsByCat(cat.id, client);

  cat.treatments = treatments;
  cat.weights = weights;
  cat.facets = addFacets(cat, treatments)

  return cat
}

export function validateEmail(email: string) {
  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) {
    return false;
  }

  const emailParts = email.split('@');

  if (emailParts.length !== 2) {
    return false;
  }

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) {
    return false;
  }

  else if (address.length > 255) {
    return false;
  }

  const domainParts = address.split('.');

  if (domainParts.some(function (part) {
    return part.length > 63;
  })) {
    return false;
  }

  return tester.test(email);
};