import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ICategory } from '../models/category';
import { ICategoryStorage } from '../interfaces/category/category-storage';

@Injectable({
  providedIn: 'root'
})
export class CategoryStorageService implements ICategoryStorage {

  private readonly KEY = 'categories';

  constructor(private storage: Storage) {}

  async load(): Promise<ICategory[]> {
    await this.storage.create();
    return (await this.storage.get(this.KEY)) || [];
  }

  async save(categories: ICategory[]): Promise<void> {
    await this.storage.set(this.KEY, categories);
  }
}
