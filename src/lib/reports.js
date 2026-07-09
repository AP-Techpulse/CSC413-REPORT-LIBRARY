import { supabase, REPORTS_BUCKET } from "../supabaseClient.js";

export async function fetchReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("group_number", { ascending: true });
  if (error) throw error;
  return data;
}

export function getPublicUrl(filePath) {
  const { data } = supabase.storage.from(REPORTS_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadReport({ file, groupNumber, title, courseType, description, onProgress }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `group-${groupNumber}-${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { data, error: insertError } = await supabase
    .from("reports")
    .insert({
      group_number: Number(groupNumber),
      title,
      course_type: courseType,
      description: description || null,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
    })
    .select()
    .single();

  if (insertError) throw insertError;
  return data;
}

export async function deleteReport(report) {
  const { error: storageError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .remove([report.file_path]);
  if (storageError) throw storageError;

  const { error: dbError } = await supabase.from("reports").delete().eq("id", report.id);
  if (dbError) throw dbError;
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
