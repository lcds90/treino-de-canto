import type { RoutineTask } from 'src/components/models';

export interface ITemplateService {
  getAll(): Promise<RoutineTask[]>;
  getById(id: string): Promise<RoutineTask | null>;
  create(template: Omit<RoutineTask, 'id'>): Promise<RoutineTask>;
  update(template: RoutineTask): Promise<void>;
  delete(id: string): Promise<void>;
}
