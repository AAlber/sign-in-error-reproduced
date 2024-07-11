import { renderToStream } from "@react-pdf/renderer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Readable } from "stream";
import type { EctsPdfUploads } from "@/src/types/ects.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";
import { storageHandler } from "../server-cloudflare/storage-handler";
import {
  getSettingValues,
  updatePartialInstitutionSettings,
} from "../server-institution-settings";
import { getUser, translateTextToUserPreferredLanguage } from "../server-user";
import EctsExportDocument from "./ects-generate-document";
import type { EctsExportDocumentArgs } from "./types";

const WORKER = process.env.NEXT_PUBLIC_WORKER_URL;

export async function setUploadedPdfKeys(
  args: EctsPdfUploads & { institutionId: string },
) {
  log.context("setUploadedPdfKeys", args);
  log.info("setting uploaded ectsPdf keys");
  try {
    const { institutionId, appendixKey, introductoryKey } = args;
    // rely on upload api to make sure that the uploaded file is ALWAYS a valid PDF
    const addon_ects_appendix_pdf = appendixKey?.replace(
      `${WORKER}/` ?? "",
      "",
    );
    const addon_ects_introductory_pdf = introductoryKey?.replace(
      `${WORKER}/` ?? "",
      "",
    );
    return await updatePartialInstitutionSettings(institutionId, {
      ...(args.appendixKey ? { addon_ects_appendix_pdf } : {}),
      ...(args.introductoryKey ? { addon_ects_introductory_pdf } : {}),
    });
  } catch (error) {
    log.error(error, "Failed to set uploaded PDF keys");
    throw error;
  }
}

export async function getUploadedPdfKeys(
  institutionId: string,
): Promise<EctsPdfUploads> {
  log.context("getUploadedPdfKeys", { institutionId });
  log.info("fetching uploaded ectsPdf keys");
  try {
    const data = await getSettingValues(institutionId, [
      "addon_ects_appendix_pdf",
      "addon_ects_introductory_pdf",
    ]);
    if (!data) {
      log.warn("No data found", { institutionId });
    }
    const appendixKey = data.addon_ects_appendix_pdf;
    const introductoryKey = data.addon_ects_introductory_pdf;
    return {
      introductoryKey: introductoryKey === "" ? undefined : introductoryKey,
      appendixKey: appendixKey === "" ? undefined : appendixKey,
    };
  } catch (error) {
    log.error(error, "Failed to get uploaded PDF keys");
    throw error;
  }
}

export async function deleteInstitutionECTSpdf(
  institutionId: string,
  key: string,
) {
  log.context("deleteInstitutionECTSpdf", { key, institutionId });
  log.info("deleting institution ECTS pdf from S3");
  try {
    await storageHandler.delete.file(key);

    log.info("updating institutionMetadata ectsKeys");
    return await updatePartialInstitutionSettings(institutionId, {
      ...(key.includes("ects-points/appendix-pdf")
        ? { addon_ects_appendix_pdf: undefined }
        : {}),
      ...(key.includes("ects-points/introductory-pdf")
        ? { addon_ects_introductory_pdf: undefined }
        : {}),
    });
  } catch (error) {
    log.error(error, "Failed to delete ECTS PDF");
    throw error;
  }
}

export async function downloadInstitutionECTSpdf(key: string) {
  log.context("downloadInstitutionECTSpdf", { key });
  log.info("Downloading institution ects from S3");
  try {
    const result = await storageHandler.get.file(key);
    const stream = result.Body;
    if (!stream) {
      log.warn("No file found", { key });
      throw new HttpError("No file found");
    }

    return stream;
  } catch (error) {
    log.error(error, "Failed to download institution ECTS PDF");
    throw error;
  }
}

/**
 * example in:
 * https://pdf-lib.js.org/docs/api/classes/pdfdocument#addpage
 */
