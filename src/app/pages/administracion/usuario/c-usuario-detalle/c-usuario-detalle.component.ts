import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, globalVariable, mensajesQuestion, respuestaProceso } from '@constantes';
import { Cliente, I_PersonaENT, I_RespuestaProceso, TablaDetalle } from '@interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { CModalVinculadoComponent } from '../modal-vinculado/c-modalvinculado.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CModalLaboralComponent } from '../modal-laboral/c-modallaboral.component';
import { AdministracionService } from '../../service/administracionServices';

@Component({
  selector: 'app-c-usuario-detalle',
  templateUrl: './c-usuario-detalle.component.html',
  styleUrls: ['./c-usuario-detalle.component.scss']
})
export class CUsuarioDetalleComponent implements OnInit, OnDestroy{
  $listSubcription: Subscription[] = [];
  @Input() IA_data: any;
  @Output() OB_back = new EventEmitter<any>();
  
  headerTitle: any;
  registerFormCliente: any = FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  personaNatural: boolean = false;
  idCliente: number = 0;
  lstTipoDocumento: TablaDetalle[] = []; 
  visibleDocument: boolean = true;
  lstRol:any[] = [];
  lstNacionalidad:any[] = [];
  lstTipoDocPer:any[] = [];
  lstEnti:any[] = [];
  lstSexo:any[] = [];
  lstEstadoCivil:any[] = [];
  lstTrabajo:any[] = [];
  lstTipoContrato : any[] = [];
  lstCargo : any[] = [];
  errorMensaje!: string;
  lstVinculados: any[] = [];
  lstDatosLaboral: any[] = [];
  listaVinculados: any[] = [];
  listaDatosLaboral: any[] = [];
  verAdjunto: boolean = false;
  dataAdjunto: any;

constructor(
  private messageService: MessageService,
   private confirmationService: ConfirmationService,
   private formBuilder: FormBuilder,
   private comprasService: ComprasService,
   private serviceSharedApp: SharedAppService,
   private serviceUtilitario: UtilitariosService,
       public dialogService: DialogService,
       private administracionService: AdministracionService,
) {
  this.comprasService.emitirEvento(0);
}

ngOnInit(): void {
  console.log('this.IA_data', this.IA_data);
      if (this.IA_data !== 0) {
        this.idCliente = this.IA_data.idcliente;
           
        this.dataAdjunto ={
          idCliente: this.idCliente,
          codtipoproc: 8,
          veracciones: 0
        }   
        this.verAdjunto = true;  
      }

    this.createFormCliente();
    this.cargarData();
    this.listaTipoDocumento();
    this.listarItemsTabla(); 
    this.listaNacionalidad();
    this.listaTipoDocumentoPersona();
    this.listaTipoEntidad();
    this.listaEstadoCivil();
    this.listaSexo();
}

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
  }

ngOnDestroy() {
  if (this.$listSubcription != undefined) {
    this.$listSubcription.forEach((sub) => sub.unsubscribe());
  }
}

get formCliente() { return this.registerFormCliente.controls; }

createFormCliente() {
  this.registerFormCliente = this.formBuilder.group({
  idrolpersona: [{ value: 'ADM', disabled: false }],
  tipopersona :  [{ value: 'N', disabled: false }],
  tipoalta : [{ value: 'NOR', disabled: false }],
  indnacionalidad: [{ value: null, disabled: false }],
  idpais: [{ value: 1, disabled: false }],
  idtipodoc: [{ value: null, disabled: false }],
  nrodocumento: [{ value: null, disabled: false }],
  appaterno: [{ value: null, disabled: false }],
  apmaterno: [{ value: null, disabled: false }],
  apcasada: [{ value: '...', disabled: false }],
  nombres: [{ value: null, disabled: false }],
  razonsocial: [{ value: '...', disabled: false }],
  nomcomercial: [{ value: '...', disabled: false }],
  direcresumen: [{ value: null, disabled: false }],
  telefresumen: [{ value: null, disabled: false }],
  email: ['', Validators.email],
  paginaweb: [{ value: '...', disabled: false }],
  facebook: [{ value: '...', disabled: false }],
  youtube: [{ value: '...', disabled: false }],
  indmigrado :  [{ value: false, disabled: false }],
  indestado:  [{ value: '1', disabled: false }],
  indvig :  [{ value: true, disabled: false }],
  idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
  idpersona: [{ value: this.idCliente, disabled: false }],
  tipoentidad: [{ value: 'P', disabled: false }],
  nroctadetraccion: [{ value: null, disabled: false }],

  adm_genero: [{ value: null, disabled: false }],
  adm_contacto_emergencia: [{ value: null, disabled: false }],
  adm_nrotelef_emergencia: [{ value: null, disabled: false }],
  adm_fechanacimiento: [{ value: null, disabled: false }],
  adm_estadocivil: [{ value: null, disabled: false }],
  fechainicio: [{ value: null, disabled: false }],
  fechafin: [{ value: null, disabled: false }],
  idtipotrabajo: [{ value: null, disabled: false }],
  idtipocontrato: [{ value: null, disabled: false }],
  idcargo: [{ value: null, disabled: false }],
  adm_email: ['', Validators.email],
  });
}

