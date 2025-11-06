import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCatalogoHabitacionComponent } from './c-catalogo-habitacion/c-catalogo-habitacion.component';

const routes: Routes = [
  {
    path: '',
    component: CCatalogoHabitacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoHabitacionRoutingModule { }
