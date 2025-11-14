import { ITask } from '../../models/task';

export interface ITaskRepository {
  getAll(): Promise<ITask[]>;
  add(title: string, categoryId?: string | null): Promise<void>;
  update(task: ITask): Promise<void>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<void>;
}