listaTipoDocumento() {
  let idtabla = 101;
  const $listaTipo = this.comprasService.obtenerTipoDocumento(idtabla).subscribe({
    next: (rpta: any) => {
      this.lstTipoDocumento = rpta;
    },
    error: (err) => {
      this.serviceSharedApp.messageToast()
    },
    complete: () => {
    },
  });
  this.$listSubcription.push($listaTipo);
}


cambioTipoDoc(dato: any) {
  if (dato == 'RUC') {
      //this.idtipodoc
  }else{
      //this.cliente.tipopersona == 'N';
  }
}

nroDoc() {
  console.log('nroDoc');
}

cargarData(){
  if (this.idCliente > 0) {
    this.visibleDocument = false;
    this.registerFormCliente.patchValue(this.IA_data);  
    this.cargarVinculado();
    this.cargarDatosLaborales();
  }
  
}

cargarVinculado(){
  const $listaVinculados =  this.administracionService.listaVinculados(this.idCliente).subscribe({
    next: (rpta: any) => {
        this.setSpinner(false);
        console.info('cargarVinculado : ', rpta);
        this.listaVinculados = rpta;
    },
    error: (err) => {
        this.setSpinner(false);
        console.info('error : ', err);
        this.messageService.clear();
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensajesQuestion.msgErrorGenerico,
        });
    },
    complete: () => {},
    });
    this.$listSubcription.push($listaVinculados);
}

cargarDatosLaborales(){
  const $listaDatosLaboral =  this.administracionService.listaDatosLaboral(this.idCliente).subscribe({
    next: (rpta: any) => {
        this.setSpinner(false);
        console.info('cargarDatosLaborales : ', rpta);
        this.listaDatosLaboral = rpta;
    },
    error: (err) => {
        this.setSpinner(false);
        console.info('error : ', err);
        this.messageService.clear();
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensajesQuestion.msgErrorGenerico,
        });
    },
    complete: () => {},
    });
    this.$listSubcription.push($listaDatosLaboral);
}

