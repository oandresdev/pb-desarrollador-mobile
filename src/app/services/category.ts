import { Injectable } from '@angular/core';
import { ICategory } from '../models/category';
import { Storage } from '@ionic/storage-angular';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  /** Clave usada para almacenar las categorías en el Storage */
  private readonly KEY = 'categories';

  /** Lista de categorías en memoria */
  private categories: ICategory[] = [];

  /**
   * @param storage Instancia de Ionic Storage para persistencia de datos
   */
  constructor(private storage: Storage) {
    this.init();
  }

  /**
   * Inicializa el Storage y carga las categorías guardadas.
   * Se ejecuta automáticamente al crear el servicio.
   */
  async init() {
    await this.storage.create();
    const saved = await this.storage.get(this.KEY);
    this.categories = saved || [];
  }

  /**
   * Obtiene todas las categorías almacenadas
   * @return Promesa con un array de categorías
   */
  async getAll(): Promise<ICategory[]> {
    return this.categories;
  }

  /**
   * Agrega una nueva categoría
   * @param name Nombre de la categoría
   * @param color Color de la categoría (opcional, por defecto azul)
   */
  async add(name: string, color: string = '#107cd4ff') {
    const newCat: ICategory = { id: uuidv4(), name, color };
    this.categories.push(newCat);
    await this.storage.set(this.KEY, this.categories);
  }

  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param name Nuevo nombre de la categoría
   * @param color Nuevo color de la categoría (opcional)
   */
  async update(id: string, name: string, color?: string) {
    const cat = this.categories.find(c => c.id === id);
    if (cat) {
      cat.name = name;
      if (color) cat.color = color;
      await this.storage.set(this.KEY, this.categories);
    }
  }

  /**
   * Elimina una categoría por su ID
   * @param id ID de la categoría a eliminar
   */
  async delete(id: string) {
    this.categories = this.categories.filter(c => c.id !== id);
    await this.storage.set(this.KEY, this.categories);
  }

  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   * @returns Promesa con la categoría encontrada o undefined si no existe
   */
  async getById(id: string): Promise<ICategory | undefined> {
    return this.categories.find(c => c.id === id);
  }
}
