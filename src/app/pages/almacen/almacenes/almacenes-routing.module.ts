import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CAlmacenesComponent } from './c-almacenes/c-almacenes.component';

const routes: Routes = [
  {
    path:'',
    component: CAlmacenesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenesRoutingModule { }
