import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ICategory } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
  standalone: true
})
export class CategoryPage implements OnInit {
  environment = environment;
  categories: ICategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadCategories();
  }

  async ionViewWillEnter() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  async addCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Nombre de la categoría', }],
      buttons: [{ text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (data) => {
          const name = (data.name || '').trim();
          if (name.length === 0) {
            const errorAlert = await this.alertCtrl.create({
              header: 'Campo obligatorio',
              message: 'Por favor ingresa un nombre para la categoría.',
              buttons: ['Aceptar'],
            });
            await errorAlert.present();
            return false;
          }
          await this.categoryService.add(name);
          await this.loadCategories();
          this.showToast('Categoría creada correctamente');
          return true;
        },
      },
      ],
    });
    await alert.present();
  }

  async editCategory(category: ICategory) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      inputs: [{ name: 'name', type: 'text', value: category.name }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            const name = (data.name || '').trim();
            if (name.length === 0) {
              const errorAlert = await this.alertCtrl.create({
                header: 'Campo obligatorio',
                message: 'Por favor ingresa un nombre para la categoría.',
                buttons: ['Aceptar'],
              });
              await errorAlert.present();
              return false;
            }
            await this.categoryService.update(category.id, name);
            await this.loadCategories();
            this.showToast('Categoría actualizada');
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteCategory(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar esta categoría?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.categoryService.delete(id);
            await this.loadCategories();
            this.showToast('Categoría eliminada');
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom' });
    await toast.present();
  }

  goBackToTasks() {
    this.router.navigate([environment.TASK]);
  }
}