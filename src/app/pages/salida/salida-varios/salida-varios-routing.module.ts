import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CSalidaVariosComponent } from './c-salida-varios/c-salida-varios.component';

const routes: Routes = [
  {
    path:'',
    component: CSalidaVariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaVariosRoutingModule { }