import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { CModalRegPAgosComponent } from '../modalregpagos/c-modalregpagos.component';
import { TesoreriaService } from '../service/tesoreriaServices';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-modalasiento',
  templateUrl: './c-modalasiento.component.html'
})
export class CModalListAsiento implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  headerTitle?: string;
  lstAsiento: any[] = [];
  summontoTotal: number= 0;
  verEditarPagos: boolean = false;
  tot_debe: number = 0;
  tot_haber: number = 0;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private tesoreriaService: TesoreriaService, 
    private serviceSharedApp: SharedAppService,
    private confirmationService: ConfirmationService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param...', this.param);

    this.lstAsiento = this.param.asientos || [];
  
    this.tot_debe = this.lstAsiento.reduce((acc: number, item: any) => acc + item.mtodebe, 0);
    this.tot_haber = this.lstAsiento.reduce((acc: number, item: any) => acc + item.mtohaber, 0);
    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }


 
 
}
