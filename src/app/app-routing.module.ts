import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    redirectTo: environment.TASK,
    pathMatch: 'full'
  },
  {
    path: environment.TASK,
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: environment.CATEGORY,
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule)
  },
  /* {
    path: 'flag',
    loadChildren: () => import('./pages/flag/flag.module').then( m => m.FlagPageModule)
  }, */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
