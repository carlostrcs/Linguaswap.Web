import { apiPost } from "./http";

export type TermDto = {
    languageCode: string;
    text: string;
}

export type CreateVocabItemRequest = {
    libraryId: string;
    terms: TermDto[];
}

export type CreateVocabItemResponse = {
    vocabItemId: string;
}

export async function createVocabItem(libraryId: string, terms: TermDto[]) {
    const body: CreateVocabItemRequest = {
        libraryId,
        terms
    }
    return apiPost<CreateVocabItemResponse, CreateVocabItemRequest>(`/api/vocab/items`, body)
}