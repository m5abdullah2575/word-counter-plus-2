import { toast } from '@/hooks/use-toast';

// Type definitions
export interface FileParseResult {
  text: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface FileParseProgress {
  phase: 'reading' | 'parsing' | 'processing';
  progress?: number;
  message: string;
}

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  text: ['.txt', '.md', '.markdown', '.rtf', '.html', '.htm', '.csv'],
  pdf: ['.pdf'],
  docx: ['.docx'],
  unsupported: ['.doc'] // Legacy Word files not supported client-side
};

export const SUPPORTED_MIME_TYPES = [
  'text/plain',
  'text/markdown', 
  'text/html',
  'application/rtf',
  'text/csv',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  pdf: 50 * 1024 * 1024, // 50MB for PDFs
  docx: 25 * 1024 * 1024, // 25MB for DOCX
  text: 100 * 1024 * 1024 // 100MB for text files
};

// Extract text from HTML content
function extractHtmlText(content: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  
  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach(el => el.remove());
  
  return tempDiv.textContent || tempDiv.innerText || '';
}

// Extract text from RTF content
function extractRtfText(content: string): string {
  // Simple RTF text extraction - remove RTF control codes
  return content
    .replace(/\\[a-z]{1,32}(-?\d{1,10})?[ ]?/gi, '') // Remove RTF control words
    .replace(/[{}]/g, '') // Remove braces
    .replace(/\\\\/g, '\\') // Handle escaped backslashes
    .replace(/\\'/g, "'") // Handle escaped apostrophes
    .trim();
}

// Extract text from Markdown content
function extractMarkdownText(content: string): string {
  return content
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
    .trim();
}

// Process text-based file content
function processTextContent(content: string, fileName: string, fileType: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (fileType.includes('html') || extension === 'html' || extension === 'htm') {
    return extractHtmlText(content);
  } else if (fileType.includes('rtf') || extension === 'rtf') {
    return extractRtfText(content);
  } else if (fileType.includes('markdown') || extension === 'md' || extension === 'markdown') {
    return extractMarkdownText(content);
  } else {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }
}

// Parse PDF file using PDF.js
async function parsePdf(arrayBuffer: ArrayBuffer, onProgress?: (progress: FileParseProgress) => void): Promise<string> {
  try {
    onProgress?.({ phase: 'parsing', message: 'Loading PDF parser...' });
    
    // Dynamically import PDF.js to keep bundle size small
    const pdfjs = await import('pdfjs-dist');
    
    // Set up worker - use CDN for reliable loading in all environments
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    
    onProgress?.({ phase: 'parsing', message: 'Parsing PDF document...' });
    
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    let extractedText = '';
    
    onProgress?.({ phase: 'processing', progress: 0, message: `Processing ${numPages} pages...` });
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Concatenate text items with proper spacing
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (pageText) {
        extractedText += pageText + '\n\n';
      }
      
      const progress = (pageNum / numPages) * 100;
      onProgress?.({ 
        phase: 'processing', 
        progress, 
        message: `Processed ${pageNum} of ${numPages} pages...` 
      });
    }
    
    if (!extractedText.trim()) {
      throw new Error('No text content found in PDF. This might be a scanned document or image-based PDF.');
    }
    
    return extractedText.trim();
    
  } catch (error: any) {
    if (error.message?.includes('Invalid PDF')) {
      throw new Error('Invalid or corrupted PDF file. Please try a different file.');
    } else if (error.message?.includes('password')) {
      throw new Error('Password-protected PDFs are not supported. Please remove the password and try again.');
    } else if (error.message?.includes('No text content')) {
      throw error; // Re-throw our custom message
    } else {
      throw new Error(`Failed to parse PDF: ${error.message || 'Unknown error'}`);
    }
  }
}

