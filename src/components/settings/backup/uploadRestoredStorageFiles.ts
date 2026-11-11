import { restoreStorageFileAction } from "@/actions/backup";
import type { ExtractedStorageFile } from "./extractStorageFilesFromZip";

export async function uploadRestoredStorageFiles(
  storageFiles: ExtractedStorageFile[],
): Promise<number> {
  let restoredCount = 0;
  for (const sf of storageFiles) {
    const fd = new FormData();
    fd.append("bucket", sf.bucket);
    fd.append("path", sf.path);
    fd.append("file", sf.file);
    const res = await restoreStorageFileAction(fd);
    if (res.success) {
      restoredCount++;
    }
  }
  return restoredCount;
}
