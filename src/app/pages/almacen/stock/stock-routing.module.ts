import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CStockComponent } from './c-stock/c-stock.component';

const routes: Routes = [
  {
    path:'',
    component: CStockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }