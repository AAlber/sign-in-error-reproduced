export function transformToEmbedNoCookieLink(url: string): string {
  // Check if URL is already an embedded link
  if (url.includes("embed")) {
    const videoID = url.split("/")[4];
    const embeddedLink = `https://www.youtube-nocookie.com/embed/${videoID}`;
    return embeddedLink;
  }
  // Check if URL is a search result link
  if (url.includes("watch?v=")) {
    const videoID = url.split("v=")[1]?.split("&")[0];
    const embeddedLink = `https://www.youtube-nocookie.com/embed/${videoID}`;
    return embeddedLink;
  }
  // Check if URL is a short link
  if (url.includes("youtu.be/")) {
    const videoID = url.split("/").pop();
    const embeddedLink = `https://www.youtube-nocookie.com/embed/${videoID}`;
    return embeddedLink;
  }
  // Extract the video ID from the URL
  let videoID: any = "";
  if (url.includes("?v=")) {
    videoID = url.split("?v=")[1]?.split("&")[0];
  } else if (url.includes("/v/")) {
    videoID = url.split("/v/")[1]?.split("?")[0];
  } else if (url.includes("/embed/")) {
    videoID = url.split("/embed/")[1]?.split("?")[0];
  } else {
    videoID = url.split("/").pop()!;
  }
  // Construct the embedded YouTube link
  const embeddedLink = `https://www.youtube-nocookie.com/embed/${videoID}`;
  // Return the embedded link
  return embeddedLink;
}

export function getThumbnailFromYouTubeNoCookieURL(url: string): string {
  // Extract the video ID from the URL
  let videoID = "";
  if (url.includes("?v=")) {
    videoID = url.split("?v=")[1]!;
  } else {
    videoID = url.split("/").pop()!;
  }
  // Construct the embedded YouTube link
  const thumbnailLink = `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
  // Return the embedded link
  return thumbnailLink;
}

export function getThumbnailFromVimeoURL(url: string): string {
  // Extract the video ID from the URL
  let videoID = "";
  if (url.includes(".com/")) {
    videoID = url.split(".com/")[1] || "";
  } else {
    videoID = url.split("/").pop()!;
  }
  // Construct the Vumbnail URL
  const thumbnailLink = "https://vumbnail.com/" + videoID + "_medium.jpg";
  // Return the thumbnail URL
  return thumbnailLink;
}
