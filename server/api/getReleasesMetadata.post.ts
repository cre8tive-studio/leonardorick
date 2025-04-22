import useServerAppwrite from '~/composables/use-server-appwrite';
import { AudioModel } from '~/types/audio.model';
import type { ReleaseModel } from '~/types/release.model';

const { databases, databaseId, collections } = useServerAppwrite();

export default defineEventHandler(async () => {
  console.log('databaseId', databaseId, 'collection.releases', collections.releases);
  const query = await databases.listDocuments<ReleaseModel>(databaseId, collections.releases);

  return query.documents.map((release) => ({
    id: release.$id,
    name: release.name,
    spotify: release.spotify,
    fileId: release.fileId,
    imageUrl: release.imageUrl,
    appleMusic: release.appleMusic,
    featured: release.featured,
  })) as AudioModel[];
});
