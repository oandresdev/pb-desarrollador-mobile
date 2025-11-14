import { ITask } from '../../models/task';

export interface ITaskStorage {
  load(): Promise<ITask[]>;
  save(tasks: ITask[]): Promise<void>;
}