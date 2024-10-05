
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../../service/almacenServices';

@Component({
  selector: 'app-c-oficina-detalle',
  templateUrl: './c-oficina-detalle.component.html',
  styleUrls: ['./c-oficina-detalle.component.scss']
})
export class COficinaDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  registerFormRegistro!: FormGroup;
  submitted = false;
  headerTitle: string = '';
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;  
  onlyRead: boolean = false;
  errorMensaje: string = "";
  idOficina: any;
  param:any;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    public dialogService: DialogService,
    private almacenService: AlmacenService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    console.log('this.config', this.config);
    this.idOficina = this.config.data.idcodigo;
    this.param = this.config.data.paramReg;
    this.createFormRegistro(); 
    
    if (this.idOficina > 0) {      
      this.traerUno();
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idofi: [{ value: this.idOficina, disabled: false }],
      nomofi: [{ value: '', disabled: false }],
      dirofi: [{ value: '', disabled: false }],
      estado: [{ value: 'A', disabled: false }],
      codUsuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    });
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';

    const $cargarOrdenC = this.almacenService.oficinaTraeruno(this.idOficina)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta', rpta);
            this.setSpinner(false);
            this.registerFormRegistro.patchValue(rpta);                
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
          
        }
      });
    this.$listSubcription.push($cargarOrdenC)
  }

  guardar(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';

  

    console.log('guardarOficina...', this.registerFormRegistro.getRawValue());
    
    this.almacenService.grabarOficina(this.registerFormRegistro.getRawValue()).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idOficina === 0) {
            this.idOficina = rpta.resultProceso;   

          }
          this.cerrar();
          //this.traerUno();
         
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
      },
      error: (err) => {
        this.setSpinner(false);
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
  }
 
  cerrar() {    
    this.refDatoItem.close();
  }
  

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);      

      if (!_error && (this.registerFormRegistro.value.nomofi === '' || this.registerFormRegistro.value.nomofi === null) )
      {
          this.errorMensaje="Ingresar Nombre de Oficina...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.dirofi === '' || this.registerFormRegistro.value.dirofi === null) )
        {
            this.errorMensaje="Ingresar Dirección de Oficina...!";
            _error = true;
        }

       return _error;
     }


}