export async function appendPagesToPdfDocument(
  targetPdf: PDFDocument,
  sourcePdf: PDFDocument,
) {
  log.context("ECTS - appendPagesToPdfDocument", {});
  log.info("ECTS - appending pages to target document");
  try {
    const pages = sourcePdf.getPageIndices();
    const pagesToAdd = await targetPdf.copyPages(sourcePdf, pages);

    pagesToAdd.forEach((page) => {
      targetPdf.addPage(page);
    });

    return targetPdf;
  } catch (error) {
    log.error(error, "Failed to append pages to PDF document");
    throw error;
  }
}

export async function createPdfFromKey(key: string) {
  log.context("createPdfFromKey", { key }).cli();
  log.info("ECTS - createPdfFromKey");
  try {
    const stream = await downloadInstitutionECTSpdf(key);
    const introductoryFileBuffer = await _getBufferFromStream(stream);
    return await PDFDocument.load(introductoryFileBuffer);
  } catch (error) {
    log.error(error, "Failed to create PDF from key");
    throw error;
  }
}

export async function createEctsPdf(args: EctsExportDocumentArgs) {
  log.context("createEctsPdf", args);
  log.info("ECTS - createEctsPdf");
  try {
    const ectsJsx = EctsExportDocument({
      ...args,
      language: args.data.language,
    });

    const ectsStream = await renderToStream(ectsJsx);
    const ectsBuffer = await _getBufferFromStream(ectsStream);
    return await PDFDocument.load(ectsBuffer);
  } catch (error) {
    log.error(error, "Failed to create ECTS PDF");
    throw error;
  }
}

export async function applyFooterTextToDocument(
  document: PDFDocument,
  nameOfUser: string,
  language: string,
) {
  log.context("ECTS - applyFooterTextToDocument", { nameOfUser });
  log.info("ECTS - applyFooterTextToDocument");
  try {
    const helveticaFont = await document.embedFont(StandardFonts.Helvetica);
    const text = translateTextToUserPreferredLanguage(
      "ects_export.footer",
      undefined,
      language,
      { username: nameOfUser },
    );

    const pages = document.getPages();

    pages.forEach((page) => {
      const { width } = page.getSize();
      // size compute taken from: https://github.com/Hopding/pdf-lib/issues/10#issuecomment-593108695
      const textSize = 8;
      const textWidth = helveticaFont.widthOfTextAtSize(text, textSize);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: 12,
        size: textSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });

    return document;
  } catch (error) {
    log.error(error, "Failed to apply footer text to document");
    throw error;
  }
}

export async function createPdf(args: EctsExportDocumentArgs) {
  try {
    const { data, institutionId, user: dbUser } = args;

    // getUser and uploaded PDF keys
    const [user, uploadedKeys] = await Promise.all([
      dbUser ? Promise.resolve(dbUser) : getUser(data.userId),
      getUploadedPdfKeys(institutionId),
    ]);

    if (!user) {
      log.warn("Missing user data", { userId: data.userId });
      throw new HttpError("Missing User", 400);
    }

    const language = user.language;
    const { appendixKey, introductoryKey } = uploadedKeys;

    const baseDocument = await PDFDocument.create();
    // add introductory pages if exist
    if (introductoryKey) {
      const introDocument = await createPdfFromKey(introductoryKey);

      await appendPagesToPdfDocument(baseDocument, introDocument);
    }
    // create the main ECTS PDF page
    const ectsDocument = await createEctsPdf(args);
    await appendPagesToPdfDocument(baseDocument, ectsDocument);

    // add appendix pages if exist
    if (appendixKey) {
      const appendixDocument = await createPdfFromKey(appendixKey);
      await appendPagesToPdfDocument(baseDocument, appendixDocument);
    }

    await applyFooterTextToDocument(baseDocument, user.name, language);
    const finalPdf = await baseDocument.save();

    return new Blob([finalPdf]);
  } catch (error) {
    log.error(error, "Failed to create ECTS PDF");
    throw error;
  }
}

async function _getBufferFromStream(stream: NodeJS.ReadableStream) {
  try {
    const readable = Readable.from(stream);
    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    log.error(error, "Failed to get buffer from stream");
    throw error;
  }
}
