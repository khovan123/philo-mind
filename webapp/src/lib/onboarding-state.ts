let onboardingComplete = false;

export function markOnboardingComplete() {
  onboardingComplete = true;
}

export function shouldShowOnboarding() {
  return !onboardingComplete;
}
