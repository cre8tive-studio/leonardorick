import type { Models } from 'appwrite';
import type { AudioModel } from '~/types/audio.model';
import type { ReleaseModel } from '~/types/release.model';

export function parseReleases(res: Models.DocumentList<ReleaseModel>): AudioModel[] {
  return res.documents.map((release) => ({
    id: release.$id,
    title: release.title,
    spotify: release.spotify,
    fileId: release.fileId,
    imageUrl: release.imageUrl,
    appleMusic: release.appleMusic,
    youtube: release.youtube,
    amazonMusic: release.amazonMusic,
    featured: release.featured,
    number: release.number,
    releaseDate: release.releaseDate ? new Date(release.releaseDate) : null,
  })) as AudioModel[];
}
