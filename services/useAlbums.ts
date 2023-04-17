import { useQuery } from "react-query";
import { AlbumsResponse } from "@/pages/api/albums";

interface AlbumsQuery {
  page?: number;
  size?: number;
}

const API_URL = "/api/albums";

const getAlbums = async ({
  page = 1,
  size = 20,
}: AlbumsQuery = {}): Promise<AlbumsResponse> => {
  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const res = await fetch(`${API_URL}?${queryParams.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch albums");
  }

  return await res.json();
};

export const useAlbums = (query?: AlbumsQuery) =>
  useQuery<AlbumsResponse, Error>(["albums", query], () => getAlbums(query), {
    keepPreviousData: true,
  });
