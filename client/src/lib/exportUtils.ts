import { TextStats, ReadabilityStats, KeywordAnalysis } from './textAnalysis';
import { prepareDownload } from './downloadHelper';

export interface ExportData {
  text: string;
  stats: TextStats;
  readability: ReadabilityStats;
  keywords: KeywordAnalysis;
  timestamp: string;
}

export function exportCSV(data: ExportData): void {
  const csvContent = [
    ['Metric', 'Value'],
    ['Word Count', data.stats.wordCount.toString()],
    ['Character Count', data.stats.charCount.toString()],
    ['Character Count (No Spaces)', data.stats.charNoSpaces.toString()],
    ['Sentence Count', data.stats.sentenceCount.toString()],
    ['Paragraph Count', data.stats.paragraphCount.toString()],
    ['Average Word Length', data.stats.avgWordLength.toString()],
    ['Longest Word', data.stats.longestWord],
    ['Shortest Word', data.stats.shortestWord],
    ['Readability Score', data.readability.score.toString()],
    ['Reading Time (minutes)', data.readability.readingTime.toString()],
    ['Speaking Time (minutes)', data.readability.speakingTime.toString()]
  ].map(row => row.join(',')).join('\n');

  prepareDownload({
    content: csvContent,
    filename: 'word-analysis.csv',
    fileType: 'csv',
    mimeType: 'text/csv'
  });
}

export function exportTXT(data: ExportData): void {
  const txtContent = `Word Analysis Report
Generated: ${new Date().toLocaleString()}

=== BASIC STATISTICS ===
Word Count: ${data.stats.wordCount}
Character Count: ${data.stats.charCount}
Character Count (No Spaces): ${data.stats.charNoSpaces}
Sentence Count: ${data.stats.sentenceCount}
Paragraph Count: ${data.stats.paragraphCount}
Average Word Length: ${data.stats.avgWordLength}
Longest Word: ${data.stats.longestWord}
Shortest Word: ${data.stats.shortestWord}

=== READABILITY ANALYSIS ===
Flesch-Kincaid Score: ${data.readability.score}
Estimated Reading Time: ${data.readability.readingTime} minutes
Estimated Speaking Time: ${data.readability.speakingTime} minutes

=== TOP KEYWORDS ===
${data.keywords.single.slice(0, 5).map(k => `${k.keyword}: ${k.count} (${k.percentage}%)`).join('\n')}

=== ORIGINAL TEXT ===
${data.text}`;

  prepareDownload({
    content: txtContent,
    filename: 'word-analysis.txt',
    fileType: 'txt',
    mimeType: 'text/plain'
  });
}

