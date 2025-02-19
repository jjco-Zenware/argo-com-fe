import { Component } from '@angular/core';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';import { KanbanCard } from '@interfaces';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { OrdencompraService } from '../service/ordencompra.service';

@Component({
  selector: 'app-modal-exc-transac',
  templateUrl: './modal-exc-transac.component.html',
  styleUrls: ['./modal-exc-transac.component.scss']
})
export class CModalExcTransacComponent {

  $listSubcription: Subscription[] = [];

    _transaccion: any;
    ordencompra!: any;

    headerTitleAccion!: string;
    btnTitleAccion!: string;
    btnIdAccion!: number;
    errorMensaje: string = "";
    descripcion: string = "";
    btnIconAccion!: string;
    btnColor!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public refDatoItem: DynamicDialogRef,
    private serviceSharedApp: SharedAppService,
    private ordencompraService: OrdencompraService
    ){  }

    ngOnInit(): void {
      this.ordencompra = this.config.data;
      console.log('ordencompra', this.ordencompra);
      this._transaccion = this.config.data.acciones.filter((x: { idtrx: any; })=>x.idtrx === this.config.data.idtrx);
      this.cargarData();
    }

    cargarData(){
      this.headerTitleAccion = this._transaccion[0].nomtrx;
      this.btnTitleAccion = this._transaccion[0].nomtrxbtn;
      this.btnIdAccion = this._transaccion[0].idtrx;
      this.btnIconAccion = this._transaccion[0].icono;
      this.btnColor = this._transaccion[0].clasebtn;    
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
    }

    procesarTRX(codigo: number) {
      if (this.validarDatos()) {
          console.log("errorMensaje : ", this.errorMensaje);
          this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: this.errorMensaje });
          return;
      }

      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjProcesando

      const objeto = {
          idtrx: codigo,
          idusuario: constantesLocalStorage.idusuario,
          descripcion: this.descripcion,
          iddocumentoprc: this.ordencompra.idordencompra,
      }

      const $procesarTrx = this.ordencompraService.procesarTrx(objeto).subscribe({
          next: (rpta: any) => {
              console.log('prcReunion', rpta);
              this.setSpinner(false);
              if (rpta.procesoSwitch === 0) {
                  console.log('entro procesoSwitch....');
                  this.cerrar(objeto)
              }

              this.serviceSharedApp.messageToast({
                  severity: rpta.procesoSwitch === "0" ? 'success' : 'info',
                  summary: rpta.procesoSwitch === "0" ? 'Exito' : 'Validación...!',
                  detail: rpta.mensaje
              });
          },
          error: (err) => {
            this.setSpinner(false);
              console.error('error : ', err);
              this.serviceSharedApp.messageToast();
          },
          complete: () => {},
      });
      this.$listSubcription.push($procesarTrx)
  }

  validarDatos(): boolean {
    let _error = false;
    this.errorMensaje = "";
    if (this.descripcion === " " || this.descripcion === "") {
        this.errorMensaje = "Debe Ingresar Descripción...!";
        _error = true;
    }
    return _error;
}

cerrar(data:any) {
  this.refDatoItem.close({data});
}

}
