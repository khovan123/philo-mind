import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnswerOption } from "@/features/quiz/AnswerOption";
import { QuestionProgress } from "@/features/quiz/QuestionProgress";
import { SubmitAction } from "@/features/quiz/SubmitAction";

// Mock minimal browser globals needed by react-native-web's TextInput
if (typeof globalThis.window === "undefined") {
  (globalThis as unknown as { window: unknown }).window = globalThis;
}
if (typeof globalThis.document === "undefined") {
  (globalThis as unknown as { document: unknown }).document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
    }),
    createElementNS: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };
}

// ─── Helpers for react-native-web text queries ────────────────────────────────
type TestChild = ReactTestInstance | string;

function getByTextContent(
  instance: { root: ReactTestInstance } | ReactTestInstance,
  text: string,
): ReactTestInstance {
  const root = "root" in instance ? instance.root : instance;
  const match = findNode(root);
  if (!match) {
    throw new Error(`Could not find text: ${text}`);
  }
  return match;

  function findNode(node: ReactTestInstance | string): ReactTestInstance | null {
    if (typeof node === "string") {
      return null;
    }
    const children = node.children as TestChild[];
    // Check direct children for text matching
    if (children.some((child: TestChild) => typeof child === "string" && child.includes(text))) {
      return node;
    }
    // Check props.children for text matching
    if (
      node.props &&
      typeof node.props.children === "string" &&
      node.props.children.includes(text)
    ) {
      return node;
    }
    // Recurse children
    for (const child of children) {
      if (typeof child !== "string") {
        const found = findNode(child);

        if (found) {
          return found;
        }
      }
    }

    return null;
  }
}

function queryByTextContent(
  instance: { root: ReactTestInstance } | ReactTestInstance,
  text: string,
): ReactTestInstance | null {
  try {
    return getByTextContent(instance, text);
  } catch {
    return null;
  }
}

function getPressable(node: ReactTestInstance): ReactTestInstance {
  let current: ReactTestInstance | null = node;
  while (current) {
    if (current.props && "onPress" in current.props) {
      return current;
    }
    current = current.parent;
  }
  return node;
}

function firePress(node: ReactTestInstance) {
  const pressable = getPressable(node);

  if (pressable.props) {
    const isPropsDisabled =
      pressable.props.disabled === true ||
      pressable.props.accessibilityDisabled === true ||
      pressable.props["aria-disabled"] === true;
    if (isPropsDisabled) {
      return;
    }
  }
  fireEvent.press(pressable);
}

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({ id: "session-123" })),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options) {
        return `${key}_with_${JSON.stringify(options)}`;
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));


const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock("@/stores/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selectorFn: (state: unknown) => unknown) => mockSelector(selectorFn),
}));