export function exportPDF(data: ExportData): void {
  Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ])
    .then(([jsPDFModule, html2canvasModule]) => {
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;

      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      const brandColor = { r: 220, g: 38, b: 38 };
      const lightGray = { r: 248, g: 248, b: 248 };
      const darkGray = { r: 60, g: 60, b: 60 };
      const borderGray = { r: 230, g: 230, b: 230 };
      
      const addHeader = (pageNum: number) => {
        doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        doc.setDrawColor(180, 25, 25);
        doc.setLineWidth(2);
        doc.line(0, 35, pageWidth, 35);
        
        doc.setTextColor(0,0, 0);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Word Counter Plus", margin, 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Professional Text Analysis Tool", margin, 25);
        
        if (pageNum > 1) {
          doc.setFontSize(9);
          doc.text(`Page ${pageNum}`, pageWidth - margin, 20, { align: 'right' });
        }
      };
      
      const addFooter = (pageNum: number) => {
        const footerY = pageHeight - 25;
        
        doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setLineWidth(1.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        
        doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        doc.rect(0, footerY + 2, pageWidth, 23, 'F');
        
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Word Counter Plus", margin, footerY + 10);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("www.wordcounterplusapp.com", margin, footerY + 16);
        
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setFont("helvetica", "bold");
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY + 10, { align: 'right' });
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const date = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        doc.text(date, pageWidth - margin, footerY + 16, { align: 'right' });
      };

      let yPosition = 50;
      const lineHeight = 7;
      let pageNum = 1;
      
      addHeader(pageNum);
      
      doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
      doc.roundedRect(margin - 3, yPosition - 8, maxWidth + 6, 20, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("WORD COUNTER ANALYSIS REPORT", pageWidth / 2, yPosition + 2, { align: 'center' });
      
      yPosition += 20;
      
      doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
      doc.setLineWidth(0.5);
      
      const addSection = (title: string, items: string[], twoColumn = false) => {
        if (yPosition > pageHeight - 50) {
          addFooter(pageNum);
          doc.addPage();
          pageNum++;
          addHeader(pageNum);
          yPosition = 50;
        }
        
        doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        doc.roundedRect(margin - 3, yPosition, maxWidth + 6, 12, 2, 2, 'F');
        
        doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setLineWidth(0.8);
        doc.line(margin - 3, yPosition + 12, pageWidth - margin + 3, yPosition + 12);
        
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 2, yPosition + 8);
        yPosition += 18;
        
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        if (twoColumn) {
          const colWidth = (maxWidth - 15) / 2;
          let rowCount = 0;
          items.forEach((item, index) => {
            const col = index % 2;
            const xPos = margin + (col * (colWidth + 15));
            
            if (col === 0 && index > 0) {
              yPosition += lineHeight + 2;
              rowCount++;
            }
            
            if (yPosition > pageHeight - 50) {
              addFooter(pageNum);
              doc.addPage();
              pageNum++;
              addHeader(pageNum);
              yPosition = 50;
            }
            
            const bgY = yPosition - 5;
            if (rowCount % 2 === 0) {
              doc.setFillColor(252, 252, 252);
              doc.rect(margin - 3, bgY, maxWidth + 6, lineHeight + 2, 'F');
            }
            
            doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
            doc.setFontSize(8);
            doc.text("●", xPos, yPosition);
            
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(10);
            doc.text(item, xPos + 4, yPosition);
          });
          yPosition += lineHeight + 8;
        } else {
          items.forEach((item, index) => {
            if (yPosition > pageHeight - 50) {
              addFooter(pageNum);
              doc.addPage();
              pageNum++;
              addHeader(pageNum);
              yPosition = 50;
            }
            
            if (index % 2 === 0) {
              doc.setFillColor(252, 252, 252);
              doc.rect(margin - 3, yPosition - 5, maxWidth + 6, lineHeight + 2, 'F');
            }
            
            doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
            doc.setFontSize(8);
            doc.text("●", margin + 2, yPosition);
            
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(10);
            doc.text(item, margin + 6, yPosition);
            yPosition += lineHeight + 2;
          });
          yPosition += 5;
        }
      };
      
      const basicStats = [
        `Words: ${data.stats.wordCount}`,
        `Characters (with spaces): ${data.stats.charCount}`,
        `Characters (without spaces): ${data.stats.charNoSpaces}`,
        `Sentences: ${data.stats.sentenceCount}`,
        `Paragraphs: ${data.stats.paragraphCount}`,
        `Lines: ${data.text.split('\n').length}`,
        `Pages (est.): ${Math.ceil(data.stats.wordCount / 250) || 1}`,
        `Average Word Length: ${data.stats.avgWordLength} characters`,
      ];
      addSection("STATISTICS", basicStats, true);
      
      const readabilityStats = [
        `Reading Time: ${data.readability.readingTime} min`,
        `Speaking Time: ${data.readability.speakingTime} min`,
        `Average Sentence Length: ${Math.round(data.stats.wordCount / (data.stats.sentenceCount || 1))} words`,
        `Longest Word: ${data.stats.longestWord}`,
        `Shortest Word: ${data.stats.shortestWord}`,
      ];
      addSection("READING METRICS", readabilityStats);
      
      const readabilityScore = [
        `Flesch Reading Ease: ${data.readability.score} (${data.readability.level})`,
      ];
      addSection("READABILITY SCORES", readabilityScore);
      
      const keywords = data.keywords.single.slice(0, 10).map((k, i) => 
        `${i + 1}. ${k.keyword} (${k.count} times)`
      );
      if (keywords.length > 0) {
        addSection("TOP KEYWORDS", keywords);
      }
      
      if (yPosition > pageHeight - 90) {
        addFooter(pageNum);
        doc.addPage();
        pageNum++;
        addHeader(pageNum);
        yPosition = 50;
      }
      
      doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
      doc.roundedRect(margin - 3, yPosition, maxWidth + 6, 12, 2, 2, 'F');
      
      doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
      doc.setLineWidth(0.8);
      doc.line(margin - 3, yPosition + 12, pageWidth - margin + 3, yPosition + 12);
      
      doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("ORIGINAL TEXT", margin + 2, yPosition + 8);
      yPosition += 20;
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
      doc.setLineWidth(0.5);
      
      const textBoxStartY = yPosition;
      const textLines = doc.splitTextToSize(data.text, maxWidth - 8);
      const textBoxHeight = Math.min(textLines.length * 5 + 10, pageHeight - yPosition - 35);
      
      doc.roundedRect(margin - 3, textBoxStartY - 5, maxWidth + 6, textBoxHeight, 2, 2, 'FD');
      
      doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      textLines.forEach((line: string) => {
        if (yPosition > pageHeight - 40) {
          addFooter(pageNum);
          doc.addPage();
          pageNum++;
          addHeader(pageNum);
          yPosition = 50;
          
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
          doc.roundedRect(margin - 3, yPosition - 5, maxWidth + 6, pageHeight - yPosition - 30, 2, 2, 'FD');
        }
        doc.text(line, margin + 2, yPosition);
        yPosition += 5;
      });
      
      addFooter(pageNum);
      
      doc.save("word-counter-analysis.pdf");
    })
    .catch(() => {
      alert("Unable to generate PDF. Please try the TXT export option.");
    });
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyResultsToClipboard(stats: TextStats, readability: ReadabilityStats): Promise<void> {
  const results = `Word Count: ${stats.wordCount}
Character Count: ${stats.charCount}
Readability Score: ${readability.score} (${readability.level})
Reading Time: ${readability.readingTime} minutes`;

  try {
    await navigator.clipboard.writeText(results);
  } catch (err) {
    console.log('Copy not supported');
    throw new Error('Copy to clipboard not supported');
  }
}

