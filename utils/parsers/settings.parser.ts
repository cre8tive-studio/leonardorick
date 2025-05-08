import type { AppwriteSettingsModel, SettingsModel } from '~/types/settings.model';

export function parseSettings({
  previewsReady,
  startPreviewsCount,
  upvotesMultiplier,
  moneyTarget,
  savedAmount,
  currency,
  storageVersion,
}: AppwriteSettingsModel): SettingsModel {
  return {
    previewsReady,
    startPreviewsCount,
    upvotesMultiplier,
    storageVersion,
    moneyTarget,
    savedAmount,
    currency,
  };
}
