
export type ColumnItemType = {
  name: string;
  description?: string;
};

export type ColumnType = {
  name: string;
  items: ColumnItemType[];
};

export type BoardType = {
  id: string;
  name: string;
  columns: ColumnType[]
}