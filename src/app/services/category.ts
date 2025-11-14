import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';
import { v4 as uuidv4 } from 'uuid';
import { ICategoryRepository } from '../interfaces/category/category';
import { CategoryStorageService } from './category-storage';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements ICategoryRepository {

  private categories: ICategory[] = [];

  constructor(private categoryStorage: CategoryStorageService) {
    this.init();
  }

  private async init() {
    this.categories = await this.categoryStorage.load();
  }

  async getAll(): Promise<ICategory[]> {
    return this.categories;
  }

  async add(name: string, color: string = '#107cd4ff'): Promise<void> {
    const newCat: ICategory = { id: uuidv4(), name, color };
    this.categories.push(newCat);
    await this.categoryStorage.save(this.categories);
  }

  async update(id: string, name: string, color?: string): Promise<void> {
    const cat = this.categories.find(c => c.id === id);
    if (cat) {
      cat.name = name;
      if (color) cat.color = color;
      await this.categoryStorage.save(this.categories);
    }
  }

  async delete(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
    await this.categoryStorage.save(this.categories);
  }

  async getById(id: string): Promise<ICategory | undefined> {
    return this.categories.find(c => c.id === id);
  }
}
