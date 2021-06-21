
export type ColumnItem = {
  name: string;
  createdAt: number;
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
}