import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const GDRIVE_CMD = path.join(process.env.USERPROFILE || "", ".gemini/antigravity/bin/gdrive.cmd");
const PARENT_FOLDER_ID = "1ooIHNsNDXh-B9Ux9Cz7_Kdsc_tRQmUl5";
const BUCKETS = ["public-assets", "school-documents", "circular-attachments", "maintenance-photos"];

const TABLES = [
  "schools",
  "school_settings",
  "departments",
  "locations",
  "roles",
  "role_permissions",
  "profiles",
  "user_role_assignments",
  "school_sequences",
  "circulars",
  "circular_targets",
  "circular_responses",
  "maintenance_requests",
  "maintenance_assignments",
  "maintenance_updates",
  "calendar_events",
  "school_achievements",
];

function loadSupabaseCredentials() {
  let envPath = ".env.cloud.local";
  if (!fs.existsSync(envPath)) envPath = ".env.local";
  const envContent = fs.readFileSync(envPath, "utf8");
  let url = "";
  let key = "";
  for (const line of envContent.split("\n")) {
    if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) url = line.split("=")[1].trim();
    if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) key = line.split("=")[1].trim();
  }
  return createClient(url, key);
}

async function listFolderFiles(supabase, bucket, prefix) {
  const { data: items, error } = await supabase.storage.from(bucket).list(prefix);
  if (error || !items) return [];

  const files = [];
  for (const item of items) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (!item.id) {
      const nested = await listFolderFiles(supabase, bucket, itemPath);
      files.push(...nested);
    } else {
      files.push({ bucket, path: itemPath, size: item.metadata?.size || 0 });
    }
  }
  return files;
}

function resolveDatedFolderId(folderName) {
  try {
    const listOut = execSync(`& "${GDRIVE_CMD}" readonly ls "${PARENT_FOLDER_ID}"`, {
      shell: "powershell.exe",
    }).toString();

    for (const line of listOut.split("\n")) {
      const parts = line.trim().split(/\s{2,}/);
      if (parts.length >= 2 && parts[1] === folderName) {
        console.log(`Found existing folder "${folderName}" (ID: ${parts[0]})`);
        return parts[0];
      }
    }
  } catch (err) {
    console.warn("Could not list parent folder, will try mkdir:", err.message);
  }

  console.log(`Creating dated folder in Google Drive: "${folderName}"...`);
  const mkdirOut = execSync(
    `& "${GDRIVE_CMD}" mutate mkdir "${folderName}" --parent ${PARENT_FOLDER_ID}`,
    { shell: "powershell.exe" },
  ).toString();

  const match = mkdirOut.match(/\(ID:\s*([^)]+)\)/i);
  if (!match) throw new Error(`Failed to parse folder ID from output: ${mkdirOut}`);
  return match[1].trim();
}

async function exportTableRows(supabase, table, schoolId) {
  let query = supabase.from(table).select("*");
  if (table === "schools") {
    query = query.eq("id", schoolId);
  } else if (table === "role_permissions") {
    const { data: roles } = await supabase.from("roles").select("id").eq("school_id", schoolId);
    const roleIds = (roles || []).map((r) => r.id);
    query = query.in(
      "role_id",
      roleIds.length ? roleIds : ["00000000-0000-0000-0000-000000000000"],
    );
  } else {
    query = query.eq("school_id", schoolId);
  }
  const { data: rows } = await query;
  return rows || [];
}

async function exportDatabaseTables(supabase, schoolId, schoolName) {
  const payload = {
    version: 2,
    metadata: {
      exportedAt: new Date().toISOString(),
      schoolId,
      schoolName,
      scope: "school",
      totalRows: 0,
      tableCounts: {},
    },
    tables: {},
  };

  let totalRows = 0;
  for (const table of TABLES) {
    const rows = await exportTableRows(supabase, table, schoolId);
    payload.tables[table] = rows;
    payload.metadata.tableCounts[table] = rows.length;
    totalRows += rows.length;
  }
  payload.metadata.totalRows = totalRows;
  return payload;
}

async function downloadAndZipStorage(supabase, schoolId, zip) {
  let count = 0;
  for (const bucket of BUCKETS) {
    const files = await listFolderFiles(supabase, bucket, schoolId);
    for (const file of files) {
      const { data: blob, error } = await supabase.storage.from(bucket).download(file.path);
      if (!error && blob) {
        const buffer = Buffer.from(await blob.arrayBuffer());
        zip.file(`storage/${bucket}/${file.path}`, buffer);
        count++;
      }
    }
  }
  return count;
}

function uploadBackupFiles(tempDir, dateStr, datedFolderId) {
  const zipPath = path.join(tempDir, `Al_Firdous_Full_Backup_${dateStr}.zip`);
  const jsonPath = path.join(tempDir, `database_backup_${dateStr}.json`);
  const readmePath = path.join(tempDir, "README.txt");

  execSync(`& "${GDRIVE_CMD}" mutate upload "${zipPath}" --parent ${datedFolderId}`, {
    shell: "powershell.exe",
  });
  execSync(`& "${GDRIVE_CMD}" mutate upload "${jsonPath}" --parent ${datedFolderId}`, {
    shell: "powershell.exe",
  });
  execSync(`& "${GDRIVE_CMD}" mutate upload "${readmePath}" --parent ${datedFolderId}`, {
    shell: "powershell.exe",
  });
}

async function runWeeklyBackup() {
  console.log("==========================================================");
  console.log("STARTING AUTOMATED GOOGLE DRIVE BACKUP:", new Date().toISOString());
  console.log("==========================================================");

  const supabase = loadSupabaseCredentials();
  const { data: schools } = await supabase.from("schools").select("*").limit(1);
  const school = schools?.[0];
  if (!school) throw new Error("No school found for backup");

  const dateStr = new Date().toISOString().slice(0, 10);
  const dbPayload = await exportDatabaseTables(supabase, school.id, school.name_ar);

  const zip = new JSZip();
  const jsonContent = JSON.stringify(dbPayload, null, 2);
  zip.file(`database_backup_${dateStr}.json`, jsonContent);

  const storageCount = await downloadAndZipStorage(supabase, school.id, zip);
  const readme = `Backup: ${school.name_ar}\nDate: ${new Date().toISOString()}\nRows: ${dbPayload.metadata.totalRows}\nFiles: ${storageCount}`;
  zip.file("README.txt", readme);

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const tempDir = path.resolve("./.temp_backup");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(path.join(tempDir, `Al_Firdous_Full_Backup_${dateStr}.zip`), zipBuffer);
  fs.writeFileSync(path.join(tempDir, `database_backup_${dateStr}.json`), jsonContent);
  fs.writeFileSync(path.join(tempDir, "README.txt"), readme);

  const datedFolderId = resolveDatedFolderId(`Backup_${dateStr}`);
  uploadBackupFiles(tempDir, dateStr, datedFolderId);
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log(`SUCCESS: Weekly backup completed and saved into "Backup_${dateStr}".`);
}

runWeeklyBackup().catch((err) => {
  console.error("Weekly backup failed:", err);
  process.exit(1);
});
