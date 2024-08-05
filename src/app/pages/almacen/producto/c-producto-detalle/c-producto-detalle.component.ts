
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenService } from '../../service/almacenServices';

@Component({
  selector: 'app-c-producto-detalle',
  templateUrl: './c-producto-detalle.component.html',
  styleUrls: ['./c-producto-detalle.component.scss']
})
export class CProductoDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  registerFormRegistro: any= FormGroup;
  headerTitle: string = '';
  idprod: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  errorMensaje: string = "";
  lstAlmacen:any;
  lstOrdenC:any;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private almacenService: AlmacenService, 
  ) { }

  ngOnInit(): void {
    this.idprod = this.IA_data.idcodigo;

    this.createFormRegistro();
    this.ListarAlamcen();   
    
    if (this.idprod > 0) {     
      this.traerUno();
    }else{    
      this.mostrarBotones('NVO');
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idprod: [{ value: this.idprod, disabled: true }],
      codproducto: [{ value: '', disabled: false }],
      tippro_g101: [{ value: 0, disabled: false }],
      tipmat_g102: [{ value: 0, disabled: false }],
      tipmod_g103: [{ value: 0, disabled: false }],
      tipcolor_g104: [{ value: 0, disabled: false }],
      despro:[{ value: '', disabled: false }],
      desdet:[{ value: '', disabled: false }],
      valorunit:[{ value: '', disabled: false }],
      preciovenmax:[{ value: 0, disabled: false }],
      preciovenmin:[{ value: 0, disabled: false }],
      fecactivo: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      estado:[{ value: '', disabled: false }],
      feccrea: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      idusucrea: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      fecmodi: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      idusumodi: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      indprocesado:[{ value: '', disabled: false }],
      tabidfamilia:[{ value: '', disabled: false }],
      tabidsubfamilia: [{ value: '', disabled: true }],
      codigo1: [{ value: '', disabled: false }],
      codigo2: [{ value: '', disabled: false }],
      codigo_ori: [{ value: '', disabled: false }],
      indmigrado: [{ value: 0, disabled: false }],
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

  mostrarBotones(data:any){
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'REG':
      case 'OBS':
        this.verbtnGrabar = true;
        this.onlyRead = false;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.onlyRead = false;
      break;
      case 'PRC':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
      case 'REC':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
    
      default:
        break;
    }

   
    
  }

  traerUno(){
    // this.setSpinner(true);
    // this.mensajeSpinner = 'Cargando...!';
    // const objeto ={
    //   idordencompra: this.idprod,
    //   idusuario: constantesLocalStorage.idusuario
    // }

    // const $cargarOrdenC = this.almacenService.ordenCompraTraeruno(objeto)
    //   .subscribe({
    //     next: (rpta:any) => {
    //       console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
    //         this.setSpinner(false);
            

    //       this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
    //       this.cargarMenu(rpta.ordencompra[0].acciones);
    //       this.mostrarBotones(rpta.ordencompra[0].estado);                
    //     },
    //     error:(err)=>{
    //         this.setSpinner(false);
    //         this.serviceSharedApp.messageToast()
    //     },
    //     complete:() => {
    //       this.setSpinner(false);
          
    //     }
    //   });
    // this.$listSubcription.push($cargarOrdenC)
  }

  guardar(){

//     if (this.validarDatos())
//       {
//           this.setSpinner(false);
//           this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
//           return;
//       }

//     this.setSpinner(true);
//     this.mensajeSpinner = 'Guardando...!';
//     let fechaingreso;
//     let fecentrega;
//     fechaingreso = this.registerFormRegistro.value.fechaingreso;
//     fecentrega = this.registerFormRegistro.value.fecentrega;

//     if (this.idprod > 0) {
//       fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));   
//       fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega));    
//     }

//     for (let i = 0; i < this.lstItemOC.length; i++) {      
//       if (this.lstItemOC[i].cantidad.toString() === '') {
//         this.lstItemOC[i].cantidad = 0;
//       }    
//       if (this.lstItemOC[i].preciocosto.toString() === '') {
//         this.lstItemOC[i].preciocosto = 0;
//       }
//     }

//     const objeto = {
//       ...this.registerFormRegistro.getRawValue(),
//       items: this.lstItemOC,
//       fechaingreso,
//       fecentrega,
//       quotes: this.lstQuotes
//     }

//     console.log('guardarOC...', objeto);
    
//     this.almacenService.ordenCompraprc(objeto).subscribe({
//       next: (rpta: any) => {
//         this.setSpinner(false);
//         if (rpta.procesoSwitch === 0){
//           this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
//           if (this.idprod === 0) {
//             this.idprod = rpta.resultProceso;  
//             this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);
//             this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);  

//             this.dataAdjunto ={
//               idCliente: this.idprod,
//               codtipoproc: 7,
//               veracciones: 0
//             }   
//             this.verAdjunto = true; 

//             //preguntar si desea agregar adjuntos
//             this.confirmationService.confirm({
//               key: 'confirm1',
//               header: 'Confirmación',
//               message:  '¿Desea Agregar Adjuntos ',
//               accept: () => {
//                 this.activeIndex = 2;
//               }
//           });
//           }
//           this.traerUnoOrdenC();
         
//         this.visibleDocument = false;
//         }else{
//         this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
//         }
//       },
//       error: (err) => {
//         this.setSpinner(false);
//       this.messageService.clear();
//       this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: mensajesQuestion.msgErrorGenerico,
//           });
//       },
//       complete: () => {
//       },
//   });
  }

//   servicioGenerico(){    
//     this.comprasService.obtenerItemsTabla(109).subscribe({
//       next: (rpta: any) => {
//         console.info('servicioGenerico : ', rpta);
//         let _terminosdepago = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
//         this.registerFormRegistro.get('terminosdepago').setValue(_terminosdepago[0].valoritem);
//       },
//       error: (err) => {
//       console.info('error : ', err);
//       this.serviceSharedApp.messageToast()
//       },
//       complete: () => {
//       },
//   });
//   }

//   listarItemsTabla() {
//     this.comprasService.obtenerItemsTabla(104).subscribe({
//         next: (rpta: any) => {
//           console.info('listarItemsTabla : ', rpta);
//             this.lstTermino = rpta;
//         },
//         error: (err) => {
//         console.info('error : ', err);
//         this.serviceSharedApp.messageToast()
//         },
//         complete: () => {
//         },
//     });
  
//     }
 

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

      if (this.registerFormRegistro.value.idalmacen === null || this.registerFormRegistro.value.idalmacen === 0)
      {
          this.errorMensaje="Seleccionar Almacen...!";
          _error = true;
      }

      if (!_error && this.registerFormRegistro.value.idproveedor === null)
      {
          this.errorMensaje="Seleccionar Proveedor...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.alm_idordencompra === 0 || this.registerFormRegistro.value.alm_idordencompra === null))
      {
          this.errorMensaje="Seleccionar Orden Compra...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.codtipodoc === 'REQ' && this.registerFormRegistro.value.sustentodoc === '') )
      {
          this.errorMensaje="Ingresar N° de Referencia...!";
          _error = true;
      }

      if (!_error && this.registerFormRegistro.value.idmoneda === null)
      {
            this.errorMensaje="Seleccionar Moneda...!";
            _error = true;
      }

      if (!_error && this.registerFormRegistro.value.codformapago === null)
      {
            this.errorMensaje="Seleccionar Termino de Pago...!";
            _error = true;
      }

      // if (!_error && (this.registerFormRegistro.value.condicionescomerciales === " " || this.registerFormRegistro.value.condicionescomerciales === null))
      // {
      //     this.errorMensaje="Ingresar Condiciones Comerciales...!";
      //     _error = true;
      // }
       return _error;
     }
     
     ListarAlamcen(){
    //   const objeto = {
    //     idalmacen:0,
    //     idofi: 0
    //   }
    //   const $getListar = this.almacenService.ListarAlamcen(objeto)
    //     .subscribe({
    //       next: (rpta:any) => {
    //           console.log('rpta lstAlmacen', rpta);
    //           this.lstAlmacen = rpta
    //       },
    //       error:(err)=>{
    //           this.serviceSharedApp.messageToast()
    //       },
    //       complete:() => {
    //       }
    //     });
    //   this.$listSubcription.push($getListar)
    }

}
