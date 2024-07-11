import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { search } = req.query;
    const images = await searchImages(search);
    res.json(images);
  }
}

export async function searchImages(search): Promise<UnsplashImage[]> {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${search}&page=1&per_page=15&order_by=relevant`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );
  if (!response.ok) return [];

  const data = await response.json();
  // Handle the data returned from the API
  const photos = data.results;
  const downloadLinks = photos.map((photo) => photo.links.download);
  const thumbLinks = photos.map((photo) => photo.urls.thumb);
  const regular = photos.map((photo) => photo.urls.regular);
  return photos.map((photo, idx) => ({
    thumb: thumbLinks[idx],
    full: downloadLinks[idx],
    regular: regular[idx],
  }));
}
