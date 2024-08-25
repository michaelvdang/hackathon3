
export interface Comment {
  id: string;
  index: number;
  content: string;
  x: number;
  y: number;
  dialogHeight: number;
  bottomOffset: number;
}

export type CommentMap = Map<number, Comment>;