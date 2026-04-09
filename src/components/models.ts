export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface RoutineTask {
  id: string
  title: string
  videoUrl: string
  instructions: string
  checklist: ChecklistItem[]
}
