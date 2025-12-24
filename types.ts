
export interface StorySegment {
  id: string;
  text: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
}
