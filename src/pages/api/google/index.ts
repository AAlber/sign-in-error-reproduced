import type { NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    const fileId = req.body.fileId;
    let url = `https://www.googleapis.com/drive/v3/files?`;

    if (fileId) {
      url = `${url}q='${req.body.fileId}'+in+parents&`;
    }

    const parseCookie = cookies
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});

    const googleFiles: any = {
      nextPageToken: "",
      files: [],
    };

    await fetch(
      `${url}fields=nextPageToken,files/modifiedByMeTime, files/id,files/name,files/size,files/webContentLink,files/mimeType,files/webViewLink,files/fileExtension,files/thumbnailLink&` +
        new URLSearchParams({
          q: "'root' in parents and trashed=false",
          // TO DO add next pages
          // pageToken: pageToken,
        }),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parseCookie?.google_access_token}`,
        },
      },
    )
      .then((file) => file.json())
      .then((files) => {
        googleFiles.nextPageToken = files?.nextPageToken;
        (files?.files || []).filter((item) => {
          const type = fileTypes(item?.name, item?.mimeType);
          googleFiles.files.push({
            id: item?.id,
            name: item?.name || "",
            lastModified: type !== "folder" ? item?.modifiedByMeTime : "",
            type: type,
            source: item?.webContentLink,
            viewLink: item?.thumbnailLink,
            size: item?.size,
          });
        });
      });

    res.setHeader("Cache-Control", "max-age=30 revalidate=90");

    res.json({
      data: googleFiles,
      code: 200,
      error: null,
    });
  } catch (error) {
    res.json({
      data: [],
      code: 400,
      error: error,
    });
  }
}

export const fileTypes = (fileName: string, type: any) => {
  const filtered = getGoogleMimeTypeName(type);
  if (filtered !== null) return filtered;
  switch (type) {
    case "image/png":
    case "image/jpeg":
      return "image";
    case "application/json":
      if (fileName?.endsWith(".fxm")) return "task";
      else if (fileName.endsWith(".scr")) return "scribble";
      else return type;
    default:
      return "text";
  }
};

function getGoogleMimeTypeName(mimeType: string) {
  const mimeTypes: { [key: string]: string } = {
    "application/vnd.google-apps.document": "Docs",
    "application/vnd.google-apps.drive-sdk": "Third-party shortcut",
    "application/vnd.google-apps.drawing": "Drawings",
    "application/vnd.google-apps.file": "Drive file",
    "application/vnd.google-apps.folder": "folder",
    "application/vnd.google-apps.form": "Forms",
    "application/vnd.google-apps.fusiontable": "Fusion Tables",
    "application/vnd.google-apps.jam": "Jamboard",
    "application/vnd.google-apps.map": "My Maps",
    "application/vnd.google-apps.photo": "Photos",
    "application/vnd.google-apps.presentation": "Slides",
    "application/vnd.google-apps.script": "Apps Script",
    "application/vnd.google-apps.shortcut": "Shortcut",
    "application/vnd.google-apps.site": "Sites",
    "application/vnd.google-apps.spreadsheet": "Sheets",
  };
  const name = mimeTypes[mimeType] || null;
  return name;
}
