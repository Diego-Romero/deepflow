export type User = {
  workInterval: number;
  shortRestTime: number;
  longRestTime: number;
  longBreakAfter: number;
  targetPerDay: number;
  timerEndTime: number;
  pomodoroCount: number;
  onShortBreak: boolean;
  onLongBreak: boolean;
  isTimerPlaying: boolean;
  boards?: Board[];
  todos: TodoItem[];
};

export type UserWorkedTime = {
  [date: string]: WorkedTime;
};

export interface WorkedTime {
  count: number;
  worked: number;
}

export interface WorkedTimeWithDate extends WorkedTime {
  date: string;
}

export type TodoItem = {
  name: string;
  createdAt: number;
  done: boolean;
};

export type ColumnItem = {
  name: string;
  createdAt: number;
  description?: string;
  done?: boolean;
};

export type Column = {
  name: string;
  items?: ColumnItem[];
};

export type Board = {
  name: string;
  createdAt: number;
  updatedAt: number;
  colSize: number;
};

export type BoardData = {
  columns: Column[];
};
