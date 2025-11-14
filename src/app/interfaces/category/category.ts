import { ICategory } from "../../models/category";

export interface ICategoryRepository {
  getAll(): Promise<ICategory[]>;
  add(name: string, color?: string): Promise<void>;
  update(id: string, name: string, color?: string): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<ICategory | undefined>;
}