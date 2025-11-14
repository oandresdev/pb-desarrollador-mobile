import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from '../models/task';
import { ITaskRepository } from '../interfaces/task/task';
import { TaskStorageService } from './task-storage';
@Injectable({
  providedIn: 'root',
})
export class TaskService implements ITaskRepository {

  private tasks: ITask[] = [];

  constructor(private storageService: TaskStorageService) {
    this.init();
  }

  private async init() {
    this.tasks = await this.storageService.load();
  }

  async getAll(): Promise<ITask[]> {
    return this.tasks;
  }

  async add(title: string, categoryId?: string | null): Promise<void> {
    const newTask: ITask = {
      id: uuidv4(),
      title,
      completed: false,
      categoryId: categoryId ?? '',
    };
    this.tasks.push(newTask);
    await this.storageService.save(this.tasks);
  }

  async toggleComplete(id: string): Promise<void> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      await this.storageService.save(this.tasks);
    }
  }

  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.storageService.save(this.tasks);
  }

  async update(updatedTask: ITask): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      await this.storageService.save(this.tasks);
    }
  }
}