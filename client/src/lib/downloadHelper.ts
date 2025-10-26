export interface DownloadData {
  content: string;
  filename: string;
  fileType: 'txt' | 'pdf' | 'csv';
  mimeType: string;
}

export function prepareDownload(data: DownloadData): void {
  sessionStorage.setItem('downloadData', JSON.stringify(data));
  window.location.href = '/download';
}
