// This script relies on the mammoth.js library being loaded globally from a CDN.
declare const mammoth: any;

/**
 * Reads a .txt or .rtf file and returns its text content.
 * For RTF, it performs a basic stripping of formatting.
 * @param file The file to read.
 * @returns A promise that resolves to the string content of the file.
 */
const readTextOrRtfFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      let text = event.target.result as string;
      if (file.name.toLowerCase().endsWith('.rtf')) {
        // Basic RTF stripper: removes RTF control words, groups, and some escaped characters.
        // This is not a full-fledged RTF parser but is sufficient for extracting raw text.
        text = text.replace(/\\([a-z0-9_'-]+) ?/g, '')
                   .replace(/[{}]/g, '')
                   .replace(/\s+/g, ' ')
                   .trim();
      }
      resolve(text);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * Reads a .docx file using mammoth.js and extracts raw text.
 * @param file The .docx file to read.
 * @returns A promise that resolves to the string content of the file.
 */
const readDocxFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        try {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          console.error("Error parsing DOCX file:", err);
          reject(new Error("Could not parse the DOCX file. It might be corrupted or in an unsupported format."));
        }
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Parses a document file (.txt, .rtf, .docx) and returns its text content.
 * @param file The file to parse.
 * @returns A promise that resolves to the extracted text as a string.
 */
export const parseDocument = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
    case 'rtf':
      return readTextOrRtfFile(file);
    case 'docx':
      if (typeof mammoth === 'undefined') {
        throw new Error("The DOCX parsing library (mammoth.js) is not loaded.");
      }
      return readDocxFile(file);
    default:
      throw new Error("Unsupported file type. Please upload a .txt, .rtf, or .docx file.");
  }
};
