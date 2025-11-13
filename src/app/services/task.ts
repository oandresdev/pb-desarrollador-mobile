import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly KEY = 'tasks';
  private tasks: ITask[] = [];
  private isReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    const saved = await this.storage.get(this.KEY);
    this.tasks = saved || [];
    this.isReady = true;
  }

  private async ensureReady() {
    if (!this.isReady) {
      await this.init();
    }
  }

  async getAll(): Promise<ITask[]> {
    await this.ensureReady();
    return this.tasks;
  }

  async add(title: string, categoryId?: string | null) {
    await this.ensureReady();
    const newTask: ITask = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId: categoryId ?? '',
    };
    this.tasks.push(newTask);
    await this.storage.set(this.KEY, this.tasks);
  }

  async toggleComplete(id: string) {
    await this.ensureReady();
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      await this.storage.set(this.KEY, this.tasks);
    }
  }

  async delete(id: string) {
    await this.ensureReady();
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.storage.set(this.KEY, this.tasks);
  }

  async update(updatedTask: ITask) {
    await this.ensureReady();
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      await this.storage.set(this.KEY, this.tasks);
    }
  }

}