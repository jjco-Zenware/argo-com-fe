
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CItemOrdenesComponent } from 'src/app/pages/almacen/items-ordenes/c-items-ordenes.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CModalPersonaComponent } from 'src/app/pages/compras/registro-compra/modalPersona/c-modalpersona.component';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-dato-venta',
  templateUrl: './c-dato-venta.component.html',
  styleUrls: ['./c-dato-venta.component.scss']
})
export class DatoVentaComponent implements OnInit, OnDestroy{
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
  registerFormCliente: any = FormGroup;
  registerFormContacto: any= FormGroup;
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
  dataCT:any = {id:0, razonsocial:'', description:'', nommoneda:'', startDate:'', nomcreador:'', tipocambio:'', idlista:'', quotes:[]};
  verCotizacion: boolean = true;
  lstTipo = [
    { name: 'COMPRA', code: 'OC' },
    { name: 'SERVICIO', code: 'OS' }
  ];
  lstTermino: any;
  lstQuotes: any[]=[];
  verAdjunto: boolean = false;
  contactoVisible: boolean = false;
  itemVisible: boolean = false;
  ExcelData: any;
  idtipoprod: any;
  idmarca: any;
  lstMarcas:any;
  lstTipoProducto:any;
  verImportar: boolean = true;
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
  minimaFechaDesde!: Date;
  maximaFechaDesde: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  minimaFechaHasta!: Date;
  maximaFechaHasta: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  lstCentroCosto: any;
  nrocuotas!:number;
  s_monto!: number;
  s_igv!: number;
  lstSunatTrans:any[]=[];

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

    this.createFrm();
    this.createFormRegistro();
    this.createFormContacto();
    this.listaProyectoTipo();
    this.listaClientes();
    this.listaMonedas();  
    this.listarItemsTabla(); 
    this.listarItemsTablaUnidad() ;
    this.listarItemsTablaComprobante();
    this.listarCentroCosto();
    this.listarItemsTablaSunat();

    this.minimaFechaHasta = this.registerFormRegistro.value.fecemision;
    this.maximaFechaDesde = this.registerFormRegistro.value.fecvencimiento;
    
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
      //this.verControles('NOA');
      this.cargarProyectos(1); 
      this.gettipocambiodia();
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 8,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
      //this.getOrigen('OPO');
    //   const newDate = this.addDays(this.serviceUtilitario.obtenerFechaActual(), 30);
    // this.registerFormRegistro.get('fecvencimiento').setValue(newDate);
    }   
  }


  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormContacto = this.formBuilder.group({
      nomcontacto: ['', [Validators.required]],
      email1: ['', [Validators.required, Validators.email]],
      telf1: ['', [Validators.required]],
      cargo: [{ value: '', disabled: false }, [Validators.required]],
      tiporol: [{ value: 0, disabled: false }],
      indvig: [{ value: true, disabled: false }]
    });
}

