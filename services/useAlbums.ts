import { useQuery } from "react-query";
import { whippo_album } from "@prisma/client";

const API_URL = "/api/albums";

const getAlbums = async () => {
  if (!API_URL) {
    throw new Error("could not find API BASE URL, check your config");
  }
  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch albums");
  }

  return await res.json();
};

export const useAlbums = () =>
  useQuery<whippo_album[], Error>("albums", getAlbums);
