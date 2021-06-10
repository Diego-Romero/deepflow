
export type columnItem = {
  name: string;
  id: string;
  description?: string;
};

export type column = {
  name: string;
  id: string;
  items: columnItem[];
};