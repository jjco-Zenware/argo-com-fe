import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AlmacenService } from '../../service/almacenServices';
@Component({
  selector: 'app-c-modalitem',
  templateUrl: './modalitem.component.html'
})
export class CModalItemComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  registerFormCliente!: FormGroup;
lstTipoProcesos: any;
lstMovimientos: any;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
        private almacenService: AlmacenService,
  ) { }


  get formCliente() { return this.registerFormCliente.controls; }

  ngOnInit(): void {
    this.createFormCliente();
    this.listarTipoDocPrc();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormCliente = this.formBuilder.group({
        idtipodocprc : [{ value: 0, disabled: false }],
        alm_idordencompra: [{ value: 0, disabled: false }],
    });
}



  guardar() {
      console.log('guardarCliente...', this.registerFormCliente.getRawValue());

      // deténgase aquí si el formulario no es válido
      if (this.registerFormCliente.invalid) {
          console.log('deténgase aquí si el formulario no es válido');
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Faltan Ingresar Datos..." });
          return;
      }

      
        this.cerrar(this.registerFormCliente.value.alm_idordencompra);

      
  }

  

  cerrar(data:any) {   
    this.refDatoItem.close(data);
  }

  listarTipoDocPrc(){      
      const $getListar = this.almacenService.ListarMovimientosPrcSalidas()
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta lstTipoProcesos', rpta);
              this.lstTipoProcesos = rpta
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }

     lstMovimientosConfirmados(){
      
      const $getListar = this.almacenService.lstMovimientosConfirmados(this.registerFormCliente.value.idtipodocprc)
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta lstMovimientosConfirmados', rpta);
              this.lstMovimientos = rpta;
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }
 
     

    changeUbicacion() {
      this.lstMovimientosConfirmados();
    }
}
