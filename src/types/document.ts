export interface PrintSettings {
  sides: 'single' | 'double';
  color: 'color' | 'blackAndWhite';
  pageSize: 'A4' | 'A3' | 'letter' | 'legal';
  copies: number;
  orientation: 'portrait' | 'landscape';
  pages: string;
}

export interface UploadedDocument {
  id?: string;
  documentId?: string;
  name?: string;
  fileName?: string;
  pageCount?: number;
  price?: number;
  printSettings?: PrintSettings;
}
