import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ICategory } from 'src/app/models/category';
import { ITask } from 'src/app/models/task';
import { CategoryService } from 'src/app/services/category';
import { TaskService } from 'src/app/services/task';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class HomePage implements OnInit {
  tasks: ITask[] = [];
  categories: ICategory[] = [];
  selectedCategoryFilter: string | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadCategories();
    await this.loadTasks();
  }

  async ionViewWillEnter() {
    await this.loadCategories();
    await this.loadTasks();
  }

  async loadTasks() {
    const all = await this.taskService.getAll();
    this.tasks = this.selectedCategoryFilter
      ? all.filter(t => t.categoryId === this.selectedCategoryFilter)
      : all;
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

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

            if (title.length === 0) {
              const errorAlert = await this.alertCtrl.create({
                header: 'Campo obligatorio',
                message: 'Por favor ingresa una descripción para la tarea.',
                buttons: ['Aceptar'],
              });
              await errorAlert.present();
              return false;
            }
            if (this.categories.length > 0) {
              const categoryAlert = await this.alertCtrl.create({
                header: 'Selecciona una categoría',
                inputs: [/* 
                  {
                    name: 'categoryId',
                    type: 'radio' as const,
                    label: 'Sin categoría',
                    value: null,
                    checked: true,
                  }, */
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


  async toggleTask(task: ITask) {
    await this.taskService.update(task);
    await this.loadTasks();
  }

  async deleteTask(id: string) {
    await this.taskService.delete(id);
    await this.loadTasks();
    this.showToast('Tarea eliminada');
  }

  async filterTasksByCategory(event: any) {
    this.selectedCategoryFilter = event.detail.value;
    await this.loadTasks();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom' });
    await toast.present();
  }
  getCategoryName(categoryId: string | null): string {
    if (!categoryId || !this.categories || this.categories.length === 0) {
      return 'Sin categoría';
    }
    const category = this.categories.find(c => String(c.id) === String(categoryId));
    return category ? category.name : 'Sin categoría';
  }
  goToCategories() {
    this.router.navigate(['/category']);
  }
}
