import { apiGet } from "./http";

export type LibraryListItem = {
  id: string;
  name: string;
};

export type GetLibrariesResponse = LibraryListItem[];

export async function getMyLibraries() {
  return apiGet<GetLibrariesResponse>(
    `/api/libraries`
  );
}