import { apiGet, apiPost } from "./http";

export type LibraryListItem = {
  id: string;
  name: string;
};

export type GetLibrariesResponse = LibraryListItem[];

export type CreateLibraryResult = {
  libraryId: string;
};

export type CreateLibraryRequest = {
  name: string;
};

export type GetLibraryItemsResponse = {
  items: GetLibraryItemsItem[];
}

export type GetLibraryItemsItem = {
  vocabItemId: string;
  terms: GetLibraryItemsTerm[];
}

export type GetLibraryItemsTerm = {
  id: string;
  languageCode: string;
  text: string;
}

export type PracticeLanguagePairResult = {
  sourceLanguage: string;
  targetLanguage: string;
  vocabItemCount: number;
}

export type GetLibraryPracticeOptionsResult = {
  libraryId: string;
  languages: string[];
  pairs: PracticeLanguagePairResult[];
}

export async function getMyLibraries() {
  return apiGet<GetLibrariesResponse>(
    `/api/libraries`
  );
};

export async function createLibrary(name: string) {
  return apiPost<CreateLibraryResult, CreateLibraryRequest>(
    '/api/libraries', {name}
  );
};

export async function getLibraryItems(libraryId: string) {
  return apiGet<GetLibraryItemsResponse>(`/api/libraries/${libraryId}/items`);
}

export async function getLibraryPracticeOptions(libraryId: string) {
  return apiGet<GetLibraryPracticeOptionsResult>(`/api/libraries/${libraryId}/practice-options`);
}