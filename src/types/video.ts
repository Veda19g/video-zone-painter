
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  file: File;
  url: string;
  thumbnail?: string;
  uploadDate: Date;
  duration?: number;
}
