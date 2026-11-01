import { createSupabaseAdminClient } from "@/lib/supabase";
import { assertCanManageDocuments } from "@/lib/documents/assertCanManageDocuments";
import { canPreviewManagedDocument } from "@/lib/documents/canPreviewManagedDocument";
import { getActorDetails } from "@/lib/documents/getActorDetails";
import { isPublicDocumentPreviewAllowed } from "@/lib/documents/isPublicDocumentPreviewAllowed";
import { NotFoundError, withApiErrorHandler } from "@/lib/errors";

async function handleDocumentPreview(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const access = await assertCanManageDocuments();
  const { id } = await params;
  const admin = createSupabaseAdminClient(getActorDetails(access.profile));
  const { data: document, error: documentError } = await admin
    .from("school_documents")
    .select("file_path, mime_type, school_id, is_published")
    .eq("id", id)
    .maybeSingle();

  if (documentError || !document) {
    throw new NotFoundError("Document not found");
  }

  if (!canPreviewManagedDocument(access, document.school_id)) {
    if (!(await isPublicDocumentPreviewAllowed(admin, document.school_id, document.is_published))) {
      throw new NotFoundError("Document not found");
    }
  }

  const { data: file, error: fileError } = await admin.storage
    .from("school-documents")
    .download(document.file_path);

  if (fileError || !file) {
    throw new NotFoundError("Document file not found");
  }

  return new Response(await file.arrayBuffer(), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": "inline",
      "Content-Type": file.type || document.mime_type,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const GET = withApiErrorHandler(handleDocumentPreview);
