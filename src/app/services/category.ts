import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';
import { Storage } from '@ionic/storage-angular';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly KEY = 'categories';
  private categories: ICategory[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const saved = await this.storage.get(this.KEY);
    this.categories = saved || [];
  }

  async getAll(): Promise<ICategory[]> {
    return this.categories;
  }

  async add(name: string, color: string = '#107cd4ff') {
    const newCat: ICategory = { id: uuidv4(), name, color };
    this.categories.push(newCat);
    await this.storage.set(this.KEY, this.categories);
  }

  async update(id: string, name: string, color?: string) {
    const cat = this.categories.find(c => c.id === id);
    if (cat) {
      cat.name = name;
      if (color) cat.color = color;
      await this.storage.set(this.KEY, this.categories);
    }
  }

  async delete(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    await this.storage.set(this.KEY, this.categories);
  }

  async getById(id: string): Promise<ICategory | undefined> {
    return this.categories.find(c => c.id === id);
  }
}