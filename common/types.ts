
export interface Comment {
  id: string;
  cursorIndex: number;
  divIndex: number;
  content: string;
  x: number;
  y: number;
  dialogHeight: number;
  bottomOffset: number;
}


export type CommentMap = Map<string, Comment>;