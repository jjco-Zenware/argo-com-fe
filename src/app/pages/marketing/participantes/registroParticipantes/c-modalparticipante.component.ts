import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-c-modalparticipante',
  templateUrl: './c-modalparticipante.component.html'
})
export class CModalParticipanteComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  registerFormRegistro!: FormGroup;
  headerTitle?: string;
  submitted?: boolean;  

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.createFormCliente();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
    nombres: [{ value: null, disabled: false }],
    apellidos: [{ value: null, disabled: false }],
    celular: [{ value: null, disabled: false }],
    cargo :  [{ value: null, disabled: false }],
    empresa:  [{ value: null, disabled: false }],
    email: ['', [Validators.required, Validators.email]],
    });
}



guardarParticipante() {
      this.submitted = true;
      console.log('guardarParticipante...', this.registerFormRegistro.getRawValue());

      // deténgase aquí si el formulario no es válido
      if (this.registerFormRegistro.invalid) {
          console.log('deténgase aquí si el formulario no es válido');
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Faltan Ingresar Datos..." });
          return;
      }

      //Verdadero si todos los campos están llenos
      if(this.submitted)
      {
          // this.ordencompraService.prcClientes(this.registerFormRegistro.getRawValue())
          //     .subscribe({
          //     next: (rpta:any) => {
          //         console.log("rpta prcClientes : ", rpta);
          //         if (rpta.procesoSwitch == 0){
          //             this.messageService.add({severity: 'success', detail: "Operación exitosa" });
          //             this.registerFormRegistro.get('idpersona')?.setValue(rpta.resultProceso);
          //             }else{
          //                 this.messageService.add({severity: 'error', detail: rpta.mensaje });
          //             }
          //     },
          //     error:(err)=>{
          //         console.error('error : ',err)
          //         this.messageService.clear();
          //         this.messageService.add({
          //             severity: 'error',
          //             summary: 'Error',
          //             detail: mensajesQuestion.msgErrorGenerico
          //         })
          //     },
          //     complete:() => {}
          //     });
      }
  }

  

 
}
