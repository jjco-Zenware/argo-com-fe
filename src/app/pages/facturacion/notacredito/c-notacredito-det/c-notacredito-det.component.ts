
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-notacredito-det',
  templateUrl: './c-notacredito-det.component.html',
  styleUrls: ['./c-notacredito-det.component.scss']
})
export class CNotaCreditoDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  visibleAsiento: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any= FormGroup;
  registerFormCuota!: FormGroup;
  idtipoproyecto: any;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  submitted = false;
  headerTitle: string = '';
  lstMonedas: Moneda[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  montoTotal: number = 0;
  lstContacto: any;
  lstOrigen: any;
  idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnPreliminar: boolean = false;
  verbtnOrden: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  verCotizacion: boolean = true;
  lstTermino: any;
  verAdjunto: boolean = false;
  contactoVisible: boolean = false;
  itemVisible: boolean = false;
  idtipoprod: any;
  lstTipoProducto:any;
  onlyRead: boolean = false;
  //verReferencia: boolean = false;
  verProyecto: boolean = true;
  lstUnidades:any;
  errorMensaje: string = "";
  lstComprobante:any;
  listaCuotas:any[]=[]; 
  Cuotas:any;
  lstAsientos:any[]=[];
  lstCuotas = [
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '4', code: 4 },
    { name: '5', code: 5 }
  ];
  cuotaVisible?: boolean;
  lstCentroCosto: any;
  nrocuotas!:number;
  s_monto!: number;
  s_igv!: number;
  lstSunatTrans:any[]=[];
  lstTipoNota:any[]=[];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private ordencompraService: OrdencompraService,
    private comprasService: ComprasService,
    private contabilidadService: ContabilidadService,
  ) { }

  ngOnInit(): void {
    this.idOrdenC = this.IA_data.idordencompra;

    this.createFormRegistro();
    this.listaProyectoTipo();
    this.listaClientes();
    this.listaMonedas();  
    this.listarItemsTabla(); 
    this.listarItemsTablaUnidad() ;
    this.listarItemsTablaComprobante();
    this.listarCentroCosto();
    this.listarItemsTablaSunat();
    this.listarItemsTablaTipoNota();
    
    if (this.idOrdenC > 0) {   
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 8, //adjuntos compras
          veracciones: 1
        }
      }  else{
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 8,
          veracciones: 0
        }
      }  
      this.verAdjunto = true;      
      this.traerUno();
    }else{
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 8,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
    }   
  }

