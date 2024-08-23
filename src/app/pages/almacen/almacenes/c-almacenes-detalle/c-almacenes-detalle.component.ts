
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
  selector: 'app-c-almacenes-detalle',
  templateUrl: './c-almacenes-detalle.component.html',
  styleUrls: ['./c-almacenes-detalle.component.scss']
})
export class CAlmacenesDetalleComponent implements OnInit, OnDestroy{
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
  idAlmacen: any;
  param:any;
  lstOficina = [
    { nomoficina: 'TODOS', idofi: 0 },
    { nomoficina: 'OFICINA 401', idofi: 1 },
    { nomoficina: 'OFICINA 402', idofi: 2 },
    { nomoficina: 'OFICINA 403', idofi: 3 }
  ];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private almacenService: AlmacenService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    console.log('this.config', this.config);
    this.idAlmacen = this.config.data.idcodigo;
    this.param = this.config.data.paramReg;
    this.createFormRegistro(); 
    
    if (this.idAlmacen > 0) {      
      this.traerUno();
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idalmacen: [{ value: 0, disabled: true }],
      idofi: [{ value: 0, disabled: false }],
      nomalmacen: [{ value: '', disabled: false }],
      diralmacen: [{ value: '', disabled: false }],
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

    const $cargarOrdenC = this.almacenService.almacenTraeruno(this.idAlmacen)
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

  

    console.log('guardarOC...', this.registerFormRegistro.getRawValue());
    
    this.almacenService.GrabarAlamcen(this.registerFormRegistro.getRawValue()).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idAlmacen === 0) {
            this.idAlmacen = rpta.resultProceso;   

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

      if (this.registerFormRegistro.value.idofi === 0)
      {
          this.errorMensaje="Seleccionar Oficina...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.nomalmacen === '' || this.registerFormRegistro.value.nomalmacen === null) )
      {
          this.errorMensaje="Ingresar Nombre de Almacen...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.diralmacen === '' || this.registerFormRegistro.value.diralmacen === null) )
        {
            this.errorMensaje="Ingresar Dirección de Almacen...!";
            _error = true;
        }

       return _error;
     }


}
