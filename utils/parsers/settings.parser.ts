import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';

export function parseSettings({
  demosReady,
  startDemosCount,
  upvotesMultiplier,
  moneyTarget,
  savedAmount,
  currency,
}: SettingsModel): SettingsClientModel {
  return {
    demosReady,
    startDemosCount,
    upvotesMultiplier,
    moneyTarget,
    savedAmount,
    currency,
  };
}
