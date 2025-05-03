import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';

export function parseSettings({
  demosReady,
  startDemosCount,
  upvotesMultiplier,
  moneyTarget,
  savedAmount,
  currency,
  globalUpdatedAt,
}: SettingsModel): SettingsClientModel {
  return {
    demosReady,
    startDemosCount,
    upvotesMultiplier,
    globalUpdatedAt: new Date(globalUpdatedAt),
    moneyTarget,
    savedAmount,
    currency,
  };
}
