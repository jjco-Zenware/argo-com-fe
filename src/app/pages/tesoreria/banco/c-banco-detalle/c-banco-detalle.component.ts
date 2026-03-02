
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { TablaDetalle } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-banco-detalle',
  templateUrl: './c-banco-detalle.component.html',
  styleUrls: ['./c-banco-detalle.component.scss']
})
export class CBancoDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  registerFormRegistro: any= FormGroup;
  submitted = false;
  headerTitle: string = '';
  registerFormCliente: any = FormGroup;
  idBanco: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  verbtnGrabar: boolean = false;
  errorMensaje: string = "";
  lstTipoBanco: TablaDetalle[] = [];
  lstCtaCtble: any;

  lstTipoDocumento = [
    { name: 'RUC', code: 'RUC' }
];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private tesoreriaService: TesoreriaService,  
    private comprasService: ComprasService, 
    private contabilidadService: ContabilidadService,   
  ) { }

  ngOnInit(): void {
    this.idBanco = this.IA_data.idcodigo;

    this.createFrm();
    this.createFormRegistro();
    this.listaTipoBanco(); 
    this.listarPlanContable();
    
    if (this.idBanco > 0) {            
      this.traerUno();
    }
    this.mostrarBotones();  
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idrolpersona: [{ value: 'AMB', disabled: false }],
      tipopersona :  [{ value: 'J', disabled: false }],
      tipoalta : [{ value: 'NOR', disabled: false }],
      indnacionalidad: [{ value: '1', disabled: false }],
      idpais: [{ value: '1', disabled: false }],
      idtipodoc: [{ value: null, disabled: false }],
      nrodocumento: [{ value: null, disabled: false }],
      appaterno: [{ value: '', disabled: false }],
      apmaterno: [{ value: '', disabled: false }],
      apcasada: [{ value: '', disabled: false }],
      nombres: [{ value: '', disabled: false }],
      razonsocial: [{ value: null, disabled: false }, [Validators.required]],
      nomcomercial: [{ value: null, disabled: false }],
      direcresumen: [{ value: null, disabled: false }],
      telefresumen: [{ value: null, disabled: false }],
      email: [{ value: null, disabled: false }],
      paginaweb: [{ value: null, disabled: false }],
      facebook: [{ value: null, disabled: false }],
      youtube: [{ value: null, disabled: false }],
      indmigrado :  [{ value: false, disabled: false }],
      indestado:  [{ value: '1', disabled: false }],
      indvig :  [{ value: true, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idpersona: [{ value: 0, disabled: false }],
      tipoentidad: [{ value: 'P', disabled: false }, [Validators.required]],
      
      idbanco:[{ value: 0, disabled: true }],
      tipobanco: [{ value: null, disabled: false }, [Validators.required]],
      nrodoc: [{ value: '', disabled: false }, [Validators.required]],
      codigobcr:[{ value: '', disabled: false }],
      codbancosbs:[{ value: '', disabled: false }],
      codbancosunat:[{ value: '', disabled: false }],
      codctactble:[{ value: '', disabled: false }, [Validators.required]],
    });
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatosCab = this.fb.group({
      idcotiza: [{ value: 0, disabled: true }],
      fechaingreso: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  listarPlanContable() {
    const $listarPlanContable = this.contabilidadService
        .listarPlanContable()
        .subscribe({
            next: (rpta: any) => {
                console.log('listarPlanContable...', rpta);
                this.setSpinner(false);
                this.lstCtaCtble = rpta;
            },
            error: (err) => {
                this.setSpinner(false);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
    this.$listSubcription.push($listarPlanContable);
  }

  listaTipoBanco() {
    let idtabla = 110;
    const $listaTipo = this.comprasService.obtenerTipoDocumento(idtabla).subscribe({
      next: (rpta: any) => {
        this.lstTipoBanco = rpta;
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaTipo);
  }

  mostrarBotones(){
    console.log('mostrarBotones', this.IA_data.paramReg);
    // switch (data) {      
    //   case 'NVO':
    //     this.verbtnGrabar = true;
    //     this.onlyRead = false;
    //   break;
    // }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar  = false;
      this.onlyRead = true;
    }else{
      this.verbtnGrabar = true;
        this.onlyRead = false;
    }
    
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';     

    const $cargarOrdenC = this.tesoreriaService.traerunoBanco(this.idBanco)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.traerUno', rpta[0]);
            this.setSpinner(false);   

          this.registerFormRegistro.patchValue(rpta[0]); 
          this.registerFormRegistro.get('tipobanco').setValue(parseInt(rpta[0].tipobanco));
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
          this.messageService.add({severity: 'warn', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
   
    
    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      nrodocumento: this.registerFormRegistro.value.nrodoc,
      tipobanco: this.registerFormRegistro.value.tipobanco.toString(),
      idtipodoc:  this.registerFormRegistro.value.idtipodoc,
    }

    console.log('guardarOC...', objeto);
    
    this.tesoreriaService.prcBanco(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idBanco === 0) {
            this.idBanco = rpta.resultProceso;  
            this.registerFormRegistro.get('idbanco').setValue(rpta.resultProceso); 
          }
          this.traerUno();
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


  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (this.registerFormRegistro.value.razonsocial === " " || this.registerFormRegistro.value.razonsocial === null)
      {
          this.errorMensaje="Ingresar Banco...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.tipobanco === '' || this.registerFormRegistro.value.tipobanco === null))
      {
          this.errorMensaje="Seleccionar Tipo de Banco...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.idtipodoc === '' || this.registerFormRegistro.value.idtipodoc === null))
      {
          this.errorMensaje="Seleccionar Tipo de Documento...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.nrodoc === '' || this.registerFormRegistro.value.nrodoc === null))
      {
          this.errorMensaje="Ingresar N° de Documento...!";
          _error = true;
      }  

    if (!_error && (this.registerFormRegistro.value.codctactble === '' || this.registerFormRegistro.value.codctactble === null))
      {
          this.errorMensaje="Ingresar N° de Cuenta...!";
          _error = true;
      } 

       return _error;
     }
     
   

  

}