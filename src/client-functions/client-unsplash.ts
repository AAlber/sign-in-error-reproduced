import api from "../pages/api/api";

export const searchUnsplashImages = async (search: string) => {
  const result = await fetch(api.searchUnsplash + `?search=${search}`, {
    method: "GET",
  });
  const resImages = await result.json();
  return resImages;
};
