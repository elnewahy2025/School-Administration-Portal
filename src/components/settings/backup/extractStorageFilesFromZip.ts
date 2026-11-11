import type JSZip from "jszip";

export type ExtractedStorageFile = {
  bucket: string;
  path: string;
  file: File;
};

export async function extractStorageFilesFromZip(zip: JSZip): Promise<ExtractedStorageFile[]> {
  const storageFiles: ExtractedStorageFile[] = [];

  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir || !relativePath.startsWith("storage/")) {
      continue;
    }

    const match = relativePath.match(/^storage\/([^/]+)\/(.+)$/);
    if (!match) continue;

    const bucket = match[1];
    const filePath = match[2];
    const blob = await zipEntry.async("blob");
    const extractedFile = new File([blob], filePath.split("/").pop() || "file", {
      type: blob.type,
    });

    storageFiles.push({
      bucket,
      path: filePath,
      file: extractedFile,
    });
  }

  return storageFiles;
}
