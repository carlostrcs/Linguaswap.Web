import { apiDelete, apiPost, apiPut } from "./http";

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

export type UpdateTermRequest = {
    languageCode: string;
    text: string;
}

export type UpdateTermResponse = {
    termId: string;
}

export async function createVocabItem(libraryId: string, terms: TermDto[]) {
    const body: CreateVocabItemRequest = {
        libraryId,
        terms
    }
    return apiPost<CreateVocabItemResponse, CreateVocabItemRequest>(`/api/vocab/items`, body)
}

export async function deleteVocabItem(vocabItemId: string): Promise<void>{
    return apiDelete(`/api/vocab/items/${vocabItemId}`);
}

export async function deleteTerm(termId: string): Promise<void>{
    return apiDelete(`/api/vocab/terms/${termId}`);
}

export async function updateTerm(termId: string, languageCode: string, text: string): Promise<UpdateTermResponse>{
    const body: UpdateTermRequest = {
        languageCode,
        text
    }
    return apiPut<UpdateTermResponse, UpdateTermRequest>(`/api/vocab/terms/${termId}`, body);
}