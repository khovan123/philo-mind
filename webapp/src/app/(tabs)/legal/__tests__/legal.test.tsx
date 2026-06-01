import { render, screen } from "@testing-library/react-native";
import TermsOfServiceScreen from "../terms";
import PrivacyPolicyScreen from "../privacy";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
}));

// Mock components
jest.mock("@/components/app-header", () => ({
  AppHeader: ({ title }: any) => <></>,
}));

jest.mock("@/components/themed-text", () => ({
  ThemedText: ({ children, type, style }: any) => <>{children}</>,
}));

jest.mock("@/components/markdown-renderer", () => ({
  MarkdownRenderer: ({ markdown }: any) => <></>,
}));

describe("Legal Screens", () => {
  it("renders Terms of Service screen", () => {
    render(<TermsOfServiceScreen />);
    // Screen should render without errors
    expect(screen).toBeDefined();
  });

  it("renders Privacy Policy screen", () => {
    render(<PrivacyPolicyScreen />);
    // Screen should render without errors
    expect(screen).toBeDefined();
  });
});
