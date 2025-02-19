import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
@Component({
  selector: 'app-c-modalcomentario',
  templateUrl: './c-modalcomentario.component.html'
})
export class CModalComentarioComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    onlyRead: boolean = false;
    registerFormPropuesta!: FormGroup;
    errorMensaje: string = "";

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
        private ordencompraService: OrdencompraService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);
    this.createFormCliente();

    if (this.param.iditempostor) {
        this.registerFormPropuesta.patchValue(this.param);
        this.registerFormPropuesta.get('comentario')?.setValue('');
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormPropuesta = this.formBuilder.group({
        iditempostor: [{ value: this.config.data.iditempostor, disabled: false }],
        comentario: [{ value: null, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    });
}

  guardarCliente() {       
    console.log('guardarCliente...', this.registerFormPropuesta.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    this.ordencompraService.postordocumentoseleccionacotiza(this.registerFormPropuesta.getRawValue()).subscribe({
          next: (rpta: any) => {
            if (rpta.procesoSwitch === 0){
              this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });    
            }else{
            this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
            return;
            }
          },
          error: (err) => {
          this.messageService.clear();
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: mensajesQuestion.msgErrorGenerico,
              });
          },
          complete: () => {
          },
      });

   

    this.cerrar({...this.registerFormPropuesta.getRawValue()})      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }



  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormPropuesta.value);

    if (this.registerFormPropuesta.value.comentario === '' || this.registerFormPropuesta.value.comentario === null)
      {
          this.errorMensaje="Ingresar Comentario...!";
          _error = true;
      }
      

    return _error;
    }
 
}