// Parse DOCX file using Mammoth
async function parseDocx(arrayBuffer: ArrayBuffer, onProgress?: (progress: FileParseProgress) => void): Promise<string> {
  try {
    onProgress?.({ phase: 'parsing', message: 'Loading DOCX parser...' });
    
    // Dynamically import Mammoth to keep bundle size small
    const mammoth = await import('mammoth');
    
    onProgress?.({ phase: 'parsing', message: 'Parsing DOCX document...' });
    
    // Extract raw text (avoid HTML to prevent XSS and simplify processing)
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    onProgress?.({ phase: 'processing', message: 'Processing document content...' });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('No text content found in DOCX file. The document might be empty or contain only images.');
    }
    
    // Clean up the extracted text
    const cleanText = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .trim();
    
    return cleanText;
    
  } catch (error: any) {
    if (error.message?.includes('No text content')) {
      throw error; // Re-throw our custom message
    } else {
      throw new Error(`Failed to parse DOCX: ${error.message || 'Unknown error'}`);
    }
  }
}

// Validate file type and size
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const fileName = file.name.toLowerCase();
  const fileExtension = '.' + fileName.split('.').pop();
  
  // Check if file type is supported
  const allSupportedExtensions = [
    ...SUPPORTED_FILE_TYPES.text,
    ...SUPPORTED_FILE_TYPES.pdf,
    ...SUPPORTED_FILE_TYPES.docx
  ];
  
  const isValidExtension = allSupportedExtensions.includes(fileExtension) ||
                          SUPPORTED_MIME_TYPES.includes(file.type);
  
  // Special handling for .doc files
  if (fileExtension === '.doc') {
    return {
      isValid: false,
      error: 'Legacy Word (.doc) files are not supported. Please convert to .docx format or save as .txt/.rtf and try again.'
    };
  }
  
  if (!isValidExtension) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload: Text files (.txt, .md, .html, .rtf, .csv), PDF files (.pdf), or Word documents (.docx).'
    };
  }
  
  // Check file size based on type
  let maxSize = FILE_SIZE_LIMITS.text; // Default
  
  if (SUPPORTED_FILE_TYPES.pdf.includes(fileExtension) || file.type === 'application/pdf') {
    maxSize = FILE_SIZE_LIMITS.pdf;
  } else if (SUPPORTED_FILE_TYPES.docx.includes(fileExtension) || 
             file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    maxSize = FILE_SIZE_LIMITS.docx;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File too large. Maximum size for this file type is ${maxSizeMB}MB.`
    };
  }
  
  return { isValid: true };
}

// Main file parsing function
export async function parseFile(
  file: File, 
  onProgress?: (progress: FileParseProgress) => void
): Promise<FileParseResult> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  const fileName = file.name.toLowerCase();
  const fileExtension = '.' + fileName.split('.').pop();
  
  onProgress?.({ phase: 'reading', message: 'Reading file...' });
  
  try {
    let extractedText: string;
    
    // Handle different file types
    if (SUPPORTED_FILE_TYPES.pdf.includes(fileExtension) || file.type === 'application/pdf') {
      // Parse PDF
      const arrayBuffer = await file.arrayBuffer();
      extractedText = await parsePdf(arrayBuffer, onProgress);
      
    } else if (SUPPORTED_FILE_TYPES.docx.includes(fileExtension) || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX
      const arrayBuffer = await file.arrayBuffer();
      extractedText = await parseDocx(arrayBuffer, onProgress);
      
    } else {
      // Parse text-based files
      onProgress?.({ phase: 'parsing', message: 'Reading text content...' });
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file, 'UTF-8');
      });
      
      onProgress?.({ phase: 'processing', message: 'Processing text...' });
      extractedText = processTextContent(content, file.name, file.type);
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text content found in the file. The file might be empty or corrupted.');
    }
    
    return {
      text: extractedText,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream'
    };
    
  } catch (error: any) {
    throw new Error(error.message || 'Failed to process file');
  }
}

// Helper function to get accept string for file input
export function getFileInputAccept(): string {
  return [
    ...SUPPORTED_FILE_TYPES.text,
    ...SUPPORTED_FILE_TYPES.pdf,
    ...SUPPORTED_FILE_TYPES.docx
  ].join(',') + ',' + SUPPORTED_MIME_TYPES.join(',');
}