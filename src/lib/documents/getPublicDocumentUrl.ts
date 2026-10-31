export function getPublicDocumentUrl(filePath?: string | null): string {
  if (!filePath) return "";
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${baseUrl}/storage/v1/object/public/school-documents/${filePath}`;
}
