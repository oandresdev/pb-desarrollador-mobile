import { ICategory } from "../../models/category";

export interface ICategoryStorage {
  load(): Promise<ICategory[]>;
  save(categories: ICategory[]): Promise<void>;
}