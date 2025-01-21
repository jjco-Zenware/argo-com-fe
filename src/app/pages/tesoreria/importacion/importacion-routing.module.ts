import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CImportacionComponent } from './c-importacion/c-importacion.component';

const routes: Routes = [
    {
      path:'',
      component: CImportacionComponent
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportacionRoutingModule { }