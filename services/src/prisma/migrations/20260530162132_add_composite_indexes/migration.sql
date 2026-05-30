-- DropIndex
DROP INDEX "ai_chat_messages_session_id_idx";

-- DropIndex
DROP INDEX "ai_chat_sessions_user_id_idx";

-- DropIndex
DROP INDEX "debate_arguments_debate_id_idx";

-- DropIndex
DROP INDEX "debate_comments_argument_id_idx";

-- DropIndex
DROP INDEX "debates_status_idx";

-- DropIndex
DROP INDEX "debates_topic_id_idx";

-- DropIndex
DROP INDEX "lessons_status_idx";

-- DropIndex
DROP INDEX "lessons_topic_id_idx";

-- DropIndex
DROP INDEX "notifications_user_id_is_read_idx";

-- DropIndex
DROP INDEX "quiz_attempts_quiz_id_idx";

-- DropIndex
DROP INDEX "quiz_attempts_user_id_idx";

-- DropIndex
DROP INDEX "refresh_tokens_session_id_idx";

-- DropIndex
DROP INDEX "refresh_tokens_user_id_idx";

-- DropIndex
DROP INDEX "reports_status_idx";

-- DropIndex
DROP INDEX "short_lesson_comments_short_lesson_id_idx";

-- DropIndex
DROP INDEX "story_decisions_session_id_idx";

-- DropIndex
DROP INDEX "story_sessions_user_id_idx";

-- DropIndex
DROP INDEX "user_sessions_status_idx";

-- DropIndex
DROP INDEX "user_sessions_user_id_idx";

-- CreateIndex
CREATE INDEX "ai_chat_messages_session_id_created_at_idx" ON "ai_chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_chat_sessions_user_id_created_at_idx" ON "ai_chat_sessions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "debate_arguments_debate_id_vote_count_idx" ON "debate_arguments"("debate_id", "vote_count");

-- CreateIndex
CREATE INDEX "debate_comments_argument_id_created_at_idx" ON "debate_comments"("argument_id", "created_at");

-- CreateIndex
CREATE INDEX "debates_topic_id_status_idx" ON "debates"("topic_id", "status");

-- CreateIndex
CREATE INDEX "lessons_topic_id_status_idx" ON "lessons"("topic_id", "status");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_quiz_id_idx" ON "quiz_attempts"("user_id", "quiz_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_revoked_at_idx" ON "refresh_tokens"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_revoked_at_idx" ON "refresh_tokens"("session_id", "revoked_at");

-- CreateIndex
CREATE INDEX "reports_status_created_at_idx" ON "reports"("status", "created_at");

-- CreateIndex
CREATE INDEX "short_lesson_comments_short_lesson_id_created_at_idx" ON "short_lesson_comments"("short_lesson_id", "created_at");

-- CreateIndex
CREATE INDEX "story_decisions_session_id_created_at_idx" ON "story_decisions"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "story_sessions_user_id_story_id_status_idx" ON "story_sessions"("user_id", "story_id", "status");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_status_idx" ON "user_sessions"("user_id", "status");
