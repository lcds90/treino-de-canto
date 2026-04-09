export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export type PlatformType = 'youtube' | 'udemy' | 'hotmart' | 'yousician' | 'other'

export interface RoutineTask {
  id: string
  title: string
  platform: PlatformType // <-- Nova propriedade
  mediaUrl: string       // <-- Mudamos de videoUrl para mediaUrl, pois pode ser um link externo
  instructions: string
  checklist: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}
