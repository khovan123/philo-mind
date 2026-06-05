// Redirecting to shared library
import type { SubmitQuizAnswerInput } from "@philo-mind/shared";

export {
  listQuizzesSchema,
  quizIdSchema,
  lessonQuizSchema,
  attemptIdSchema,
  submitQuizAnswerSchema,
  type ListQuizzesInput,
  type SubmitQuizAnswerInput,
  type ListQuizzesQuery,
} from "@philo-mind/shared";

export type SubmitAnswerInput = SubmitQuizAnswerInput;
