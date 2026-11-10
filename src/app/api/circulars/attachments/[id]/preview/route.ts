import { fetchCircularAttachmentFile } from "@/lib/circulars/fetchCircularAttachmentFile";
import { withApiErrorHandler } from "@/lib/errors";

async function handleAttachmentPreview(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const fileData = await fetchCircularAttachmentFile(id);

  const safeFileName = encodeURIComponent(fileData.fileName);

  return new Response(fileData.bytes, {
    headers: {
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": `inline; filename="${safeFileName}"`,
      "Content-Type": fileData.mime,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Content-Security-Policy": "frame-ancestors 'self';",
    },
  });
}

export const GET = withApiErrorHandler(handleAttachmentPreview);
