import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CProduccionListComponent } from './c-produccion-list/c-produccion-list.component';

const routes: Routes = [
  {
    path: '',
    component: CProduccionListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduccionRoutingModule { }
