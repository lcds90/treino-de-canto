// src/services/interfaces/IWorkoutService.ts
import type { WorkoutSession } from 'src/components/models';

export interface IWorkoutService {
  getAll(): Promise<WorkoutSession[]>;
  getById(id: string): Promise<WorkoutSession | null>;
  create(session: WorkoutSession): Promise<WorkoutSession>;
}
