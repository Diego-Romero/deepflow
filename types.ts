
export type ColumnItemType = {
  name: string;
  createdAt: number;
};

export type ColumnType = {
  name: string;
  items?: ColumnItemType[];
};

export type BoardType = {
  id: string;
  name: string;
  columns: ColumnType[]
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