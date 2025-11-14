import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ICategory } from 'src/app/models/category';
import { ITask } from 'src/app/models/task';
import { CategoryService } from 'src/app/services/category';
import { TaskService } from 'src/app/services/task';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class HomePage implements OnInit {
  /** Lista de todas las tareas */
  tasks: ITask[] = [];

  /** Lista de todas las categorías */
  categories: ICategory[] = [];

  /** ID de la categoría seleccionada para filtrar las tareas */
  selectedCategoryFilter: string | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  /**
   * Se ejecuta al inicializar el componente.
   * Carga categorías y tareas.
   */
  async ngOnInit() {
    await this.loadCategories();
    await this.loadTasks();
  }

  /**
   * se ejecuta cada vez que la vista entra en pantalla.
   * Se asegura de que las listas estén actualizadas.
   */
  async ionViewWillEnter() {
    await this.loadCategories();
    await this.loadTasks();
  }

  /**
   * Carga todas las tareas desde el servicio.
   * Aplica filtro si se ha seleccionado una categoría.
   */
  async loadTasks() {
    const all = await this.taskService.getAll();
    this.tasks = this.selectedCategoryFilter
      ? all.filter(t => t.categoryId === this.selectedCategoryFilter)
      : all;
  }

  /**
   * Carga todas las categorías desde el servicio.
   */
  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  /**
   * Muestra un alert para crear una nueva tarea.
   * Permite ingresar título y seleccionar categoría si existen.
   */
  async addTask() {
    const titleAlert = await this.alertCtrl.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text' as const,
          placeholder: 'Descripción de la tarea',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente',
          handler: async (data) => {
            const title = (data.title || '').trim();

            // Validación: título no puede estar vacío
            if (title.length === 0) {
              const errorAlert = await this.alertCtrl.create({
                header: 'Campo obligatorio',
                message: 'Por favor ingresa una descripción para la tarea.',
                buttons: ['Aceptar'],
              });
              await errorAlert.present();
              return false;
            }

            // Si existen categorías, mostrar selección
            if (this.categories.length > 0) {
              const categoryAlert = await this.alertCtrl.create({
                header: 'Selecciona una categoría',
                inputs: [
                  ...this.categories.map(cat => ({
                    name: 'categoryId',
                    type: 'radio' as const,
                    label: cat.name,
                    value: cat.id,
                  })),
                ],
                buttons: [
                  { text: 'Cancelar', role: 'cancel' },
                  {
                    text: 'Guardar',
                    handler: async (categoryId) => {
                      await this.taskService.add(title, categoryId);
                      await this.loadTasks();
                      this.showToast('Tarea creada correctamente');
                      return true;
                    },
                  },
                ],
              });
              await categoryAlert.present();
            } else {
              // Si no hay categorías, solo crear la tarea
              await this.taskService.add(title);
              await this.loadTasks();
              this.showToast('Tarea creada correctamente');
            }
            return true;
          },
        },
      ],
    });
    await titleAlert.present();
  }

  /**
   * Alterna el estado completado de una tarea.
   * @param task Tarea a marcar/desmarcar
   */
  async toggleTask(task: ITask) {
    await this.taskService.toggleComplete(task.id);
    await this.loadTasks();
  }

  /**
   * Elimina una tarea después de confirmar la acción con un alert.
   * @param id ID de la tarea a eliminar
   */
  async deleteTask(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.taskService.delete(id);
            await this.loadTasks();
            this.showToast('Tarea eliminada');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Filtra la lista de tareas por la categoría seleccionada.
   * @param event Evento del select de categorías
   */
  async filterTasksByCategory(event: any) {
    this.selectedCategoryFilter = event.detail.value;
    await this.loadTasks();
  }

  /**
   * Muestra un toast con un mensaje temporal en la parte inferior de la pantalla.
   * @param message Mensaje a mostrar
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom' });
    await toast.present();
  }

  /**
   * Devuelve el nombre de la categoría según su ID.
   * Si no existe, devuelve "Sin categoría".
   * @param categoryId ID de la categoría
   */
  getCategoryName(categoryId: string | null): string {
    if (!categoryId || !this.categories || this.categories.length === 0) {
      return 'Sin categoría';
    }
    const category = this.categories.find(c => String(c.id) === String(categoryId));
    return category ? category.name : 'Sin categoría';
  }

  /**
   * Redirige a la página de categorías.
   */
  goToCategories() {
    this.router.navigate([environment.CATEGORY]);
  }

  /**
   * Función para optimizar ngFor trackeo por ID.
   * @param index Índice del elemento
   * @param item Tarea
   */
  trackById(index: number, item: ITask): string {
    return item.id;
  }
}
