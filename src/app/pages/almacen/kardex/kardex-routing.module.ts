import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CKardexComponent } from './c-kardex/c-kardex.component';

const routes: Routes = [
  {
    path:'',
    component: CKardexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexRoutingModule { }
