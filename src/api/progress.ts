import { apiGet } from "./http";

export type GetProgressSummaryRequest = {
    source: string;
    target: string;
}

export type GetProgressSummaryResult = {
    totalAttempts: number,
    correctAttempts: number,
    accuracy: number,
    distinctWords: number
}

export type GetProgressHistoryRequest = {
    source: string;
    target: string;
    days: number;
}

export type GetProgressHistoryResult = {
    day: string;
    attempts: number;
    correct: number;
}

export type GetProgressByLanguageResult = {
    targetLanguage: string;
    distinctWords: number;
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
}

export type GetProgressByPairResult = {
    sourceLanguage: string;
    targetLanguage: string;
    distinctWords: number;
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
}

export type GetTopMistakesRequest = {
    source: string;
    target: string;
    limit: number;
}

export type GetTopMistakesResult = {
    vocabItemId: string;
    correct: number;
    wrong: number;
    accuracy: number;
}

export function getProgressSummary(request: GetProgressSummaryRequest) {
    const params = new URLSearchParams({
        source: request.source,
        target: request.target
    })
    return apiGet<GetProgressSummaryResult>(`/api/progress/summary?${params.toString()}`);
}

export function getProgressHistory(request: GetProgressHistoryRequest) {
    const params = new URLSearchParams({
        source: request.source,
        target: request.target,
        days: request.days.toString()
    })
    return apiGet<GetProgressHistoryResult[]>(`/api/progress/history?${params.toString()}`);
}

export function getProgressByLanguage() {
    return apiGet<GetProgressByLanguageResult[]>(`/api/progress/by-language`);
}

export function getProgressByPair() {
    return apiGet<GetProgressByPairResult[]>(`/api/progress/by-pair`);
}

export function getTopMistakes(request: GetTopMistakesRequest) {
    const params = new URLSearchParams({
        source: request.source,
        target: request.target,
        limit: request.limit.toString()
    })
    return apiGet<GetTopMistakesResult[]>(`/api/progress/top-mistakes?${params.toString()}`);
}