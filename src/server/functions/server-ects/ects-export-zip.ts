import AdmZip from "adm-zip";
import { getUser } from "../server-user";
import { converBlobToBuffer } from "./common-utils";
import { createPdf } from "./ects-document-functions";
import { createCsv } from "./ects-export-csv";
import type { EctsExportDocumentArgs } from "./types";

export async function createZip(args: EctsExportDocumentArgs) {
  const user = await getUser(args.data.userId);
  const name = user?.name.replaceAll(" ", "_") ?? "file";

  const [csvBlob, pdfBlob] = await Promise.all([
    createCsv(args),
    createPdf({ ...args, user }),
  ]);

  const [csvBuf, pdfBuf] = await Promise.all([
    converBlobToBuffer(csvBlob),
    converBlobToBuffer(pdfBlob),
  ]);

  const zip = new AdmZip();
  zip.addFile(`${name}.csv`, csvBuf);
  zip.addFile(`${name}.pdf`, pdfBuf);

  const zipBuf = await zip.toBufferPromise();
  return new Blob([zipBuf]);
}

export async function compressFiles(files: { filename: string; blob: Blob }[]) {
  const zip = new AdmZip();
  await Promise.all(
    files.map(async ({ filename, blob }) => {
      const buf = await converBlobToBuffer(blob);
      zip.addFile(filename, buf);
    }),
  );

  return new Blob([await zip.toBufferPromise()]);
}
