import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';

export function parseSettings({
  previewsReady,
  startPreviewsCount,
  upvotesMultiplier,
  moneyTarget,
  savedAmount,
  currency,
  globalUpdatedAt,
}: SettingsModel): SettingsClientModel {
  return {
    previewsReady,
    startPreviewsCount,
    upvotesMultiplier,
    globalUpdatedAt: new Date(globalUpdatedAt),
    moneyTarget,
    savedAmount,
    currency,
  };
}
