import type { SupabaseClient } from "@supabase/supabase-js";

export async function treatmentsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("treatments")
    .select("date, notes, treatment_type, treatment_outcome")
    .eq("cat_id", catId);

  return data;
}

export async function weightsByCat(catId: number, client: SupabaseClient) {
  const { data } = await client
    .from("weight")
    .select("date, weight_gr")
    .eq("cat_id", catId);

  return data;
}

export function translateFacetLabel(label: string) {
  let translated = '';

  switch (label) {
    case "certificate_healthy":
      translated = "Certificate Medicale"
      break;

    case "chipped":
      translated = "Chipped"
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
  }

  return translated;
}

export function translateTreatmentLabel(label: string) {
  let translated = '';

  switch (label) {
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
  }

  return translated;
}

export function addFacets(cat: any) {
  const result: any = [];

  for (const [key, value] of Object.entries(cat)) {
    if (key === 'protocol_date' && typeof value === 'string') {
      result.push(key)
    }

    if (typeof value === 'boolean' && value) {
      result.push(key)
    }
  }

  return result
}

export async function addCatData(cat: any, client: SupabaseClient) {
  const treatments = await treatmentsByCat(cat.id, client);
  const weights = await weightsByCat(cat.id, client);

  cat.treatments = treatments;
  cat.weights = weights;
  cat.facets = addFacets(cat)

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