guardar() {
  if (this.validarDatos())
    {
        this.setSpinner(false);
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    let fechaNacimiento;
    fechaNacimiento = this.registerFormCliente.value.adm_fechanacimiento;
    if (this.idCliente > 0) {
      if (fechaNacimiento.toString().length === 10) {
        fechaNacimiento = new Date(this.serviceUtilitario.formatFecha(fechaNacimiento)); 
      }        
    }

  // this.cliente = this.registerFormCliente.getRawValue(); 
  // if (this.idCliente > 0) {
  //     this.cliente.idpersona = this.idCliente
  // }else{
  //     this.cliente.idpersona = 0;
  // }

  //console.log('guardar...', this.cliente);
  const objeto = {
    ...this.registerFormCliente.getRawValue(),
    adm_fechanacimiento: fechaNacimiento
  };
  

  //Verdadero si todos los campos están llenos
 
    this.setSpinner(true);
    this.mensajeSpinner="Guardando...!";
      console.log('objeto...', objeto);
     const $guardar = this.comprasService.prcPersona(objeto)
          .subscribe({
          next: (rpta:any) => {
            this.setSpinner(false);
              console.log("rpta prcClientes : ", rpta);
              if (rpta.procesoSwitch === 0){
                  this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                  this.visibleDocument = false;
                  //this.idCliente = rpta.resultProceso;
                  if (this.idCliente === 0) {
                    this.comprasService.emitirEvento(rpta.resultProceso);
                  }
                  
                  //this.OB_back.emit(this.IA_data);
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

listarItemsTabla() {
  this.comprasService.obtenerItemsTabla(115).subscribe({
      next: (rpta: any) => {
        let lista = rpta
        //this.lstRol = rpta;

        this.lstRol = lista.filter((x: { coditem: string; }) => x.coditem !== 'PRO');
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });

  }

  listaNacionalidad() {
      this.comprasService.obtenerItemsTabla(117).subscribe({
      next: (rpta: any) => {
        this.lstNacionalidad = rpta;

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

  listaTipoEntidad() {
    this.comprasService.obtenerItemsTabla(119).subscribe({
        next: (rpta: any) => {
          this.lstEnti = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

  listaEstadoCivil() {
    this.comprasService.obtenerItemsTabla(120).subscribe({
        next: (rpta: any) => {
          this.lstEstadoCivil = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

  listaSexo() {
    this.comprasService.obtenerItemsTabla(121).subscribe({
        next: (rpta: any) => {
          this.lstSexo = rpta;        
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormCliente.value);

    if (this.registerFormCliente.value.nombres === '' || this.registerFormCliente.value.nombres === null)
      {
          this.errorMensaje="Ingresar Nombres...!";
          _error = true;
      }

    if (!_error && (this.registerFormCliente.value.appaterno === null ||this.registerFormCliente.value.appaterno ==='' ))
    {
        this.errorMensaje="Ingresar Apellido Paterno...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.apmaterno === null || this.registerFormCliente.value.apmaterno === ''))
    {
        this.errorMensaje="Ingresar Apellido Materno...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.indnacionalidad === '' || this.registerFormCliente.value.indnacionalidad === null))
      {
          this.errorMensaje="Seleccionar Nacionalidad...!";
          _error = true;
      }

    if (!_error && (this.registerFormCliente.value.idtipodoc === '' || this.registerFormCliente.value.idtipodoc === null))
    {
        this.errorMensaje="Seleccionar Tipo de Documento...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.nrodocumento === '' || this.registerFormCliente.value.nrodocumento === null))
    {
        this.errorMensaje="Ingresar Serie de Documento...!";
        _error = true;
    }    
  
    if (!_error && (this.registerFormCliente.value.adm_fechanacimiento === '' || this.registerFormCliente.value.adm_fechanacimiento === null))
    {
        this.errorMensaje="Ingresar Fecha Nacimiento...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.adm_estadocivil === '' || this.registerFormCliente.value.adm_estadocivil === null))
    {
        this.errorMensaje="Seleccionar Estado Civil...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.adm_genero === '' || this.registerFormCliente.value.adm_genero === null))
    {
        this.errorMensaje="Seleccionar Sexo...!";
        _error = true;
    }

    if (!_error && (this.registerFormCliente.value.telefresumen === null || this.registerFormCliente.value.telefresumen === ''))
    {
          this.errorMensaje="Ingresar Número Celular...!";
          _error = true;
    }

    if (!_error && (this.registerFormCliente.value.direcresumen === null || this.registerFormCliente.value.direcresumen === ''))
    {
          this.errorMensaje="Ingresar Dirección...!";
          _error = true;
    }

    if (!_error && (this.registerFormCliente.value.email === null || this.registerFormCliente.value.email === ''))
    {
          this.errorMensaje="Ingresar Correo Empresa...!";
          _error = true;
    }   

    if (!_error && (this.registerFormCliente.value.adm_email === null || this.registerFormCliente.value.adm_email === ''))
    {
          this.errorMensaje="Ingresar Correo Personal...!";
          _error = true;
    }         

    return _error;
    }

  agregarVinculado(data: any) {
    data.idcliente = this.idCliente;    
    const refItem = this.dialogService.open(CModalVinculadoComponent, {      
      data: data,
      header: data.length == 0 ? "Agregar Vinculado" : "Editar Vinculado - " + data.nombres,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      this.cargarVinculado();
      console.log('onClose',rpta);
    });
  }

  eliminarVinculado(data: any){
    const objeto ={
      idvinculado: data.idvinculado,
      idusuario: constantesLocalStorage.idusuario
    }
    const $guardar = this.administracionService.delVinculado(objeto).subscribe({
      next: (rpta:any) => {
        this.setSpinner(false);
        
          if (rpta.procesoSwitch === 0){
              this.messageService.add({severity: 'success', detail: "Operación exitosa" });
              this.cargarVinculado();
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

  agregarLaboral(data: any) {
    data.idcliente = this.idCliente;  
    // if (this.listaDatosLaboral.length > 0 && tipo === 0) {
    //   this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Solo se puede Agregar un Dato Laboral...!' });
    //     return;
    // }
    const refItem = this.dialogService.open(CModalLaboralComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Datos Laborales" : "Editar Datos Laborales",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      this.cargarDatosLaborales();
      console.log('onClose',rpta);
     
    });
  }

  eliminarLaboral(data: any){
    const objeto ={
      idlaboral: data.idlaboral,
      idusuario: constantesLocalStorage.idusuario
    }
    const $guardar = this.administracionService.delDatosLaborales(objeto).subscribe({
      next: (rpta:any) => {
        this.setSpinner(false);
        
          if (rpta.procesoSwitch === 0){
              this.messageService.add({severity: 'success', detail: "Operación exitosa" });
              this.cargarDatosLaborales();
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
}