createFormRegistro() {
  //Agregar validaciones de formulario
  this.registerFormRegistro = this.formBuilder.group({
    idproyecto: [{ value: 0, disabled: false }],
    idtipoproyecto: [{ value: 0, disabled: false }],
    idtipodocprc: [{ value: 19, disabled: false }],
    idoportunidad: [{ value: 0, disabled: false }],
    sustentodoc: [{ value: '', disabled: false }],
    idrequerimiento: [{ value: 0, disabled: false }],
    iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    nrodocumentoadd:[{ value: '', disabled: false }],
    fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaFormateadoDMA(), disabled: false, }],
    idordencompra: [{ value: this.idOrdenC, disabled: false }],
    condicionescomerciales: [{ value: '', disabled: false }],
    idproveedor: [{ value: '', disabled: false }],
    idmoneda: [{ value: '', disabled: false }],
    //idorigen: [{ value: this.IA_data, disabled: false }],
    idcontacto: [{ value: 0, disabled: false }],
    codtipodoc: [{ value: '', disabled: false }],
    tiempoentrega: [{ value: 0, disabled: false }],
    codformapago: [{ value: 118, disabled: false }],
    validezoferta: [{ value: 0, disabled: false }],
    lugarentrega: [{ value: '', disabled: false }],
    garantia: [{ value: 0, disabled: false }],
    servicionombre: [{ value: '', disabled: false }],
    ref01: [{ value: '', disabled: false }],
    ref02: [{ value: '', disabled: false }],
    ref03: [{ value: '', disabled: false }],
    codtipoorden:[{ value: 'OC', disabled: false }],
    codigonroorden:[{ value: '', disabled: true }],
    nomproyecto:[{ value: '', disabled: false }],
    nrodocumento:[{ value: '', disabled: false }],
    fecemision: [{ value: '', disabled: false, }],
    tc:[{ value: '', disabled: false }],
    tipodoc_ctb:[{ value: 3, disabled: false }],
    nroserie_ctb:[{ value: '', disabled: false }],
    nrodocumento_ctb:[{ value: '', disabled: false }],
    fecvencimiento: [{ value: '', disabled: false, }],
    nrocuotas:[{ value: 1, disabled: false }],
    porc_detraccion:[{ value: 0, disabled: false }],
    s_monto_detraccion_mn_CTB:[{ value: 0, disabled: false }],
    s_monto_detraccion_CTB:[{ value: 0, disabled: false }],
    s_monto_valor_venta_CTB:[{ value: 0, disabled: false }],
    s_monto_igv_CTB:[{ value: 0, disabled: false }],
    s_monto_total_CTB:[{ value: 0, disabled: false }],
    montoTotal:[{ value: 0, disabled: false }],
    nrocontrato_ctb:[{ value: null, disabled: false }],
    nroexpediente_ctb:[{ value: null, disabled: false }],
    codunidadejecutora_ctb:[{ value: null, disabled: false }],
    nroprocesoseleccion_ctb:[{ value: null, disabled: false }],
    observacion: [{ value: '', disabled: false }],
    nrodias:[{ value: '', disabled: false }],
    idordencompra_origen_ctb:[{ value: 0, disabled: false }],
    monto_pen_pago:[{ value: 0, disabled: false }],
    idcentrocosto:[{ value: 0, disabled: false }],
    s_monto_neto_CTB:[{ value: 0, disabled: false }],
    direccion:[{ value: null, disabled: false }],
    fel_sunat_transaction:[{ value: null, disabled: false }],
    tipo_de_nota_de_credito:[{ value: null, disabled: false }],
    tipo_de_nota_de_debito:[{ value: null, disabled: false }],
    serie:[{ value: null, disabled: false }],
    nnumero:[{ value: null, disabled: false }],
    iddocumentoprc_origen:[{ value: 0, disabled: false }],
    tipodoc_ctb_origen:[{ value: null, disabled: false }],
    nroserie_ctb_origen:[{ value: null, disabled: false }],
    nrodocumento_ctb_origen:[{ value: null, disabled: false }],
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
        this.verbtnGrabar = true;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = false;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= false;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.onlyRead = false;
      break;      
      case 'EMI':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= true;
        this.verbtnOrden = true;
        this.verbtnAcciones = true;
        this.verItems = true;
        this.onlyRead = false;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
      break;
    
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnPreliminar= this.idOrdenC === 0 ? true : false;
      this.verbtnOrden = this.idOrdenC === 0 ? false : true;
      this.verbtnAcciones = false;
      this.verItems = false;
      this.onlyRead = true;
    }
    
  }

  traerUno(){
     this.setSpinner(true);
     this.mensajeSpinner = 'Cargando...!';
     const objeto ={
       idordencompra: this.idOrdenC,
       idusuario: constantesLocalStorage.idusuario
     }
 
     const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
       .subscribe({
         next: (rpta:any) => {
           console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
             this.ordenCompra = rpta.ordencompra[0];     
             //this.getOcproveedor(rpta.ordencompra[0].idproveedor); 
             if (rpta.ordencompra[0].items !== undefined) {
               this.lstItemOC = rpta.ordencompra[0].items;
             }  

             if (rpta.ordencompra[0].cuotas !== undefined) {
              this.listaCuotas =  rpta.ordencompra[0].cuotas; 
            }   

            this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
          this.visibleDocument = false; 
          this.visibleAsiento = false;
          this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
            this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);   
          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
          this.registerFormRegistro.get('tipodoc_ctb_origen')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb_origen));
          
          this.registerFormRegistro.get('serie')?.setValue(rpta.ordencompra[0].nroserie_ctb_origen);
          this.registerFormRegistro.get('nnumero')?.setValue(rpta.ordencompra[0].nrodocumento_ctb_origen);
          this.mostrarBotones(rpta.ordencompra[0].estado); 
          this.getBusquedaRUC();
          this.setSpinner(false);       
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
 
  guardarOC(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }
    

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    let fechaingreso;
    let fecemision;
    let fecvencimiento;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecemision = this.registerFormRegistro.value.fecemision;
    fecvencimiento = this.registerFormRegistro.value.fecvencimiento;
    
    //if (this.idOrdenC > 0) {
      if (fechaingreso.toString().length === 10) {
        fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
      }
      if (fecemision.toString().length === 10) {
        fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
      } 
      if (fecvencimiento.toString().length === 10) {
        fecvencimiento = new Date(this.serviceUtilitario.formatFecha(fecvencimiento));    
      }         
    //}

    for (let i = 0; i < this.lstItemOC.length; i++) {      
      if (this.lstItemOC[i].cantidad.toString() === '') {
        this.lstItemOC[i].cantidad = 0;
      }    
      if (this.lstItemOC[i].preciocosto.toString() === '') {
        this.lstItemOC[i].preciocosto = 0;
      }
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecemision,
      fecvencimiento,
      tipodoc_ctb : (this.registerFormRegistro.value.tipodoc_ctb).toString(),
      cuotas: this.listaCuotas,
      nrocuotas: this.nrocuotas 
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idOrdenC === 0) {
            this.idOrdenC = rpta.resultProceso;  
            this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);
            this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);            
           
            this.dataAdjunto ={
              idCliente: this.idOrdenC,
              codtipoproc: 8,
              veracciones: 0
            }   
            this.verAdjunto = true;  
          }else{
            this.traerUno();
          }
          
         
        this.visibleDocument = false;
        this.visibleAsiento = false;
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

  setearDias(ven:any, emi:any){
    let  vencimiento = new Date(this.serviceUtilitario.formatFecha(ven));
    let  emision = new Date(this.serviceUtilitario.formatFecha(emi));
    let diff= 0;
    if (emision.getTime() > vencimiento.getTime()) {
      diff = emision.getTime() - vencimiento.getTime()
    }else{
      diff = vencimiento.getTime() - emision.getTime()
    }
    this.registerFormRegistro.get('nrodias')?.setValue( diff/(1000*60*60*24) );
  }
  

  procesarTRX() { 
    const objeto = {
        idtrx: 137,
        idusuario: constantesLocalStorage.idusuario,
        descripcion: 'ok',
        iddocumentoprc: this.idOrdenC,
    }

    const $procesarTrx = this.ordencompraService.procesarTrx(objeto).subscribe({
        next: (rpta: any) => {
            console.log('prcReunion', rpta);
            if (rpta.procesoSwitch === 0) {
                console.log('entro procesoSwitch....');
                this.onlyRead = true;
            }

            this.serviceSharedApp.messageToast({
                severity: rpta.procesoSwitch === "0" ? 'success' : 'info',
                summary: rpta.procesoSwitch === "0" ? 'Exito' : 'Validación...!',
                detail: rpta.mensaje
            });
        },
        error: (err) => {
            console.error('error : ', err);
            this.serviceSharedApp.messageToast();
        },
        complete: () => {},
    });
    this.$listSubcription.push($procesarTrx)
}

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(114).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstTermino = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
  }

  listarItemsTablaUnidad() {
    this.comprasService.obtenerItemsTabla(107).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstUnidades = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });    
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

  listaClientes() {
    let tiporol ="CLI";
    this.proyectosService.obtenerClientes(tiporol).subscribe({
        next: (rpta: any) => {
        this.lstCliente = rpta;
        console.log('listaClientes', this.lstCliente);
        },
        error: (err) => {
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

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
      this.lstOrigen = rpta;
      const objeto = {
        idtipoproyecto: 4,
        nomtipoproyecto: 'Otros',
        codproceso:'OTR'
      }
      this.lstOrigen.unshift(objeto);
      },
      error: (err) => {
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
   
  getOrigen(data:any){
    console.log('getOrigen...', data);
    this.registerFormRegistro.get('idcentrocosto')?.setValue('');
    switch (data) {
      case 'OPO':
        this.cargarProyectos(1);
        //this.verReferencia = false;
        this.verProyecto = true;
        break;
      case 'REQ':
        this.cargarProyectos(4);
        //this.verReferencia = true;
        this.verProyecto = true;
        break;        
      case 'OTR':
        this.cargarProyectos(4);
        //this.verReferencia = false;
        this.verProyecto = true;
        break;
      // case 'VED':
      //   this.cargarProyectos(3);
      //   break;
      // case 'NOA':
      //   this.registerFormRegistro.get('idproyecto').setValue(0);
      //   break;
    }    
    //this.registerFormRegistro.get('sustentodoc').setValue('');  
    
    //this.verControles(data);

  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
      this.lstProyectos = rpta;
      console.log('cargarProyectos...',this.lstProyectos);
      this.registerFormRegistro.get('idproyecto')?.setValue(this.ordenCompra.idproyecto);
          },

      error: (err) => {
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

  vistaPreliminar(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Vista Preliminar...!';

    const objeto = {
      idusuario : constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: 6
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumento(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = this.idOrdenC + '-OC';
  
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.target = '_blank';
          a.click();

          window.open(url);

          setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }, 100);
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
    this.$listSubcription.push($cargarOrdenC)
  }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        console.log('listarTipoProducto', rpta);
        const lstTipoProductoTot = rpta;
        this.lstTipoProducto = lstTipoProductoTot.filter((x: { idtipoprod: number; }) => x.idtipoprod !== 0 && x.idtipoprod !== 8);
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarTipoProducto);

  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (this.registerFormRegistro.value.idproyecto === '' || this.registerFormRegistro.value.idproyecto === null)
      {
          this.errorMensaje="Seleccionar Centro de Costos...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.nrodocumento === null ||this.registerFormRegistro.value.nrodocumento ==='' ))
    {
        this.errorMensaje="Ingresar RUC...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.idproveedor === null || this.registerFormRegistro.value.idproveedor === ''))
    {
        this.errorMensaje="Buscar Proveedor por RUC...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.tipodoc_ctb === '' || this.registerFormRegistro.value.tipodoc_ctb === null))
    {
        this.errorMensaje="Seleccionar Tipo de Documento...!";
        _error = true;
    }

    // if (!_error && (this.registerFormRegistro.value.nroserie_ctb === '' || this.registerFormRegistro.value.nroserie_ctb === null))
    // {
    //     this.errorMensaje="Ingresar Serie de Documento...!";
    //     _error = true;
    // }
  
    // if (!_error && (this.registerFormRegistro.value.nrodocumento_ctb === '' || this.registerFormRegistro.value.nrodocumento_ctb === null))
    //   {
    //       this.errorMensaje="Ingresar Número de Documento...!";
    //       _error = true;
    //   }

      if (!_error && (this.registerFormRegistro.value.codformapago === '' || this.registerFormRegistro.value.codformapago === null))
        {
            this.errorMensaje="Ingresar Forma de Pago...!";
            _error = true;
        }

        // if (!_error && (this.registerFormRegistro.value.porc_detraccion === '' || this.registerFormRegistro.value.porc_detraccion === null))
        //   {
        //       this.errorMensaje="Ingresar % Detracción...!";
        //       _error = true;
        //   }

    if (!_error && this.registerFormRegistro.value.idmoneda === null)
    {
          this.errorMensaje="Seleccionar Moneda...!";
          _error = true;
    }

    if (this.registerFormRegistro.value.idmoneda !== 1) {
      if (!_error && (this.registerFormRegistro.value.tc === null || this.registerFormRegistro.value.tc === ''|| this.registerFormRegistro.value.tc === 0))
        {
              this.errorMensaje="Ingresar Tipo Cambio...!";
              _error = true;
        }
    }

    if (!_error && this.registerFormRegistro.value.fel_sunat_transaction === null)
      {
            this.errorMensaje="Seleccionar Transacción...!";
            _error = true;
      }    

      // if (!_error && (this.registerFormRegistro.value.porc_detraccion === null 
      //   || this.registerFormRegistro.value.porc_detraccion === ''
      //   || this.registerFormRegistro.value.porc_detraccion === 0))
      //   {
      //         this.errorMensaje="Ingresar Porcentaje Detracción...!";
      //         _error = true;
      //   }

      // if (this.idOrdenC > 0) {
      //   let total = this.listaCuotas.map(({monto}) => monto).reduce((acc, value) => acc + value, 0);
      //   console.log('total', total);
      //   console.log('monto_pen_pago', this.registerFormRegistro.value.monto_pen_pago);
      //   if (total > this.registerFormRegistro.value.monto_pen_pago) {
          
      //         this.errorMensaje="El Monto de cuotas no debe exceder el Monto Neto Pago...!";
      //             _error = true;
      //   }
      // }
    

    return _error;
    }

  getBusquedaRUC(){
    const _nro =  this.registerFormRegistro.get('nrodocumento')?.value;
    console.log('getBusquedaRUC...', _nro); 

    if(_nro === null || _nro === ''){
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Ingresar Ruc...' });
      return;
    }
    console.log('length...', _nro.length); 
    if(_nro.length < 11){
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Ruc no Valido...' });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = 'Buscando...!';

    const objet = {
      nrodocumento: _nro
    }

    this.ordencompraService.buscarporRUC(objet).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log('rpta...', rpta); 
        if(rpta.length === 0){
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Cliente no encontrado...' });
          return;
        }
        this.registerFormRegistro.get('idproveedor')?.setValue(rpta[0].idcliente);
        this.registerFormRegistro.get('direccion')?.setValue(rpta[0].direcresumen);
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

  listarItemsTablaComprobante() {
    this.contabilidadService.listarItemsTablaSunat(2).subscribe({
      next: (rpta: any) => {
        console.info('listarItemsTablaComprobante : ', rpta);
          this.lstComprobante = rpta;
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });  
  }

  listarCentroCosto(){    
    this.setSpinner(true);
      this.mensajeSpinner = 'Cargando...!';

    const $getListarOrdenCompra = this.comprasService.listarCentroCosto()
      .subscribe({
        next: (rpta:any) => {
            this.lstCentroCosto = rpta;
            console.log('listarCentroCosto...', this.lstCentroCosto);
            this.setSpinner(false);
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
            this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }

  listarItemsTablaSunat() {
    this.contabilidadService.listarItemsTablaSunat(1).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTablaSunat : ', rpta);
            this.lstSunatTrans = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }
 
    buscarDocumento(){
      this.setSpinner(true);
     this.mensajeSpinner = 'Cargando...!';

      const objeto ={
        serie: this.registerFormRegistro.value.serie,
        nnumero: this.registerFormRegistro.value.nnumero,
        idusuario: constantesLocalStorage.idusuario
      }
  
      const $cargarOrdenC = this.proyectosService.ordenCompraTraerunoNroDoc(objeto)
        .subscribe({
          next: (rpta:any) => {
            console.log('ordenCompraTraerunoNroDoc', rpta.ordencompra[0]);
              this.ordenCompra = rpta.ordencompra[0];     
              //this.getOcproveedor(rpta.ordencompra[0].idproveedor); 
              if (rpta.ordencompra[0].items !== undefined) {
                this.lstItemOC = rpta.ordencompra[0].items;
                for (let i = 0; i < this.lstItemOC.length; i++) {                  
                  this.lstItemOC[i].idordencompra = 0
                  this.lstItemOC[i].idordencompraitem = 0
                }
              }  
 
              if (rpta.ordencompra[0].cuotas !== undefined) {
               this.listaCuotas =  rpta.ordencompra[0].cuotas; 
               for (let i = 0; i < this.listaCuotas.length; i++) {                  
                this.listaCuotas[i].idcuotadoc = 0
                this.listaCuotas[i].idordendocumento = 0
              }
             }   
             this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
             this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
           //this.visibleDocument = false; 
           //this.visibleAsiento = false;
           this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
            this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision); 
 
          
          
           this.mostrarBotones(rpta.ordencompra[0].estado); 
           this.getBusquedaRUC();
           this.nrocuotas = rpta.ordencompra[0].nrocuotas 
           this.setSpinner(false);     
           //this.registerFormRegistro.get('idproyecto')?.setValue(rpta.ordencompra[0].idproyecto);  
           this.registerFormRegistro.get('iddocumentoprc_origen')?.setValue(rpta.ordencompra[0].idordencompra); 
           this.registerFormRegistro.get('idordencompra')?.setValue(0);   
           
           this.registerFormRegistro.get('tipodoc_ctb')?.setValue(3);
           this.registerFormRegistro.get('nroserie_ctb')?.setValue(''); 
           this.registerFormRegistro.get('nrodocumento_ctb')?.setValue(''); 

           this.registerFormRegistro.get('tipodoc_ctb_origen')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
           this.registerFormRegistro.get('nroserie_ctb_origen')?.setValue(rpta.ordencompra[0].nroserie_ctb); 
           this.registerFormRegistro.get('nrodocumento_ctb_origen')?.setValue(rpta.ordencompra[0].nrodocumento_ctb); 
           
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

    listarItemsTablaTipoNota() {
      this.contabilidadService.listarItemsTablaSunat(4).subscribe({
        next: (rpta: any) => {
          console.info('lstTipoNota : ', rpta);
            this.lstTipoNota = rpta;
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