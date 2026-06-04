import { Redirect } from "expo-router";

import { shouldShowOnboarding } from "@/lib/onboarding-state";

export default function IndexRoute() {
  if (shouldShowOnboarding()) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
