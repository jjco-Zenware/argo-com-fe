import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
    data: { breadcrumb: 'Empleados' }
  },
  {
    path: 'resultado',
    loadChildren: () => import('./resultado/resultado.module').then(m => m.ResultadoModule),
    data: { breadcrumb: 'Resultados Operativos' }
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }