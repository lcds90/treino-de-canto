import type { RoutineTask } from 'src/components/models';

export interface IRoutineService {
  getAll(): Promise<RoutineTask[]>;
  getById(id: string): Promise<RoutineTask | null>;
  create(task: Omit<RoutineTask, 'id'>): Promise<RoutineTask>;
  update(task: RoutineTask): Promise<void>;
  delete(id: string): Promise<void>;
}
