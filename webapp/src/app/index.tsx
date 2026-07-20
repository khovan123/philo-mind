import { Redirect } from "expo-router";

import { useShouldShowOnboarding } from "@/lib/onboarding-state";

export default function IndexRoute() {
  const shouldShowOnboarding = useShouldShowOnboarding();

  if (shouldShowOnboarding === null) {
    return null;
  }

  if (shouldShowOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
