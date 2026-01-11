import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMantenimientoListadoComponent } from './c-mantenimiento-listado/c-mantenimiento-listado.component';

const routes: Routes = [
    {
      path:'',
      component: CMantenimientoListadoComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
