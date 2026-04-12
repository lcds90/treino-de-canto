export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export type PlatformType = 'youtube' | 'udemy' | 'hotmart' | 'yousician' | 'other'

export interface RoutineTask {
  id: string
  title: string
  platform: PlatformType
  mediaUrl: string
  instructions: string
  checklist: ChecklistItem[]
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface WorkoutMetrics {
  total: number;
  completed: number;
  partial: number;
  uncompleted: number;
}

export interface WoroutTiming {
    durationSeconds: number;
    start: string | Date;
    end: string | Date;
}

export interface WorkoutSession {
  id?: string;
  date: string; // Data ISO de quando o treino foi finalizado
  metrics: WorkoutMetrics;
  tasksSnapshot: RoutineTask[]; // A "foto" dos cards no momento da finalização
  timing?: WoroutTiming;
}
