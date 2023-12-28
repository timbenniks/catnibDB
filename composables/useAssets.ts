import prettyBytes from 'pretty-bytes';

export async function useAssets(bucket: string) {
  const client = useSupabaseClient();

  const {
    public: { supaseImgBase },
  } = useRuntimeConfig();

  const { data: assets, refresh } = await useAsyncData(`assets-${bucket}`, async () => {
    const images = await client.storage.from(bucket).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    return images.data?.map(image => {
      return {
        id: image.id,
        url: `${supaseImgBase}${bucket}/${image.name}`,
        name: image.name,
        size: prettyBytes(image.metadata.size),
        mimetype: image.metadata.mimetype,
        created: image.updated_at
      }
    })
  })

  return { assets, refresh }
}