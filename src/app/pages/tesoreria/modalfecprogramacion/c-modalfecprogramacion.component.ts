import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { mensajesQuestion, mensajesSpinner } from '@constantes';
import { TesoreriaService } from '../service/tesoreriaServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-c-modalfecprogramacion',
  templateUrl: './c-modalfecprogramacion.component.html'
})
export class CModalProgramacionComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    param: any;
    registerForm!: FormGroup;
    errorMensaje: string = "";
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
 
  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private tesoreriaService: TesoreriaService, 
    private utilitariosService: UtilitariosService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param...', this.param);
    this.createForm();    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createForm() {
    //Agregar validaciones de formulario
    this.registerForm = this.formBuilder.group({
        fecprogramacion: [{ value: this.param.fecprogramacion, disabled: false }],
        nrofactura: [{ value: this.param.nrofactura, disabled: false }],
        nomcomercial: [{ value: this.param.nomcomercial, disabled: false }],
        idordencompra: [{ value: this.param.idordencompra, disabled: false }],
        indprogramado: [{ value: this.param.indprogramado, disabled: false }],
    });
  }

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}

programarPago() {
    if (this.validarDatos())
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjGuardar

      let fecprogramacion;
      fecprogramacion = this.registerForm.value.fecprogramacion;

    if (fecprogramacion.length === 10) {
      fecprogramacion = new Date(this.utilitariosService.formatFecha(fecprogramacion));      
    }

    const objeto = {
      ...this.registerForm.getRawValue(),
      fecprogramacion,
    }
     
    console.log('this.paraobjetom...', objeto);
      this.tesoreriaService.updateFechaProgramacion(objeto)
        .subscribe({
        next: (rpta:any) => {
          this.setSpinner(false);
            console.log("rpta prcClientes : ", rpta);
            if (rpta.procesoSwitch == 0){
                this.messageService.add({severity: 'success', detail: "Operación exitosa...!" });
                this.cerrar({...this.registerForm.getRawValue()})
                }else{
                    this.messageService.add({severity: 'error', detail: rpta.mensaje });
                }
        },
        error:(err)=>{
          this.setSpinner(false);
            console.error('error : ',err)
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: mensajesQuestion.msgErrorGenerico
            })
        },
        complete:() => {}
      });
      
  }

  cerrar(data:any) {
    this.registerForm.reset();
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";

    if (this.registerForm.value.fecprogramacion === '' || this.registerForm.value.fecprogramacion === null)
      {
          this.errorMensaje="Seleccionar Fecha...!";
          _error = true;
      }

      return _error;
    }
 
}
