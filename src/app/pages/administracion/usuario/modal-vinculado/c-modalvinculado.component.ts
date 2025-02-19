import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { AdministracionService } from '../../service/administracionServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
@Component({
  selector: 'app-c-modalvinculado',
  templateUrl: './c-modalvinculado.component.html'
})
export class CModalVinculadoComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerForm!: FormGroup;
    lstProveedores: any[]=[];
    lstMonedas: any[]=[];
    errorMensaje: string = "";
     lstTipoDocPer: any[]=[];
    lstTipoVin: any[]=[];
    blockedDocument: boolean = false;
  mensajeSpinner: string = "";

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private comprasService: ComprasService,
    private administracionService: AdministracionService,
    private serviceUtilitario: UtilitariosService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param ...', this.param);
    this.createForm();
    this.listaTipoVinculo();
    this.listaTipoDocumentoPersona();
   
    if (this.param.idvinculado > 0) {
      this.registerForm.patchValue(this.param);
      this.registerForm.get('fechanacimiento')?.setValue(new Date(this.param.fechanacimiento));
    }
        
    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }

  createForm() {
    //Agregar validaciones de formulario
    this.registerForm = this.formBuilder.group({
        idvinculado: [{ value: 0, disabled: false }],
        idpersona : [{ value: this.param.idcliente, disabled: false }],
        nombres: [{ value: null, disabled: false }],
        appaterno: [{ value: null, disabled: false }],
        apmaterno: [{ value: null, disabled: false }],
        fechanacimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
        codtipovinculado: [{ value: null, disabled: false }],
        idtipodoc: [{ value: null, disabled: false }],
        nrodocumento: [{ value: null, disabled: false }],
        indvig: [{ value: true, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    });
}

  guardar() {       
    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

      this.setSpinner(true);
      this.mensajeSpinner="Guardando...!";

      
    const objeto = {
      ...this.registerForm.getRawValue(),
      fechanacimiento : new Date( this.registerForm.value.fechanacimiento)
    };  
    console.log('objeto...', objeto);
    const $guardar = this.administracionService.prcVinculado(objeto).subscribe({
      next: (rpta:any) => {
        this.setSpinner(false);
          console.log("rpta prcClientes : ", rpta);
          if (rpta.procesoSwitch === 0){
              this.messageService.add({severity: 'success', detail: "Operación exitosa" });
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
      complete:() => {
        this.setSpinner(false);
      }
      });
      this.$listSubcription.push($guardar);
         
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
    console.log('this.formValue...', this.registerForm.value);

    if (this.registerForm.value.nombres === '' || this.registerForm.value.nombres === null)
    {
        this.errorMensaje="Ingresar Nombres...!";
        _error = true;
    }

    if (this.registerForm.value.appaterno === '' || this.registerForm.value.appaterno === null)
    {
        this.errorMensaje="Ingresar Paterno ...!";
        _error = true;
    }

    if (this.registerForm.value.apmaterno === '' || this.registerForm.value.apmaterno === null)
    {
        this.errorMensaje="Ingresar Materno ...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.fechanacimiento === null || this.registerForm.value.fechanacimiento ===''))
    {
        this.errorMensaje="Ingresar Fecha Nacimiento...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.idtipodoc === null || this.registerForm.value.idtipodoc ===''))
    {
        this.errorMensaje="Seleccionar Tipo Documento...!";
        _error = true;
    }

    if (!_error && this.registerForm.value.nrodocumento === null || this.registerForm.value.nrodocumento === '')
    {
          this.errorMensaje="Ingresar Nro Documento...!";
          _error = true;
    }

    if (!_error && this.registerForm.value.codtipovinculado === null || this.registerForm.value.codtipovinculado === '')
    {
          this.errorMensaje="Seleccionar Tipo Vinculado...!";
          _error = true;
    } 

    
       

    return _error;
    }
 
  listaTipoVinculo() {
    this.comprasService.obtenerItemsTabla(124).subscribe({
        next: (rpta: any) => {
          this.lstTipoVin = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });  
  }

  listaTipoDocumentoPersona() {
    this.comprasService.obtenerItemsTabla(118).subscribe({
        next: (rpta: any) => {
          console.info('listaTipoDocumentoPersona : ', rpta);
          this.lstTipoDocPer = rpta.filter((x: { coditem: string; }) => x.coditem != 'RUC');
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });

    }
}
