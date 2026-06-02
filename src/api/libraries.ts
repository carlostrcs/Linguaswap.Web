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

export async function getLibraryItems(libraryId: string){
  return apiGet<GetLibraryItemsResponse>(`/api/libraries/${libraryId}/items`);
}