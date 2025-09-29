import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AlmacenService } from '../../service/almacenServices';
@Component({
  selector: 'app-c-modalubicacion',
  templateUrl: './c-modalubicacion.component.html'
})
export class CModalUbicacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  registerFormCliente!: FormGroup;
  //lstIcons: any; 
  lstUbicaciones: any; 
  lstIcons: any;

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
    //console.log('this.config.data...', this.config.data);
    this.createFormCliente();
    this.listarUbicaciones();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormCliente = this.formBuilder.group({
        idubicacion: [{ value: this.config.data.key, disabled: false }],
        idalmacen :  [{ value: this.config.data.idalmacen, disabled: false }],
        nomubicacion : [{ value: this.config.data.nomubicacion, disabled: false }],
        idubicacionpadre : [{ value: this.config.data.idubicacionpadre, disabled: false }],
        idiconotree: [{ value: 401, disabled: false }],
        ubicacion: [{ value: 0, disabled: false }],
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

      const $TraerUbicacion = this.almacenService.prcUbicaciones(this.registerFormCliente.value)
            .subscribe({
            next: (rpta:any) => {
                if (rpta.procesoSwitch === 0){
                    this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });                   
                    this.cerrar({...this.registerFormCliente.getRawValue()})
                  }else{
                  this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                  }
            },
            error:(err)=>{
                this.serviceSharedApp.messageToast()
            },
            complete:() => { 
            }
            });
        this.$listSubcription.push($TraerUbicacion)


      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listarItemsTabla() {
    this.almacenService.obtenerItemsTabla(125).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstIcons = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }
 
     listarUbicaciones() {
    this.almacenService.obtenerItemsTabla(132).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstUbicaciones = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

    changeUbicacion(value:any) {
      const selectedUbicacion = this.lstUbicaciones.find((item: any) => item.iditem === value); 
      console.log('selectedUbicacion...', selectedUbicacion);
      this.registerFormCliente.get('nomubicacion')?.setValue(selectedUbicacion ? selectedUbicacion.valoritem : '');
    }
}
