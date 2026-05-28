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