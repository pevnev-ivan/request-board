export interface BoardsModel {
  boards: boards;
}

export type boards = {
  id: number;
  creator: string;
  title: string;
  created_at: Date;
};

export interface ListsModel {
  id: string;
  board_id: number;
  title: string;
  position: number;
  created_at: Date;
}

export interface ListCards {
  [key: string]: card[];
}

export type card = {
  id: number;
  list_id: number;
  board_id: number;
  position: number;
  title: string;
  description: number;
  assigned_to: string;
  done: boolean;
  created_at: Date;
  price: number;
};
