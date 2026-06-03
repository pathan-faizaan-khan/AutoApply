import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import JSZip from "jszip";

// Helper to safely render item for text output
const renderItem = (item: any): string => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    return Object.entries(item)
      .map(([key, val]) => {
        if (val && typeof val === "object") return JSON.stringify(val);
        return val ? `${key}: ${val}` : "";
      })
      .filter(Boolean)
      .join(", ");
  }
  return String(item);
};

export const generateDocx = async (resumeData: any): Promise<Blob> => {
  const sections = [];

  // Name and Contact Info
  sections.push(
    new Paragraph({
      text: resumeData.name || "Resume",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Email: ${resumeData.email || "N/A"} | ` }),
        new TextRun({ text: `Phone: ${resumeData.phone || "N/A"}` }),
      ],
    }),
    new Paragraph({ text: "" })
  );

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    sections.push(new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }));
    resumeData.education.forEach((item: any) => {
      sections.push(new Paragraph({ text: `• ${renderItem(item)}` }));
    });
    sections.push(new Paragraph({ text: "" }));
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    sections.push(new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }));
    resumeData.skills.forEach((item: any) => {
      sections.push(new Paragraph({ text: `• ${renderItem(item)}` }));
    });
    sections.push(new Paragraph({ text: "" }));
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    sections.push(new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }));
    resumeData.experience.forEach((item: any) => {
      sections.push(new Paragraph({ text: `• ${renderItem(item)}` }));
    });
    sections.push(new Paragraph({ text: "" }));
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    sections.push(new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }));
    resumeData.projects.forEach((item: any) => {
      sections.push(new Paragraph({ text: `• ${renderItem(item)}` }));
    });
    sections.push(new Paragraph({ text: "" }));
  }

  // Languages
  if (resumeData.languages && resumeData.languages.length > 0) {
    sections.push(new Paragraph({ text: "Languages", heading: HeadingLevel.HEADING_2 }));
    resumeData.languages.forEach((item: any) => {
      sections.push(new Paragraph({ text: `• ${renderItem(item)}` }));
    });
    sections.push(new Paragraph({ text: "" }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  return Packer.toBlob(doc);
};

export const generatePdf = (resumeData: any): Blob => {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const margin = 20;
  const maxW = 170;

  const checkPage = (height: number = lineHeight) => {
    if (yPos + height > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addText = (text: string, size = 12, isBold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxW);
    checkPage(lines.length * lineHeight);
    doc.text(lines, margin, yPos);
    yPos += lines.length * lineHeight;
  };

  addText(resumeData.name || "Resume", 20, true);
  addText(`Email: ${resumeData.email || "N/A"} | Phone: ${resumeData.phone || "N/A"}`, 12, false);
  yPos += 5;

  const addSection = (title: string, items: any[]) => {
    if (items && items.length > 0) {
      checkPage(15);
      addText(title, 16, true);
      items.forEach(item => {
        const text = `• ${renderItem(item)}`;
        addText(text, 12, false);
      });
      yPos += 5;
    }
  };

  addSection("Education", resumeData.education);
  addSection("Skills", resumeData.skills);
  addSection("Experience", resumeData.experience);
  addSection("Projects", resumeData.projects);
  addSection("Languages", resumeData.languages);

  return doc.output("blob");
};

export const downloadPdf = (resumeData: any) => {
  const blob = generatePdf(resumeData);
  saveAs(blob, "Optimized_Resume.pdf");
};

export const downloadDocx = async (resumeData: any) => {
  const blob = await generateDocx(resumeData);
  saveAs(blob, "Optimized_Resume.docx");
};

export const downloadZip = async (resumeData: any) => {
  const zip = new JSZip();
  
  const pdfBlob = generatePdf(resumeData);
  zip.file("Optimized_Resume.pdf", pdfBlob);

  const docxBlob = await generateDocx(resumeData);
  zip.file("Optimized_Resume.docx", docxBlob);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "Optimized_Resume_Package.zip");
};
