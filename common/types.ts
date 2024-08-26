
export interface Comment {
  id: string;
  cursorIndex: number;
  divIndex: number;
  content: string;
  x: number;
  y: number;
  dialogHeight: number;
  bottomOffset: number;
  type: string;
}


export type CommentMap = Map<number, Comment>;

export interface TranscriptMessage {
  role: string;
  content: string;
}