jest.mock("lucide-react-native", () => ({
  ArrowLeft: () => null,
  Loader2: () => null,
  Send: () => null,
  User: () => null,
  CheckCircle2: () => null,
  XCircle: () => null,
  ArrowRight: () => null,
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Frontend UI & Feature Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Card Component", () => {
    it("renders children content successfully", () => {
      const renderResult = render(
        <Card>
          <Text>Inside Card</Text>
        </Card>,
      );
      expect(getByTextContent(renderResult, "Inside Card")).toBeDefined();
    });

    it("applies custom styles properly", () => {
      const customStyle = { marginTop: 20 };
      const { toJSON } = render(
        <Card style={customStyle}>
          <Text>Styled Card</Text>
        </Card>,
      );
      expect(toJSON()).toBeDefined();
    });
  });

  describe("Button Component", () => {
    it("renders with given title", () => {
      const renderResult = render(<Button title="Click Me" />);
      expect(getByTextContent(renderResult, "Click Me")).toBeDefined();
    });

    it("calls onPress when clicked", () => {
      const onPressMock = jest.fn();
      const renderResult = render(<Button title="Click Me" onPress={onPressMock} />);

      const textNode = getByTextContent(renderResult, "Click Me");
      firePress(textNode);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress and displays activity indicator when loading", () => {
      const onPressMock = jest.fn();
      const renderResult = render(<Button title="Click Me" onPress={onPressMock} loading />);

      const pressableText = queryByTextContent(renderResult, "Click Me");

      expect(pressableText).toBeNull();
    });

    it("is disabled when disabled prop is true", () => {
      const onPressMock = jest.fn();
      const renderResult = render(<Button title="Click Me" onPress={onPressMock} disabled />);

      const textNode = getByTextContent(renderResult, "Click Me");
      firePress(textNode);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe("AnswerOption Component", () => {
    const defaultOption = {
      id: "opt-1",
      label: "A",
      text: "Socrates believed in questioning assumptions.",
      isCorrect: true,
    };

    it("renders option label and text", () => {
      const onSelectMock = jest.fn();
      const renderResult = render(
        <AnswerOption
          option={defaultOption}
          correctOptionId="opt-1"
          disabled={false}
          feedback="idle"
          selectedOptionId={null}
          onSelect={onSelectMock}
        />,
      );
      expect(getByTextContent(renderResult, "A")).toBeDefined();
      expect(
        getByTextContent(renderResult, "Socrates believed in questioning assumptions."),
      ).toBeDefined();
    });

    it("triggers onSelect when pressed", () => {
      const onSelectMock = jest.fn();
      const renderResult = render(
        <AnswerOption
          option={defaultOption}
          correctOptionId="opt-1"
          disabled={false}
          feedback="idle"
          selectedOptionId={null}
          onSelect={onSelectMock}
        />,
      );

      const textNode = getByTextContent(
        renderResult,
        "Socrates believed in questioning assumptions.",
      );
      firePress(textNode);
      expect(onSelectMock).toHaveBeenCalledWith("opt-1");
    });

    it("is disabled when disabled prop is true", () => {
      const onSelectMock = jest.fn();
      const renderResult = render(
        <AnswerOption
          option={defaultOption}
          correctOptionId="opt-1"
          disabled
          feedback="idle"
          selectedOptionId={null}
          onSelect={onSelectMock}
        />,
      );

      const textNode = getByTextContent(
        renderResult,
        "Socrates believed in questioning assumptions.",
      );
      firePress(textNode);
      expect(onSelectMock).not.toHaveBeenCalled();
    });
  });

  describe("QuestionProgress Component", () => {
    it("renders correct progress percent and counts", () => {
      const renderResult = render(<QuestionProgress current={2} progress={0.5} total={4} />);
      expect(
        getByTextContent(renderResult, 'quiz.question_progress_with_{"current":2,"total":4}'),
      ).toBeDefined();
      expect(
        getByTextContent(renderResult, 'quiz.percent_complete_with_{"percent":50}'),
      ).toBeDefined();
    });
  });

  describe("SubmitAction Component", () => {
    it("renders next question label when answered and not last", () => {
      const renderResult = render(
        <SubmitAction
          answered
          disabled={false}
          feedback="correct"
          isLast={false}
          onPress={() => {}}
        />,
      );
      expect(getByTextContent(renderResult, "quiz.next_question")).toBeDefined();
    });

    it("renders view result label when answered and is last question", () => {
      const renderResult = render(
        <SubmitAction answered disabled={false} feedback="correct" isLast onPress={() => {}} />,
      );
      expect(getByTextContent(renderResult, "quiz.view_result")).toBeDefined();
    });

    it("renders submit answer label when not answered and not submitting", () => {
      const renderResult = render(
        <SubmitAction
          answered={false}
          disabled={false}
          feedback="idle"
          isLast={false}
          onPress={() => {}}
        />,
      );
      expect(getByTextContent(renderResult, "quiz.submit_answer")).toBeDefined();
    });

    it("renders submitting label when not answered and submitting", () => {
      const renderResult = render(
        <SubmitAction
          answered={false}
          disabled={false}
          feedback="submitting"
          isLast={false}
          onPress={() => {}}
        />,
      );
      expect(getByTextContent(renderResult, "quiz.submitting")).toBeDefined();
    });
  });
});
