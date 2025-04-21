import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
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
  verEditarPagos: boolean = false;
 
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
    if (this.param.saldo_documento === 0) {
      this.verEditarPagos = true;
    }
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

          const objeto = {  
            idordencompra: this.param.idordencompra,
            tipodeuda: this.param.tipodeuda,
          }
     
      const $getListar = this.tesoreriaService.listPagoDocumento(objeto)
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
    console.log('rpta data', data);
    data.tipodeuda = 1;
    data.nomcomercial = this.param.nomcomercial;  
    data.nrofactura = this.param.nrofactura;
    data.bancoproveedor = this.param.bancoproveedor;
    data.nomempresa = this.param.nomempresa;
    
    const refItem = this.dialogService.open(CModalRegPAgosComponent, {
      data: data,
      header: "Editar Pago",
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


  onEliminar(data: any){
    console.log('onEliminar...', data);
   
    this.confirmationService.confirm({
        key: 'confirm1',
        header: 'Confirmación',
        message: '¿Estás seguro de Extornar el Registro...',
        accept: () => {
          const objeto = {
            idpagodocprc :data.idpagodocprc,  
            idusuario: constantesLocalStorage.idusuario,
          }
          const $getListar = this.tesoreriaService.pagodocextornoprc(objeto)
          .subscribe({
            next: (rpta:any) => {
                console.log('Extornar ', rpta);
                this.cerrar({...rpta})
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
        });
  }
 
}
