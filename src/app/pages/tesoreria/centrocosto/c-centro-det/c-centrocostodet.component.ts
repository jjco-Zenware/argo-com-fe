import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, globalVariable, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';

@Component({
  selector: 'app-c-centrocosto-det',
  templateUrl: './c-centrocostodet.component.html',
  styleUrls: ['./c-centrocostodet.component.scss']
})

export class CCentroCostoDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  registerFormRegistro!: FormGroup;
  lstTipocuenta: any;
  headerTitle!: string;
  errorMensaje: string = "";
  IdCentroCosto: number = 0;

  constructor(
      private fb: FormBuilder,
      public refDatoItem: DynamicDialogRef,
      public config: DynamicDialogConfig,
      public dialogService: DialogService  , 
      private serviceSharedApp: SharedAppService,
      private messageService: MessageService,
      private tesoreriaService: TesoreriaService, 
    ){    
      
  }

  ngOnInit(): void{
    this.createFrm();
    console.log('mostrarBotones', this.IA_data);
    this.IdCentroCosto = this.IA_data.idcentrocosto;
    this.mostrarRegistro();
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFrm(){
      this.registerFormRegistro = this.fb.group({          
        idcentrocosto: [{ value: this.IdCentroCosto, disabled: true }],
        codcentrocosto: [{ value: '', disabled: false }],
        descentrocosto: [{ value: '', disabled: false }],
      })
    }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  mostrarRegistro(){
    let _idcentrocosto = this.IA_data.idcentrocosto;
    if (_idcentrocosto > 0) {
      this.registerFormRegistro.patchValue(this.IA_data);
    }
  }
  
  guardarCentroCosto() {
    
    if (this.validarDatos())
        {
            this.setSpinner(false);
            this.messageService.add({severity: 'warn', summary: 'Aviso', detail: this.errorMensaje });
            return;
        }
  
      this.setSpinner(true);
      this.mensajeSpinner = 'Guardando...!';

    const objeto = {
      ...this.registerFormRegistro.value,
      idcentrocosto : this.IdCentroCosto,
      indvig:true,
    }
    console.log('this.objeto...', objeto);
       
      const $listaTipo = this.tesoreriaService.prcCentroCosto(objeto).subscribe({
        next: (rpta: any) => {
          console.log('guardarCuenta...', rpta);
          this.setSpinner(false);
          if (rpta.procesoSwitch === 0){
            this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
           }else{
            this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
           }
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
      });
      this.$listSubcription.push($listaTipo);        
  }
  
  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (this.registerFormRegistro.value.codcentrocosto === '' || this.registerFormRegistro.value.codcentrocosto === null)
      {
          this.errorMensaje="Ingresar Código...!";
          _error = true;
      }  

    if (!_error && (this.registerFormRegistro.value.descentrocosto === '' || this.registerFormRegistro.value.descentrocosto === null))
      {
          this.errorMensaje="Ingresar Descripción...!";
          _error = true;
      } 

       return _error;
     }
}
