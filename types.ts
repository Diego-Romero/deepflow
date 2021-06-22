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
  boards?: Board[]
}

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
}

export type BoardData = {
  columns: Column[]
}