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

  /** Variable de entorno para rutas y configuración global */
  environment = environment;

  /** Lista de categorías cargadas */
  categories: ICategory[] = [];

  /**
   * Constructor del componente
   * @param categoryService Servicio para gestionar categorías
   * @param alertCtrl Controlador de alertas de Ionic
   * @param toastCtrl Controlador de toasts de Ionic
   * @param router Router de Angular para navegación
   */
  constructor(
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  /**
   * Carga todas las categorías al iniciar
   */
  async ngOnInit() {
    await this.loadCategories();
  }

  /**
   * Se ejecuta cada vez que la vista entra en primer plano
   * Recarga las categorías para mantener la información actualizada
   */
  async ionViewWillEnter() {
    await this.loadCategories();
  }

  /**
   * Carga todas las categorías desde el servicio
   */
  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  /**
   * Abre un alerta para crear una nueva categoría
   * Valida que el nombre no esté vacío
   */
  async addCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Nombre de la categoría' }],
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

  /**
   * Abre un alerta para editar una categoría existente
   * Valida que el nombre no esté vacío
   * @param category Categoría a editar
   */
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

  /**
   * Abre un alerta de confirmación para eliminar una categoría
   * @param id ID de la categoría a eliminar
   */
  async deleteCategory(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro que deseas eliminar esta categoría?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
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

  /**
   * Muestra un toast con un mensaje
   * @param message Mensaje a mostrar
   */
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 1500, position: 'bottom' });
    await toast.present();
  }

  /**
   * Navega de regreso a la pantalla de tareas
   */
  goBackToTasks() {
    this.router.navigate([environment.TASK]);
  }
}