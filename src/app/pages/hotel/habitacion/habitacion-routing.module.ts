import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CHabitacionListComponent } from './c-habitacion-list/c-habitacion-list.component';

const routes: Routes = [
  {
    path: '',
    component: CHabitacionListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitacionRoutingModule { }
