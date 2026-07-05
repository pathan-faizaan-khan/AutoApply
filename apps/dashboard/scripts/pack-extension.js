import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionDir = path.join(__dirname, "../../../../chrome-extension");
const outputZipPath = path.join(__dirname, "../public/auto-apply-extension.zip");

async function packExtension() {
  console.log(`Packaging Chrome Extension from: ${extensionDir}`);
  const zip = new JSZip();

  function addFolderToZip(folderPath, zipFolder) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (file === "node_modules" || file === ".git" || file === ".DS_Store" || file.endsWith(".zip")) {
        continue;
      }
      
      const fullPath = path.join(folderPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        addFolderToZip(fullPath, zipFolder.folder(file));
      } else {
        const fileContent = fs.readFileSync(fullPath);
        zipFolder.file(file, fileContent);
      }
    }
  }

  addFolderToZip(extensionDir, zip);

  console.log("Generating zip file...");
  const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } });
  
  // Ensure public dir exists
  const publicDir = path.dirname(outputZipPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputZipPath, content);
  console.log(`Successfully packed extension to: ${outputZipPath}`);
}

packExtension().catch(err => {
  console.error("Failed to pack extension:", err);
  process.exit(1);
});
