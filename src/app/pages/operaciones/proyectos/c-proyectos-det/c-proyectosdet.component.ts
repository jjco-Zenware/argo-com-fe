
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda } from '@interfaces';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';
import { CItemAlmacenComponent } from 'src/app/pages/almacen/c-item-almacen/c-item-almacen.component';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';
import { CBusquedaProductoComponent } from 'src/app/pages/almacen/busqueda-producto/c-busqueda-producto.component';
import { CModalProveedorComponent } from '../modal-proveedor/c-modalproveedor.component';

@Component({
  selector: 'app-c-proyectosdet',
  templateUrl: './c-proyectosdet.component.html',
  styleUrls: ['./c-proyectosdet.component.scss']
})
export class CProyectosDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any= FormGroup;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  submitted = false;
  headerTitle: string = '';
  lstMonedas: Moneda[] = [];
  lstItemOC: any[] = [];
  montoTotal: number = 0;
  lstOrdenC: any;
  lstOrigen: any;
  idMovimiento: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  verCotizacion: boolean = true;
  lstTermino: any;
  verAdjunto: boolean = false;
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  verReferencia: boolean = false;
  errorMensaje: string = "";
  s_monto:number = 0;
  s_igv:number = 0;
  s_monto_total:number = 0;
  activeIndex: number = 0;
  lstAlmacen: any;
  selectedItems: any;
  lstTransacciones: any[]=[];
  listadoArchivos: any[]=[];
  verbtnPreliminar: boolean = false;
  lstPostores: any[] = [];

  lstOportunidades: any;
    verProyecto: boolean = false;
    verOportunidad: boolean = false;
  verPdfMail: boolean = false;

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
  ) { }

  ngOnInit(): void {
    this.idMovimiento = this.IA_data.idcodigo;

    this.createFrm();
    this.createFormRegistro();
    this.listaClientes();
    this.listarItemsTabla(); 
        this.listaProyectoTipo();
    
    if (this.idMovimiento > 0) {   
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto ={
          idCliente: this.idMovimiento,
          codtipoproc: 7,
          veracciones: 1
        }
      }  else{
        this.dataAdjunto ={
          idCliente: this.idMovimiento,
          codtipoproc: 7,
          veracciones: 0
        }
      }  
      this.verAdjunto = true;     
      this.traerUnoOrdenC();
    }else{
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 7,
        veracciones: 0
      }     
      this.getOrigen('OTR');
      this.mostrarBotones('NVO');
      this.servicioGenerico();
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: this.IA_data.idtipodocprc, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{value: this.serviceUtilitario.obtenerFechaFormateadoDMA(),disabled: false,}],
      idordencompra: [{ value: this.idMovimiento, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 1, disabled: false }],
      labelnrodocumento: [{ value: '', disabled: true }],
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
      fecentrega: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      terminosdepago:[{ value: '', disabled: false }],
      idalmacen:[{ value: 0, disabled: false }],
      alm_idordencompra:[{ value: 0, disabled: false }],
      idprod: [{ value: 0, disabled: false }],
      alm_idalmacen_destino: [{ value: 0, disabled: false }],
      gre_peso_bruto_total: [{ value: 0, disabled: false }],
      gre_numero_de_bultos: [{ value: 0, disabled: false }],
      gre_tipo_de_transporte: [{ value: '', disabled: false }],
      gre_transportista_documento_tipo: [{ value: '1', disabled: false }],
      gre_conductor_documento_tipo: [{ value: '1', disabled: false }],
      gre_conductor_documento_numero: [{ value: '', disabled: false }],
      gre_conductor_denominacion: [{ value: '', disabled: false }],
      gre_punto_de_partida_ubigeo: [{ value: '', disabled: false }],
      gre_punto_de_llegada_ubigeo: [{ value: '', disabled: false }],
      gre_fec_ini_traslado: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      gre_ruc_emp_transporte: [{ value: '', disabled: false }],
      gre_nom_emp_transporte: [{ value: '', disabled: false }],
      gre_marca_placa_unid_transporte: [{ value: '', disabled: false }],
      gre_punto_partida: [{ value: '', disabled: false }],
      gre_punto_llegada: [{ value: '', disabled: false }],
      gre_motivo_de_traslado: [{ value: '13', disabled: false }],
      gre_guia_tipo: [{ value: 1, disabled: false }],
      gre_conductor_nombre: [{ value: '', disabled: false }],
      gre_conductor_apellidos: [{ value: '', disabled: false }],
      gre_conductor_numero_licencia: [{ value: '', disabled: false }],
      tipo_igv: [{ value: 0, disabled: false }],
      fel_codmotivo: [{ value: 0, disabled: false }],
      fel_tiponotadebito: [{ value: 0, disabled: false }],
      fel_tipoigv: [{ value: 0, disabled: false }],
      nroserie_ctb:[{ value: '', disabled: false }],
      nrodocumento_ctb:[{ value: '', disabled: false }],
      fecemision: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      tipodoc_ctb: [{ value: 7, disabled: false }],
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
      case 'REG':
        this.verbtnGrabar = true;
        this.verbtnAcciones = true;
        this.onlyRead = false;
        this.verbtnPreliminar= true;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnAcciones = false;
        this.onlyRead = false;
        this.verbtnPreliminar= false;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.verbtnAcciones = true;
        this.verItems = false;
        this.onlyRead = true;
        this.verbtnPreliminar= true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
        this.verbtnPreliminar= false;
      break;
    
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnPreliminar= this.idMovimiento === 0 ? true : false;
      this.verbtnAcciones = false;
      this.verItems = false;
      this.onlyRead = true;
    }
    
  }

  traerUnoOrdenC(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto ={
      idordencompra: this.idMovimiento,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
            this.setSpinner(false);
            this.ordenCompra = rpta.ordencompra[0]; 
            this.getOcproveedor(rpta.ordencompra[0].idproveedor);     
            if (rpta.ordencompra[0].items !== undefined) {
              this.lstItemOC = rpta.ordencompra[0].items;
            }    
            
            if (rpta.ordencompra[0].postores !== undefined) {
              this.lstPostores = rpta.ordencompra[0].postores;
            }
                         
          this.visibleDocument = false;
          this.verPdfMail = true;
          // console.log('s_monto', rpta.ordencompra[0].s_monto);
          // this.s_monto = rpta.ordencompra[0].s_monto;
          // this.s_igv = rpta.ordencompra[0].s_igv;
          // this.s_monto_total = rpta.ordencompra[0].s_monto_total; 

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.cargarMenu(rpta.ordencompra[0].acciones);
          this.getOrigen(rpta.ordencompra[0].codtipodoc);
          this.mostrarBotones(rpta.ordencompra[0].estado);       
                    this.getOportunidades(rpta.ordencompra[0].idproveedor);
          this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
         
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
          this.listarTransacciones();
          
        }
      });
    this.$listSubcription.push($cargarOrdenC)
  }

  listarTransacciones() {
    const $lstTransacciones = this.proyectosService.listarTrasacciones(this.idMovimiento).subscribe({
      next: (rpta: any) => {
        console.log('lstTransacciones', rpta);
        this.lstTransacciones = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($lstTransacciones);

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
    let fecentrega;
    let gre_fec_ini_traslado;
    let fecemision;

    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecentrega = this.registerFormRegistro.value.fecentrega;
    gre_fec_ini_traslado = this.registerFormRegistro.value.gre_fec_ini_traslado;
    fecemision = this.registerFormRegistro.value.fecemision;
    

    if (fechaingreso.toString().length === 10) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
    }
    if (fecentrega.toString().length === 10) {
      fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega)); 
    } 
    if (gre_fec_ini_traslado.toString().length === 10) {
      gre_fec_ini_traslado = new Date(this.serviceUtilitario.formatFecha(gre_fec_ini_traslado)); 
    } 
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
    } 

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
      fecentrega,
      gre_fec_ini_traslado,
      fecemision,
      tipodoc_ctb : (this.registerFormRegistro.value.tipodoc_ctb).toString(),
      postores: this.lstPostores
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idMovimiento === 0) {
            this.idMovimiento = rpta.resultProceso;  
            this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);
            this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);  

            this.dataAdjunto ={
              idCliente: this.idMovimiento,
              codtipoproc: 7,
              veracciones: 0
            }   
            this.verAdjunto = true; 

            //preguntar si desea agregar adjuntos
            this.confirmationService.confirm({
              key: 'confirm1',
              header: 'Confirmación',
              message:  '¿Desea Agregar Adjuntos ',
              accept: () => {
                this.activeIndex = 2;
              }
          });
          }
          this.traerUnoOrdenC();
         
        this.visibleDocument = false;
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
  servicioGenerico(){    
    this.comprasService.obtenerItemsTabla(109).subscribe({
      next: (rpta: any) => {
        console.info('servicioGenerico : ', rpta);
        let _terminosdepago = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
        this.registerFormRegistro.get('terminosdepago').setValue(_terminosdepago[0].valoritem);
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
    this.comprasService.obtenerItemsTabla(104).subscribe({
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

  listaClientes() {
    let tiporol ="CLI";
    this.proyectosService.obtenerClientes(tiporol).subscribe({
        next: (rpta: any) => {
        this.lstCliente = rpta;
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

  getItem(data: any,index: number) {
    data.nroindex = index;
    data.idordencompra = this.idMovimiento;
    data.movalmacen = 'N';
    console.log('CItemOrdenesComponent', data);
    const refItem = this.dialogService.open(CItemAlmacenComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Producto" : "Editar Producto" ,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%'
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
      this.calcularTotales();
    });
  }

  calcularTotales() {
    let totalpreventot = 0;    
    for (let lstCotiza of this.lstItemOC) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }    
    this.montoTotal = totalpreventot;
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
      this.calcularTotales();
      }
  });
  }

  getOcproveedor(dato: any) {  
    this.lstOrdenC = []
    const $personaProveedorlist = this.ordencompraService.ordencompraaprobadasprovlist(dato).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.lstOrdenC = rpta;
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
    this.$listSubcription.push($personaProveedorlist);
  }

  cargarMenu(data: any) {
    this.menuItems = [];
    data.forEach((item: any) => {
        this.menuItems.push({
            label: item.nomtrx,
            icon: 'pi pi-cog',
            command: () => this.onAccion(item)
        })
    });
  }

  onAccion(item: any) {
    this.getListaArchivos(item);
      console.log('onAccion', item);
  // this.ordenCompra.idtrx = item.idtrx;
  // console.log('onAccion', item);
  // const ref = this.dialogService.open(CModalExcAlmacenComponent, {
  //     data: this.ordenCompra,
  //     header: item.nomtrx,
  //     closeOnEscape: false,
  //     styleClass: 'testDialog',
  //     width: '40%'
  // });

  // ref.onClose.subscribe(() => {
  //     this.getListar();
  //   });
  }

  getListaArchivos(valor:any) {
  
    const objeto = {
      idoportunidad: 0,
      codtipoproc: 7 , 
      idnroproceso: this.ordenCompra.idordencompra, 
    }
    console.log('this.objeto ...', objeto );
  
  const $listarArchivos = this.comprasService.ListarAdjuntoProc(objeto)
    .subscribe({
      next: (rpta: any) => {
        this.listadoArchivos = rpta;
        console.log('this.listadoArchivos ...', this.listadoArchivos );

        const total = this.lstItemOC.filter((item: any) => item.indcompleto === true).length;
        if (total === 0) {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items sin Confirmar...!' });
            return;
        }


        if (this.listadoArchivos.length === 0) {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Debe Ingresar Guia de Remisión...!' });
              return;
        }else{
          this.guardarOC2(valor);
        }
      },
      error: (err) => {
        this.serviceSharedApp.messageToast();
      },
      complete: () => { }
    });
  this.$listSubcription.push($listarArchivos)
  }

  guardarOC2(item:any){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Procesando...!';
    let fechaingreso;
    let fecentrega;
    let gre_fec_ini_traslado;
    let fecemision;

    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecentrega = this.registerFormRegistro.value.fecentrega;
    gre_fec_ini_traslado = this.registerFormRegistro.value.gre_fec_ini_traslado;
    fecemision = this.registerFormRegistro.value.fecemision;
    

    if (fechaingreso.toString().length === 10) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
    }
    if (fecentrega.toString().length === 10) {
      fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega)); 
    } 
    if (gre_fec_ini_traslado.toString().length === 10) {
      gre_fec_ini_traslado = new Date(this.serviceUtilitario.formatFecha(gre_fec_ini_traslado)); 
    } 
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
    } 

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
      fecentrega,
      gre_fec_ini_traslado,
      fecemision,
      tipodoc_ctb : (this.registerFormRegistro.value.tipodoc_ctb).toString(),
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          //this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          this.ordenCompra.idtrx = item.idtrx;
          const ref = this.dialogService.open(CModalExcAlmacenComponent, {
              data: this.ordenCompra,
              header: item.nomtrx,
              closeOnEscape: false,
              styleClass: 'testDialog',
              width: '40%'
          });
          ref.onClose.subscribe(() => {
              this.traerUnoOrdenC();
            });
         
        this.visibleDocument = false;
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

      if (this.registerFormRegistro.value.idcliente === null || this.registerFormRegistro.value.idcliente === 0)
      {
          this.errorMensaje="Seleccionar Cliente...!";
          _error = true;
      }

    //   if (!_error && (this.registerFormRegistro.value.gre_nom_emp_transporte === " " || this.registerFormRegistro.value.gre_nom_emp_transporte === null))
    //     {
    //         this.errorMensaje="Ingresar Nombre Transportista...!";
    //         _error = true;
    //     }

    //   if (!_error && (this.registerFormRegistro.value.gre_motivo_de_traslado === null || this.registerFormRegistro.value.gre_motivo_de_traslado === ''))
    //     {
    //         this.errorMensaje="Seleccionar Motivo...!";
    //         _error = true;
    //     }
       return _error;
     }   
     

    getOCtraerItems(dato: any) {  
      console.info('dato : ', dato);
      //this._alm_idordencompra = dato;
      this.lstItemOC = []
      this.selectedItems=[];
      const objeto ={
        idordencompra: dato,
        idusuario: constantesLocalStorage.idusuario
      }
      const $personaProveedorlist = this.proyectosService.ordenCompraTraeruno(objeto).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('getOCtraerItems : ', rpta);                

              if (rpta.ordencompra[0].items !== undefined) {

                const data = rpta.ordencompra[0].items.map((item: any) => ({
                  ...item,
                  idordencompraitem: 0,    
                  idordencompra: this.idMovimiento, 
                  coditem: 1  ,
                }))
                this.lstItemOC = data;
              }
              console.info('lstItemOC : ', this.lstItemOC);  
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
      this.$listSubcription.push($personaProveedorlist);
    }

    selectCheckbox(dato: any){
      console.log('selectCheckbox...', dato);
      console.log('selectCheckbox...', this.selectedItems);

      const data = this.lstItemOC.map((item: any) => ({
        ...item,
        indcompleto: dato.checked === true ? true : false,
      }))

      this.lstItemOC = data;
    }

    getBusquedaAvanzada() {
      let idalamacen = 0;
        const refItem = this.dialogService.open(CBusquedaProductoComponent, {
          data: idalamacen,
          header: "Agregar Producto de partidas",
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '50%'
        });
        refItem.onClose.subscribe((rpta: any) => {
          
          console.log('onClose',rpta);
          if (rpta !== undefined) {
            let objeto = rpta.data;
            objeto.descripcion = rpta.data.despro;
            this.getItem(objeto,0);            
          }
        });
      }
      
    vistaPreliminar() {
      
        this.setSpinner(true);
      this.mensajeSpinner = 'Descargando Detalle...!';
  
      const objeto = {
        idusuario : constantesLocalStorage.idusuario,
        iddocumentoprc: this.idMovimiento,
        codtipoprc: 4,
        idplantilla: 0
      }
  
      const $cargarOrdenC = this.comprasService.prcDocumentoDet(objeto).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);      
          
          const mediaType = 'application/pdf';
            const blob = new Blob([rpta.body], { type: mediaType });
            const filename = 'PECOSA-' + this.ordenCompra.codigonroorden;
    
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
    


    getOportunidades(event:any){
        let origen = this.registerFormRegistro.value.codtipodoc;
        this.getOrigen(origen);
        const objeto = {
            idcliente :event
        }
        this.ordencompraService.getOportunidades(objeto).subscribe({
            next: (rpta: any) => {
                this.lstOportunidades = rpta;
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

    getOrigen(data: any) {
        console.log('getOrigen...', data);
        switch (data) {
            case 'OPO':
                this.verOportunidad = false;
                this.verProyecto = true;
                this.cargarProyectos(1);
                break;
            case 'REQ':
                this.verOportunidad = false;
                this.verProyecto = true;
                this.cargarProyectos(4);
                break;
            case 'OTR':
                this.verOportunidad = false;
                this.verProyecto = true;
                this.cargarProyectos(0);
                break;
            case 'MKT':
                this.verOportunidad = false;
                this.verProyecto = true;
                this.cargarProyectos(6);
                break;
            case 'OPR':
                this.verOportunidad = true;
                this.verProyecto = false;
                break;
        }
    }

    cargarProyectos(dato: any) {
        let cliente = this.registerFormRegistro.value.idproveedor;
        this.ordencompraService.portipoProyectoClienteList(dato, cliente).subscribe({
            next: (rpta: any) => {
                this.lstProyectos = rpta;
                console.log('cargarProyectos...', this.lstProyectos);
                if (this.lstProyectos.length === 0) {
                    
                    const objeto = {
                        idproyecto: 100,    
                        codigoproyecto:'NO APLICA',
                        s_nomproyecto: 'NO APLICA',
                    }
                    this.lstProyectos.push(objeto);
                }
            },

            error: (err) => {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {},
        });
    }

    listaProyectoTipo() {
        this.ordencompraService.tipoProyectoList().subscribe({
            next: (rpta: any) => {
                this.lstOrigen = rpta;
                const objeto = {
                    idtipoproyecto: 4,
                    nomtipoproyecto: 'Otros',
                    codproceso: 'OTR',
                };
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
            complete: () => {},
        });
    }

    agregarProveedor(data: any,index: number){
        data.nroindex = index;
        data.idordencompra = this.idMovimiento;
        data.idmoneda = this.registerFormRegistro.value.idmoneda;
        data.lista =  this.lstPostores;
        const refMensaje = this.dialogService.open(CModalProveedorComponent, {
          data: data,
          header: data.length == 0 ? "Agregar Proveedor" : "Editar Proveedor - " + data.nomcomercial, //'Selección de Cotización de ' +  data.nomcomercial,
          styleClass: 'testDialog',
          closeOnEscape: false,
          closable: true,
          width: '30%'
      });
      refMensaje.onClose.subscribe((rpta: any) => {
        console.log('onClose index',index);
        if (rpta != undefined) {
            const _posAll: number = this.lstPostores.findIndex(((x: { nroindex: number; }) => x.nroindex == index))
            if (_posAll != -1) {
              this.lstPostores.splice(_posAll, 1)
            }
          this.lstPostores.push(rpta.objeto);
          console.log('this.lstPostores',this.lstPostores);
        }
      });
    
      // refMensaje.onClose.subscribe((rpta: any) => {
      //   console.log('onClose mensajeCoti',rpta);
      //   if (rpta != undefined) {
      //     //this.traerUno();
      //   }
      // });
      }


       eliminarCotizacion(data: any) {
      this.confirmationService.confirm({
        key: 'confirm1',
        header: 'Confirmación',
        message:  '¿Desea Eliminar Item ' + '<b>' + data.nomcomercial + '</b>' + '?' ,
        accept: () => {
          if (data.iditempostor > 0) {
            const _posAll: number = this.lstPostores.findIndex((x => x.iditempostor == data.iditempostor))
            if (_posAll != -1) {
            this.lstPostores.splice(_posAll, 1)
            }
        }else{
            const _posAll: number = this.lstPostores.findIndex((x => x.idnvoitem == data.idnvoitem))
            if (_posAll != -1) {
            this.lstPostores.splice(_posAll, 1)
            }
        }
        //this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
        }
    });
    }

    EnviarMail(data:any){
    this.setSpinner(true);
    this.mensajeSpinner = 'Enviando Correo...!';
    
    const obj = {
      emailDestino: data.email1,
    }
    
    this.proyectosService.enviarEmailRequerimiento(obj).subscribe({
      next: (rpta: any) => {      
        this.setSpinner(false);     
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
        this.setSpinner(false);
      },
  });
  }

}
