import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CProgressSpinnerComponent } from './c-progress-spinner/c-progress-spinner.component';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    CProgressSpinnerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CProgressSpinnerComponent
  ],
  providers:[
    DialogService
  ]
})
export class SharedAppModule { }
