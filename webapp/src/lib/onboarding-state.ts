import { useEffect, useState } from "react";

import { securePersistStorage } from "@/stores/persistStorage";

const ONBOARDING_COMPLETE_KEY = "philomind.onboardingComplete.v1";

let onboardingComplete: boolean | null = null;

export async function markOnboardingComplete() {
  onboardingComplete = true;
  await securePersistStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
}

export async function shouldShowOnboarding() {
  if (onboardingComplete !== null) {
    return !onboardingComplete;
  }

  const value = await securePersistStorage.getItem(ONBOARDING_COMPLETE_KEY);
  onboardingComplete = value === "true";
  return !onboardingComplete;
}

export function useShouldShowOnboarding() {
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    shouldShowOnboarding()
      .then((value) => {
        if (active) {
          setShouldShow(value);
        }
      })
      .catch(() => {
        if (active) {
          setShouldShow(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return shouldShow;
}
