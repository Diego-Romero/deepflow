
export type ColumnItemType = {
  name: string;
  id: string;
  description?: string;
};

export type ColumnType = {
  name: string;
  id: string;
  items: ColumnItemType[];
};

export type BoardType = {
  id: string;
  name: string;
  columns?: ColumnType[]
}