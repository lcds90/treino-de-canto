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
