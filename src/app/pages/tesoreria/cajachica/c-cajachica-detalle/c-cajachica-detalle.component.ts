
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { TablaDetalle } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { TesoreriaService } from '../../service/tesoreriaServices';

@Component({
  selector: 'app-c-cajachica-detalle',
  templateUrl: './c-cajachica-detalle.component.html',
  styleUrls: ['./c-cajachica-detalle.component.scss']
})
export class CCajaChicaDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  registerFormRegistro: any= FormGroup;
  submitted = false;
  headerTitle: string = '';
  registerFormCliente: any = FormGroup;
  idCaja: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  verbtnGrabar: boolean = false;
  errorMensaje: string = "";
  lstTipoBanco: TablaDetalle[] = [];
  lstMonedas: any[] = [];

  lstTipoDocumento = [
    { name: 'RUC', code: 'RUC' }
];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,

    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    public dialogService: DialogService,
    private tesoreriaService: TesoreriaService,  
    private comprasService: ComprasService,    
    private proyectosService: ProyectosService,
  ) { }

  ngOnInit(): void {
    console.log('CCajaChicaDetalleComponent...',this.IA_data);
    this.idCaja = this.IA_data.idcodigo;

    this.createFrm();
    this.createFormRegistro();
    this.listaTipoBanco(); 
    this.listaMonedas();  
    
    if (this.idCaja > 0) {            
      this.traerUno();
    }
    this.mostrarBotones();  
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idcaja: [{ value: 0, disabled: false }],
      nomusuario: [{ value: '', disabled: false }],
      tipodoc: [{ value: null, disabled: false }],
      nrodoc: [{ value: null, disabled: false }],
      razonsocial: [{ value: null, disabled: false }],      
      fechacaja: [{ value: null, disabled: false }],
      motivo: [{ value: null, disabled: false }],
      monto: [{ value: null, disabled: false }],
      idmoneda: [{ value: null, disabled: false }],
      
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

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

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

    const $cargarOrdenC = this.tesoreriaService.traerunoBanco(this.idCaja)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.traerUno', rpta[0]);
            this.setSpinner(false);   

          this.registerFormRegistro.patchValue(rpta[0]); 
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
      idtipodoc:  this.registerFormRegistro.value.idtipodoc_banco,
    }

    console.log('guardarOC...', objeto);
    
    this.tesoreriaService.prcBanco(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idCaja === 0) {
            this.idCaja = rpta.resultProceso;  
            this.registerFormRegistro.get('idCaja').setValue(rpta.resultProceso); 
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

    if (!_error && (this.registerFormRegistro.value.idtipodoc_banco === '' || this.registerFormRegistro.value.idtipodoc_banco === null))
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