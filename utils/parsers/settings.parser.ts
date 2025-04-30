import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';

export function parseSettings({
  availableDemosCount,
  demosReady,
  startDemosCount,
  upvotesMultiplier,
  moneyTarget,
  savedAmount,
  currency,
}: SettingsModel): SettingsClientModel {
  return {
    availableDemosCount,
    demosReady,
    startDemosCount,
    upvotesMultiplier,
    moneyTarget,
    savedAmount,
    currency,
  };
}
