
/**
 * Reads a file as an ArrayBuffer and extracts printable ASCII strings.
 * This is a common first step in reverse engineering to find hardcoded text.
 * @param file The file to analyze.
 * @returns A promise that resolves to an array of extracted strings.
 */
export const extractStrings = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }

      const buffer = event.target.result as ArrayBuffer;
      const view = new Uint8Array(buffer);
      const strings: string[] = [];
      let currentString = '';
      const minLength = 4; // Minimum length for a string to be considered valid

      for (let i = 0; i < view.length; i++) {
        const charCode = view[i];
        // Check for printable ASCII characters (space to ~)
        if (charCode >= 32 && charCode <= 126) {
          currentString += String.fromCharCode(charCode);
        } else {
          if (currentString.length >= minLength) {
            strings.push(currentString);
          }
          currentString = '';
        }
      }

      if (currentString.length >= minLength) {
        strings.push(currentString);
      }
      
      // Filter out noisy or common non-strings
      const filteredStrings = strings.filter(s => {
          // not just random symbols or repeated characters
          if (/^[^a-zA-Z0-9]{4,}$/.test(s) || /(.)\1{3,}/.test(s)) return false; 
          return true;
      });

      resolve(filteredStrings);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};
