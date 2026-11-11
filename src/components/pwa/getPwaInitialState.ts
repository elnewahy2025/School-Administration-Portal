import { detectIosDevice } from "./detectIosDevice";
import { isStandaloneMode } from "./isStandaloneMode";
import { pwaStorageKeys } from "./pwaStorageKeys";

export interface PwaInitialState {
  isIos: boolean;
  isStandalone: boolean;
  isDismissed: boolean;
}

export function getPwaInitialState(): PwaInitialState {
  if (typeof window === "undefined") {
    return { isIos: false, isStandalone: false, isDismissed: false };
  }

  let installed = false;
  let sessionDismissed = false;

  try {
    installed = window.localStorage?.getItem(pwaStorageKeys.installed) === "true";
    sessionDismissed =
      window.sessionStorage?.getItem(pwaStorageKeys.dismissedSession) === "true";
  } catch {
    // Storage access can throw in restrictive sandboxes
  }

  const standalone = isStandaloneMode() || installed;
  const isIos = detectIosDevice();

  return { isIos, isStandalone: standalone, isDismissed: sessionDismissed };
}
