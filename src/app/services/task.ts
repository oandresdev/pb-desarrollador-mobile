import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  /** Clave usada para almacenar las tareas en el Storage */
  private readonly KEY = 'tasks';

  /** Lista de tareas en memoria */
  private tasks: ITask[] = [];

  /** Indicador de si el Storage está inicializado */
  private isReady = false;

  /**
   * @param storage Instancia de Ionic Storage para persistencia de datos
   */
  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa el Storage y carga las tareas guardadas.
   * Se ejecuta automáticamente al crear el servicio.
   */
  private async init() {
    await this.storage.create();
    const saved = await this.storage.get(this.KEY);
    this.tasks = saved || [];
    this.isReady = true;
  }

  /**
   * Asegura que el Storage esté listo antes de realizar operaciones
   */
  private async ensureReady() {
    if (!this.isReady) {
      await this.init();
    }
  }

  /**
   * Obtiene todas las tareas almacenadas
   * @return Promesa con un array de tareas
   */
  async getAll(): Promise<ITask[]> {
    await this.ensureReady();
    return this.tasks;
  }

  /**
   * Agrega una nueva tarea
   * @param title Título de la tarea
   * @param categoryId Opcional, ID de la categoría a la que pertenece la tarea
   */
  async add(title: string, categoryId?: string | null) {
    await this.ensureReady();
    const newTask: ITask = {
      id: uuidv4(),          // Genera un ID único
      title,
      completed: false,
      categoryId: categoryId ?? '',
    };
    this.tasks.push(newTask);
    await this.storage.set(this.KEY, this.tasks);
  }

  /**
   * Cambia el estado de completada de una tarea
   * @param id ID de la tarea a modificar
   */
  async toggleComplete(id: string) {
    await this.ensureReady();
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      await this.storage.set(this.KEY, this.tasks);
    }
  }

  /**
   * Elimina una tarea por su ID
   * @param id ID de la tarea a eliminar
   */
  async delete(id: string) {
    await this.ensureReady();
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.storage.set(this.KEY, this.tasks);
  }

  /**
   * Actualiza una tarea existente
   * @param updatedTask Objeto de tarea actualizado
   */
  async update(updatedTask: ITask) {
    await this.ensureReady();
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      await this.storage.set(this.KEY, this.tasks);
    }
  }
}
