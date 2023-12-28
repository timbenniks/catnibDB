export async function useDeleteAsset(name: string, bucket: string) {
  const client = useSupabaseClient();

  const { data, error } = await client
    .storage
    .from(bucket)
    .remove([name])

  return { data, error }
}