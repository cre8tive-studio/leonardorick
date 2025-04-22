import useServerAppwrite from '~/composables/use-server-appwrite';

const { storage, bucketId } = useServerAppwrite();
export default defineEventHandler(async (event) => {
  const { fileId } = await readBody(event);

  try {
    return storage.getFileDownload(bucketId, fileId);
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
