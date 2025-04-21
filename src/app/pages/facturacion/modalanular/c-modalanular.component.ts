import { Component } from '@angular/core';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { constantesLocalStorage } from '@constantes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modalanular',
  templateUrl: './c-modalanular.component.html'
})
export class CMotivoComponent {

  $listSubcription: Subscription[] = [];

    _transaccion: any;
    ordencompra!: any;

    headerTitleAccion!: string;
    errorMensaje: string = "";
    descripcion: string = "";



  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public refDatoItem: DynamicDialogRef,
    private serviceSharedApp: SharedAppService
    ){  }

    ngOnInit(): void {
      this.ordencompra = this.config.data;
      console.log('ordencompra', this.ordencompra);
    }

   

    procesarSunat() {
      if (this.validarDatos()) {
          console.log("errorMensaje : ", this.errorMensaje);
          this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: this.errorMensaje });
          return;
      }

      const objeto = {
          descripcion: this.descripcion,
      }

      this.cerrar(objeto)
  }

  validarDatos(): boolean {
    let _error = false;
    this.errorMensaje = "";
    if (this.descripcion === " " || this.descripcion === "") {
        this.errorMensaje = "Debe Ingresar Motivo...!";
        _error = true;
    }
    return _error;
}

cerrar(data:any) {
  this.refDatoItem.close({data});
}



}