createFormRegistro() {
  //Agregar validaciones de formulario
  this.registerFormRegistro = this.formBuilder.group({
    idproyecto: [{ value: 0, disabled: false }],
    idtipoproyecto: [{ value: 0, disabled: false }],
    idtipodocprc: [{ value: 6, disabled: false }],
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
    idmoneda: [{ value: 0, disabled: false }],
    //idorigen: [{ value: this.IA_data, disabled: false }],
    idcontacto: [{ value: 0, disabled: false }],
    codtipodoc: [{ value: 'OPO', disabled: false }],
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
    fecemision: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
    tc:[{ value: 0, disabled: false }],
    tipodoc_ctb:[{ value: '', disabled: false }],
    nroserie_ctb:[{ value: '', disabled: false }],
    nrodocumento_ctb:[{ value: '', disabled: false }],
    fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
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
    nrodias:[{ value: 1, disabled: false }],
    idordencompra_origen_ctb:[{ value: 0, disabled: false }],
    monto_pen_pago:[{ value: 0, disabled: false }],
    idcentrocosto:[{ value: 0, disabled: false }],
    s_monto_neto_CTB:[{ value: 0, disabled: false }],
    direccion:[{ value: null, disabled: false }],
    fel_sunat_transaction:[{ value: null, disabled: false }],
    tipo_de_nota_de_credito:[{ value: null, disabled: false }],
    tipo_de_nota_de_debito:[{ value: null, disabled: false }],
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

  mostrarBotones(data:any){
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'PEN':
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
      case 'EMT':
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
      case 'PAG':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = true;
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
             if (rpta.ordencompra[0].quotes !== undefined) {
               this.lstQuotes =  rpta.ordencompra[0].quotes; 
             } 

             if (rpta.ordencompra[0].cuotas !== undefined) {
              this.listaCuotas =  rpta.ordencompra[0].cuotas; 
            }   

            this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
          this.visibleDocument = false; 
          this.visibleAsiento = false;

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
          //this._alm_idordencompra = rpta.ordencompra[0].alm_idordencompra;
          this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
            this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.mostrarBotones(rpta.ordencompra[0].estado); 
          this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);     
          this.registerFormRegistro.get('monto_pen_pago')?.setValue(rpta.ordencompra[0].s_monto_neto_CTB);
          this.registerFormRegistro.get('fecvencimiento')?.setValue(rpta.ordencompra[0].fecvencimiento);
          this.registerFormRegistro.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision );   
          this.nrocuotas = rpta.ordencompra[0].nrocuotas 
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
      if (this.listaCuotas.length > 0) {
        for (let i = 0; i < this.listaCuotas.length; i++) {
          this.listaCuotas[i].nrocuota = i + 1;
          if (this.listaCuotas[i].monto === 0) {
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'El monto de la cuota debe ser mayor que cero...' });
          return;
          }
        }
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
            //agregar una cuota por defecto
            this.traerUno2();             
            
            //preguntar si desea emitir el documento con una cuota
            this.confirmationService.confirm({
              key: 'confirm1',
              header: 'Confirmación',
              message:  '¿Desea Emitir el Documento con una Cuota...?' ,
              accept: () => {
                this.guardarOC();
                this.procesarTRX();
                }
            }); 
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

  traerUno2(){
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
              if (rpta.ordencompra[0].quotes !== undefined) {
                this.lstQuotes =  rpta.ordencompra[0].quotes; 
              } 
              if (rpta.ordencompra[0].cuotas !== undefined) {
                this.listaCuotas =  rpta.ordencompra[0].cuotas; 
              }   
  
              this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
            this.visibleDocument = false; 
            this.visibleAsiento = false;
  
            this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
            this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
            //this._alm_idordencompra = rpta.ordencompra[0].alm_idordencompra;
            this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
            this.montoTotal = rpta.ordencompra[0].s_monto_total;
            this.mostrarBotones(rpta.ordencompra[0].estado); 
            this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);     
            this.registerFormRegistro.get('monto_pen_pago')?.setValue(rpta.ordencompra[0].s_monto_neto_CTB);
            this.registerFormRegistro.get('fecvencimiento')?.setValue(rpta.ordencompra[0].fecvencimiento);
            this.registerFormRegistro.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision );   
            this.nrocuotas = rpta.ordencompra[0].nrocuotas
            //agregar cuotas
            this.prcCuota2(1);
            
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

  servicioGenerico(){
    //this.registerFormRegistro.get('condicionescomerciales').setValue(''); 
    
    this.comprasService.obtenerItemsTabla(109).subscribe({
      next: (rpta: any) => {

        let _condicionescomerciales = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
        //this.registerFormRegistro.get('condicionescomerciales').setValue(_condicionescomerciales[0].valoritem);
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });
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

  getItem(data: any,index: number) {
    data.nroindex = index;
    data.idordencompra = this.idOrdenC;
    data.origenreg = 'RV';
    console.log('CItemOrdenesComponent', data);
    const refItem = this.dialogService.open(CItemOrdenesComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Detalle" : "Editar Detalle - " + data.idordencompraitem,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      
      console.log('onClose',rpta);
      if (rpta != undefined) {
          const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
          if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
          }
          console.log('getItem',rpta.objeto);
        this.lstItemOC.push(rpta.objeto);
        console.log('this.lstItemOC',this.lstItemOC);
      }
      this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
    });
  }

  eliminarItem(data: any) {
    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message:  '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' ,
      accept: () => {
        if (data.idordencompra > 0) {
          const _posAll: number = this.lstItemOC.findIndex((x => x.idordencompraitem == data.idordencompraitem))
          if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
          }
      }else{
          const _posAll: number = this.lstItemOC.findIndex((x => x.idnvoitem == data.idnvoitem))
          if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
          }
      }
      if (this.lstItemOC.length === 0) {
        this.registerFormRegistro.get('nrocuota')?.setValue(0);
        this.nrocuotas = 0;
        this.listaCuotas=[];

        this.registerFormRegistro.get('s_monto_valor_venta_CTB')?.setValue(0);
        this.registerFormRegistro.get('s_monto_igv_CTB')?.setValue(0);
        this.registerFormRegistro.get('s_monto_total_CTB')?.setValue(0);
        this.registerFormRegistro.get('s_monto_detraccion_mn_CTB')?.setValue('');
        this.registerFormRegistro.get('monto_pen_pago')?.setValue(0);

        /*ACTUALIZANDO MONTOS TOTALES DE LOS ITEMS*/
        this.s_monto = 0;
        this.s_igv = 0;
        this.montoTotal = 0;
      }else{
        this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
      }
      
      }
  });
  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
      this.lstProyectos = rpta;
      console.log('cargarProyectos...',this.lstProyectos);
      this.changeProyecto(this.registerFormRegistro.value.idproyecto)

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


  NuevoPersona(){
    const objet = {
      idrolpersona:'PRO'
          }

     const refItem = this.dialogService.open(CModalPersonaComponent, {
     
       data: objet,
       header: "Agregar Cliente",
       closeOnEscape: false,
       styleClass: 'testDialog',
       width: '40%'
     });
     refItem.onClose.subscribe((rpta: any) => {
       
       console.log('onClose',rpta);
       if (rpta != undefined) {
         this.listaClientes();
         this.registerFormRegistro.get('nrodocumento').setValue(parseInt(rpta.objeto.nrodocumento));
         this.registerFormRegistro.get('idproveedor').setValue(parseInt(rpta.objeto.idpersona));          
       }
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
 
  importarPlantilla(){
    this.listarTipoProducto();
    this.listarMarcas();
    this.idtipoprod = null;
    this.idmarca = null;
    this.verImportar= true;
    this.itemVisible = true;
  }

  disabelImportar(){
    console.log(this.idtipoprod , this.idmarca)
    if (this.idtipoprod != null && this.idmarca != null) {
      this.verImportar= false;
    }
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

  listarMarcas() {
    const $listarMarcas = this.proyectosService.obtenerMarcas().subscribe({
      next: (rpta: any) => {
        this.lstMarcas = rpta;
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarMarcas);

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

      if (!_error && (this.registerFormRegistro.value.porc_detraccion === null 
        || this.registerFormRegistro.value.porc_detraccion === ''))
        {
              this.errorMensaje="Ingresar Porcentaje Detracción...!";
              _error = true;
        }

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

  prcCuota(data:number)  {
    console.log('prcCuota...', data);
    if (this.registerFormRegistro.value.monto_pen_pago === 0) {
      this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Aún no existe Monto de Pago para agregar cuotas'});
      this.registerFormRegistro.get('nrocuotas')?.setValue(data);
      this.nrocuotas = 0;
          return;
    }
    this.nrocuotas = data;
    this.listaCuotas=[];
  const _monto = this.registerFormRegistro.value.monto_pen_pago/data;

  const _fecha =new Date(this.serviceUtilitario.formatFecha(this.registerFormRegistro.value.fecemision));
  console.log('_fecha...', _fecha);
  console.log('_monto...', _monto);
  let tot_dia = this.registerFormRegistro.value.nrodias/data;
  console.log('tot_dia...', tot_dia);

  //let dia_tot = 0;

   for(let i = 0; i < data; i++) {
    console.log('index...', i);
    console.log('tot_dia...', tot_dia);

    let dias = (tot_dia * i) + tot_dia
    
    const newDate = this.addDays(_fecha, dias );
    const objet = {
      fechacuota: newDate,
      monto: _monto,
      idcuotadoc:0
    }
    
    //tot_dia = tot_dia + tot_dia;    
    this.listaCuotas.push(objet);
   }

    // 
    // let _monto = 0;

    // let total = this.listaCuotas.map(({monto}) => monto).reduce((acc, value) => acc + value, 0);
    // console.log('total', total);
    // if (total > this.registerFormRegistro.value.monto_pen_pago) {
    //   this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'El Monto de cuotas no debe exceder el Monto Neto Pago'});
    //       return;
    // }

    // if (this.listaCuotas.length === 0) {
    //   _monto = this.registerFormRegistro.value.monto_pen_pago
    // }else{
    //   _monto = this.registerFormRegistro.value.monto_pen_pago - total
    // }

    // const objet = {
    //   fechacuota: newDate,
    //   monto: _monto,
    //   idcuotadoc:0
    // }
    // this.listaCuotas.push(objet);
  }

  prcCuota2(data:number)  {    
    this.nrocuotas = data;
    this.listaCuotas=[];
    const _monto = this.registerFormRegistro.value.monto_pen_pago/data;
    console.log('_monto...', _monto);
    let tot_dia = this.registerFormRegistro.value.nrodias
    console.log('tot_dia...', tot_dia);

    const newDate = this.addDays(this.serviceUtilitario.obtenerFechaActual(), tot_dia );
    const objet = {
      fechacuota: newDate,
      monto: _monto,
      idcuotadoc:0
    }  
    this.listaCuotas.push(objet);
  }
  
  eliminarCuota(data:any, index :number)  {
    console.log('index', index);
    this.listaCuotas.splice(index, 1)
  }

  editarRegistro(data: any) {
    this.mensajeSpinner = "Actualizando...";
    console.log('editarRegistro...', data);   
  }

  changeFechaDesde(event: Date) {
    this.minimaFechaHasta = event;
    let emision = new Date(this.registerFormRegistro.get('fecemision')?.value);
    let vencimiento = new Date(this.registerFormRegistro.get('fecvencimiento')?.value);
    console.log('emision', emision);
    console.log('vencimiento', vencimiento);
    let inicio = emision.getTime();
    let fin = vencimiento.getTime();
    var diff = fin - inicio;
    let numerDiff = (diff/(1000*60*60*24))+1;
    this.registerFormRegistro.get('nrodias')?.setValue( Math.round(numerDiff));
  }

  changeFechaHasta(event: Date) {
    let fecemision = this.registerFormRegistro.value.fecemision;
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
    }
    
    this.maximaFechaDesde = event;
    let vencimiento = new Date(this.registerFormRegistro.get('fecvencimiento')?.value);
    console.log('fecemision', fecemision, 'vencimiento', vencimiento);
    let inicio = fecemision.getTime();
    let fin = vencimiento.getTime();
    var diff = fin - inicio;
    let numerDiff = (diff/(1000*60*60*24))+1;
    this.registerFormRegistro.get('nrodias')?.setValue( Math.round(numerDiff));
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  addDiasFec(){
    let fecemision = this.registerFormRegistro.value.fecemision;
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
    } 

    let fecha = this.addDays(fecemision, parseInt(this.registerFormRegistro.value.nrodias));
    this.registerFormRegistro.get('fecvencimiento')?.setValue( fecha );
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

  changeProyecto(value:any){
    console.log('changeProyecto...', value);
    console.log('this.lstProyectos...', this.lstProyectos);
    let _codcentrocosto = this.lstProyectos.filter((x: { idproyecto: number; }) => x.idproyecto === value);
    console.log('_codcentrocosto...', _codcentrocosto);
    this.registerFormRegistro.get('idcentrocosto')?.setValue(_codcentrocosto[0].idcentrocosto);

  }

  recalcularRegistro(dato:any){    

    console.log('recalcularRegistro...', dato);
    if (this.idOrdenC > 0) {
      this.setSpinner(true);
    this.mensajeSpinner = 'Recalculando...!';
      let subtotal = this.lstItemOC.map(({preciocostototal}) => preciocostototal).reduce((acc, value) => acc + value, 0);

      const objeto = {
        subtotal: subtotal,
        porc_detraccion : dato,
        tc : this.registerFormRegistro.get('tc')?.value,
        idmoneda : this.registerFormRegistro.get('idmoneda')?.value,
        nrocuotas : this.nrocuotas,
        nrodias : this.registerFormRegistro.get('nrodias')?.value,
      }
      const $recalcularRegistro = this.comprasService.recalcularRegistro(objeto)
      .subscribe({
        next: (rpta:any) => {
            console.log('recalcularRegistro...', rpta);
            this.registerFormRegistro.get('s_monto_valor_venta_CTB')?.setValue(rpta[0].s_monto_valor_venta_CTB);
            this.registerFormRegistro.get('s_monto_igv_CTB')?.setValue(rpta[0].s_monto_igv_CTB);
            this.registerFormRegistro.get('s_monto_total_CTB')?.setValue(rpta[0].s_monto_total_CTB);
            this.registerFormRegistro.get('s_monto_detraccion_mn_CTB')?.setValue(rpta[0].s_monto_detraccion_mn_CTB);
            this.registerFormRegistro.get('monto_pen_pago')?.setValue(rpta[0].s_monto_neto_CTB);

            /*ACTUALIZANDO MONTOS TOTALES DE LOS ITEMS*/
            this.s_monto = rpta[0].s_monto_valor_venta_CTB;
            this.s_igv = rpta[0].s_monto_igv_CTB;
            this.montoTotal = rpta[0].s_monto_total_CTB;

            this.listaCuotas=[];

            const lista = rpta[0].cuotas
            
            for(let i = 0; i < lista; i++) {                  
              const objet = {
                fechacuota: new Date(lista[i].fechacuota),
                monto: lista[i].monto,
                idcuotadoc:0
              }
              this.listaCuotas.push(objet);
            }

            this.listaCuotas =  rpta[0].cuotas; 
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
    this.$listSubcription.push($recalcularRegistro)
    }
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
 
    gettipocambiodia(){        

      let fecha = new Date();
        const objeto = {
          anio: fecha.getFullYear(),
          mes: fecha.getMonth()+1,
          dia: fecha.getDate()
        }
    
        const $gettipocambio = this.proyectosService.gettipocambiodia(objeto)
          .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log('rpta gettipocambiodia', rpta);
                console.log('rpta valTipo', rpta.valTipo);
                this.registerFormRegistro.get('tc')?.setValue(parseFloat( rpta.valTipo));
            },
            error:(err)=>{
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($gettipocambio)
    
      }
}