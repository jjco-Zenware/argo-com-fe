import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { mensajesQuestion, mensajesSpinner } from '@constantes';
import { CModalRegPAgosComponent } from '../modalregpagos/c-modalregpagos.component';
import { TesoreriaService } from '../service/tesoreriaServices';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-modallistpagos',
  templateUrl: './c-modallistpagos.component.html'
})
export class CModalListPAgosComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  headerTitle?: string;
  submitted?: boolean;  
  onlyRead: boolean = false;
  lstPagos: any[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  summontoTotal: number= 0;
 
  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private tesoreriaService: TesoreriaService, 
          private serviceSharedApp: SharedAppService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param...', this.param);
    this.getListar();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getListar(){
      //console.log('this.frmDatos...', this.frmDatos.value);
      this.setSpinner(true);
          this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
     
      const $getListar = this.tesoreriaService.listPagoDocumento(this.param.idordencompra)
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta getListar', rpta);
              this.lstPagos = rpta
              let total = this.lstPagos.map(({montopago}) => montopago).reduce((acc, value) => acc + value, 0);
              this.summontoTotal = total;
              this.setSpinner(false);
          },
          error:(err)=>{
            this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  onEdit(data: any){

    data.nomcomercial = this.param.nomcomercial;
    data.nrofactura = this.param.nrofactura;

    const $traerUno = this.tesoreriaService.traerunoPagoDocumento(data.idpagodocprc)
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta traerUno', rpta[0]);
              if (rpta.length > 0) {
                const refItem = this.dialogService.open(CModalRegPAgosComponent, {
                  data: rpta[0],
                  header: "Editar Pago / Cliente  "+ data.nomcomercial + ' / N° DOC - ' + data.nrofactura,
                  closeOnEscape: false,
                  styleClass: 'testDialog',
                  width: '30%'
                });
                refItem.onClose.subscribe((rpta: any) => {
                  
                  console.log('onClose',rpta);
                  if (rpta != undefined) {
                            this.getListar();
                  }
                });
              }
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($traerUno)


   
  }

  onEliminar(data: any){

  }
 
}
