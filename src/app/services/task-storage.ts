import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ITask } from '../models/task';
import { ITaskStorage } from '../interfaces/task/task-storage';

@Injectable({
    providedIn: 'root',
})
export class TaskStorageService implements ITaskStorage {

    private readonly KEY = 'tasks';

    constructor(private storage: Storage) { }

    async load(): Promise<ITask[]> {
        await this.storage.create();
        return (await this.storage.get(this.KEY)) || [];
    }

    async save(tasks: ITask[]): Promise<void> {
        await this.storage.set(this.KEY, tasks);
    }
}