export interface TextCompareData {
  text1: string;
  text2: string;
  additions: number;
  deletions: number;
  changes: number;
  similarity: number;
  chars1: number;
  chars2: number;
  words1: number;
  words2: number;
  diffResult: Array<{
    type: 'equal' | 'insert' | 'delete' | 'replace';
    value: string;
    oldValue?: string;
    newValue?: string;
  }>;
}

export function exportTextComparePDF(data: TextCompareData): void {
  Promise.all([
    import("jspdf"),
  ])
    .then(([jsPDFModule]) => {
      const jsPDF = jsPDFModule.default;

      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      const brandColor = { r: 220, g: 38, b: 38 };
      const lightGray = { r: 248, g: 248, b: 248 };
      const darkGray = { r: 60, g: 60, b: 60 };
      const borderGray = { r: 230, g: 230, b: 230 };
      const greenColor = { r: 34, g: 197, b: 94 };
      const redColor = { r: 239, g: 68, b: 68 };
      const yellowColor = { r: 234, g: 179, b: 8 };
      
      const addHeader = (pageNum: number) => {
        doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        doc.setDrawColor(180, 25, 25);
        doc.setLineWidth(2);
        doc.line(0, 35, pageWidth, 35);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Word Counter Plus", margin, 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Professional Text Comparison Tool", margin, 25);
        
        if (pageNum > 1) {
          doc.setFontSize(9);
          doc.text(`Page ${pageNum}`, pageWidth - margin, 20, { align: 'right' });
        }
      };
      
      const addFooter = (pageNum: number) => {
        const footerY = pageHeight - 25;
        
        doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setLineWidth(1.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        
        doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        doc.rect(0, footerY + 2, pageWidth, 23, 'F');
        
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Word Counter Plus", margin, footerY + 10);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("www.wordcounterplusapp.com", margin, footerY + 16);
        
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setFont("helvetica", "bold");
        doc.text(`Page ${pageNum}`, pageWidth - margin, footerY + 10, { align: 'right' });
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const date = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        doc.text(date, pageWidth - margin, footerY + 16, { align: 'right' });
      };

      let yPosition = 50;
      const lineHeight = 7;
      let pageNum = 1;
      
      addHeader(pageNum);
      
      doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
      doc.roundedRect(margin - 3, yPosition - 8, maxWidth + 6, 20, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("TEXT COMPARISON REPORT", pageWidth / 2, yPosition + 2, { align: 'center' });
      
      yPosition += 20;
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const timestamp = new Date().toLocaleString('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      doc.text(`Generated: ${timestamp}`, pageWidth / 2, yPosition + 5, { align: 'center' });
      yPosition += 15;
      
      doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
      doc.setLineWidth(0.5);
      
      const addSection = (title: string, items: string[], twoColumn = false) => {
        if (yPosition > pageHeight - 50) {
          addFooter(pageNum);
          doc.addPage();
          pageNum++;
          addHeader(pageNum);
          yPosition = 50;
        }
        
        doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
        doc.roundedRect(margin - 3, yPosition, maxWidth + 6, 12, 2, 2, 'F');
        
        doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setLineWidth(0.8);
        doc.line(margin - 3, yPosition + 12, pageWidth - margin + 3, yPosition + 12);
        
        doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 2, yPosition + 8);
        yPosition += 18;
        
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        if (twoColumn) {
          const colWidth = (maxWidth - 15) / 2;
          let rowCount = 0;
          items.forEach((item, index) => {
            const col = index % 2;
            const xPos = margin + (col * (colWidth + 15));
            
            if (col === 0 && index > 0) {
              yPosition += lineHeight + 2;
              rowCount++;
            }
            
            if (yPosition > pageHeight - 50) {
              addFooter(pageNum);
              doc.addPage();
              pageNum++;
              addHeader(pageNum);
              yPosition = 50;
            }
            
            const bgY = yPosition - 5;
            if (rowCount % 2 === 0) {
              doc.setFillColor(252, 252, 252);
              doc.rect(margin - 3, bgY, maxWidth + 6, lineHeight + 2, 'F');
            }
            
            doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
            doc.circle(xPos + 1, yPosition - 1.5, 1, 'F');
            
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(10);
            doc.text(item, xPos + 4, yPosition);
          });
          yPosition += lineHeight + 8;
        } else {
          items.forEach((item, index) => {
            if (yPosition > pageHeight - 50) {
              addFooter(pageNum);
              doc.addPage();
              pageNum++;
              addHeader(pageNum);
              yPosition = 50;
            }
            
            if (index % 2 === 0) {
              doc.setFillColor(252, 252, 252);
              doc.rect(margin - 3, yPosition - 5, maxWidth + 6, lineHeight + 2, 'F');
            }
            
            doc.setFillColor(brandColor.r, brandColor.g, brandColor.b);
            doc.circle(margin + 3, yPosition - 1.5, 1, 'F');
            
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(10);
            doc.text(item, margin + 6, yPosition);
            yPosition += lineHeight + 2;
          });
          yPosition += 5;
        }
      };
      
      const comparisonStats = [
        `Similarity Score: ${data.similarity}%`,
        `Total Changes: ${data.additions + data.deletions + data.changes}`,
        `Additions: ${data.additions}`,
        `Deletions: ${data.deletions}`,
        `Replacements: ${data.changes}`,
        `Matching Segments: ${data.diffResult.filter(r => r.type === 'equal').length}`,
      ];
      addSection("Comparison Summary", comparisonStats, true);
      
      const textStats = [
        `Original Words: ${data.words1}`,
        `Original Characters: ${data.chars1}`,
        `Modified Words: ${data.words2}`,
        `Modified Characters: ${data.chars2}`,
        `Word Difference: ${data.words2 - data.words1 >= 0 ? '+' : ''}${data.words2 - data.words1}`,
        `Character Difference: ${data.chars2 - data.chars1 >= 0 ? '+' : ''}${data.chars2 - data.chars1}`,
      ];
      addSection("Text Statistics", textStats, true);
      
      if (yPosition > pageHeight - 90) {
        addFooter(pageNum);
        doc.addPage();
        pageNum++;
        addHeader(pageNum);
        yPosition = 50;
      }
      
      doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
      doc.roundedRect(margin - 3, yPosition, maxWidth + 6, 12, 2, 2, 'F');
      
      doc.setDrawColor(brandColor.r, brandColor.g, brandColor.b);
      doc.setLineWidth(0.8);
      doc.line(margin - 3, yPosition + 12, pageWidth - margin + 3, yPosition + 12);
      
      doc.setTextColor(brandColor.r, brandColor.g, brandColor.b);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Comparison", margin + 2, yPosition + 8);
      yPosition += 20;
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderGray.r, borderGray.g, borderGray.b);
      doc.setLineWidth(0.5);
      
      const legendY = yPosition;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
      doc.text("Legend:", margin, legendY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      
      doc.setFillColor(greenColor.r, greenColor.g, greenColor.b);
      doc.rect(margin + 15, legendY - 3, 8, 4, 'F');
      doc.setTextColor(greenColor.r, greenColor.g, greenColor.b);
      doc.text("Added", margin + 25, legendY);
      
      doc.setFillColor(redColor.r, redColor.g, redColor.b);
      doc.rect(margin + 45, legendY - 3, 8, 4, 'F');
      doc.setTextColor(redColor.r, redColor.g, redColor.b);
      doc.text("Deleted", margin + 55, legendY);
      
      doc.setFillColor(yellowColor.r, yellowColor.g, yellowColor.b);
      doc.rect(margin + 75, legendY - 3, 8, 4, 'F');
      doc.setTextColor(yellowColor.r, yellowColor.g, yellowColor.b);
      doc.text("Changed", margin + 85, legendY);
      
      yPosition += 10;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      data.diffResult.forEach((diff) => {
        if (yPosition > pageHeight - 40) {
          addFooter(pageNum);
          doc.addPage();
          pageNum++;
          addHeader(pageNum);
          yPosition = 50;
        }
        
        let displayText = '';
        let textColor = darkGray;
        let prefix = '';
        
        if (diff.type === 'equal') {
          displayText = diff.value;
          textColor = darkGray;
        } else if (diff.type === 'insert') {
          displayText = diff.value;
          textColor = greenColor;
          prefix = '+ ';
        } else if (diff.type === 'delete') {
          displayText = diff.value;
          textColor = redColor;
          prefix = '- ';
        } else if (diff.type === 'replace') {
          displayText = `${diff.oldValue} → ${diff.newValue}`;
          textColor = yellowColor;
          prefix = '~ ';
        }
        
        doc.setTextColor(textColor.r, textColor.g, textColor.b);
        const fullText = prefix + displayText;
        const wrappedLines = doc.splitTextToSize(fullText, maxWidth - 4);
        
        wrappedLines.forEach((line: string) => {
          if (yPosition > pageHeight - 40) {
            addFooter(pageNum);
            doc.addPage();
            pageNum++;
            addHeader(pageNum);
            yPosition = 50;
          }
          doc.text(line, margin + 2, yPosition);
          yPosition += 5;
        });
      });
      
      addFooter(pageNum);
      
      doc.save("text-comparison.pdf");
    })
    .catch(() => {
      alert("Unable to generate PDF. Please try the TXT export option.");
    });
}

