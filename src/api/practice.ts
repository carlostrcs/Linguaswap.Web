import { apiGet, apiPost } from "./http";

export type GetNextPracticeWordResponse = {
  wordId: string;
  prompt: string;
};

export type SubmitAttemptRequest = {
  wordId: string;
  userAnswer: string;
};

export type SubmitAttemptResponse = {
  isCorrect: boolean;
  correctAnswer: string;
};

export async function getNextPracticeWord(sessionId: string) {
  return apiGet<GetNextPracticeWordResponse>(
    `/api/practice/sessions/${sessionId}/next`
  );
}

export async function submitAttempt(
  sessionId: string,
  body: SubmitAttemptRequest
) {
  return apiPost<SubmitAttemptResponse, SubmitAttemptRequest>(
    `/api/practice/sessions/${sessionId}/attempts`,
    body
  );
}