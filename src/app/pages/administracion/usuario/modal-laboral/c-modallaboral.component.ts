import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { AdministracionService } from '../../service/administracionServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
@Component({
  selector: 'app-c-modallaboral',
  templateUrl: './c-modallaboral.component.html'
})
export class CModalLaboralComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerForm!: FormGroup;
    lstProveedores: any[]=[];
    lstMonedas: any[]=[];
    errorMensaje: string = "";
    lstTipoTrabajo: any[]=[];
    lstTipoContra: any[]=[];
    lstEstadoLab: any[]=[];
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
    this.listaTipoTrabajo();
    this.listaTipoContrato();
    this.listaEstadoLab();
    if (this.param.idlaboral > 0) {
      this.registerForm.patchValue(this.param);
      this.registerForm.get('fecinilaboral')?.setValue(new Date(this.param.fecinilaboral));
      this.registerForm.get('fecfinlaboral')?.setValue(new Date(this.param.fecfinlaboral));
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
        idlaboral: [{ value: 0, disabled: false }],
        idpersona : [{ value: this.param.idcliente, disabled: false }],
        cargo: [{ value: null, disabled: false }],
        fecinilaboral: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
        fecfinlaboral: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
        codtipotrabajador: [{ value: null, disabled: false }],
        codtipocontrato: [{ value: null, disabled: false }],
        estado: [{ value: null, disabled: false }],
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
        fecinilaboral : new Date( this.registerForm.value.fecinilaboral ),
        fecfinlaboral : new Date( this.registerForm.value.fecfinlaboral ),
      };  
      console.log('objeto...', objeto);
      const $guardar = this.administracionService.prcDatosLaborales(objeto).subscribe({
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

    if (this.registerForm.value.cargo === '' || this.registerForm.value.cargo === null)
    {
        this.errorMensaje="Ingresar Cargo ...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.codtipotrabajador === null || this.registerForm.value.codtipotrabajador ===''))
    {
        this.errorMensaje="Seleccionar Tipo Trabajador...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.codtipocontrato === null || this.registerForm.value.codtipocontrato ===''))
    {
        this.errorMensaje="Seleccionar Tipo Contrato...!";
        _error = true;
    }

    if (!_error && this.registerForm.value.fecinilaboral === null || this.registerForm.value.fecinilaboral === '')
    {
          this.errorMensaje="Ingresar Fecha Inicio ...!";
          _error = true;
    }

    if (!_error && this.registerForm.value.fecfinlaboral === null || this.registerForm.value.fecfinlaboral === '')
    {
          this.errorMensaje="Ingresar Fecha Final ...!";
          _error = true;
    } 

    if (!_error && (this.registerForm.value.estado === null || this.registerForm.value.estado ===''))
      {
          this.errorMensaje="Seleccionar Estado...!";
          _error = true;
      }
       

    return _error;
    }

  listaTipoTrabajo() {
    const $const = this.comprasService.obtenerItemsTabla(122).subscribe({
        next: (rpta: any) => {
          this.lstTipoTrabajo = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });  
    this.$listSubcription.push($const);
  }

  listaTipoContrato() {
    const $const = this.comprasService.obtenerItemsTabla(123).subscribe({
        next: (rpta: any) => {
          this.lstTipoContra = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });  
    this.$listSubcription.push($const);
  }

  listaEstadoLab() {
    const $const = this.administracionService.listaEstadoLab().subscribe({
        next: (rpta: any) => {
          this.lstEstadoLab = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });  
    this.$listSubcription.push($const);
  }
}
