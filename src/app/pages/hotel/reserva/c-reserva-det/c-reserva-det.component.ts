
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { c_habitacion, constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { map, Subscription } from 'rxjs';
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
import { ReservaService } from '../reserva.service';
import { CmPersonaPaxComponent } from '../cm-persona-pax/cm-persona-pax.component';
import { CmExcTransacReservaComponent } from '../cm-exc-transac-reserva/cm-exc-transac-reserva.component';
import { Menu } from 'primeng/menu';
import { CModalTransacComponent } from 'src/app/pages/compras/modal-trans-registro/modal-transac.component';
import { CMAgregarProductoComponent } from '../cm-agregar-producto/cm-agregar-producto.component';
import { CmRegistrarPagoComponent } from '../cm-registrar-pago/cm-registrar-pago.component';
import { CmRegistrarFacturacionComponent } from '../cm-registrar-facturacion/cm-registrar-facturacion.component';
import { CmAgregarHabitacionComponent } from '../cm-agregar-habitacion/cm-agregar-habitacion.component';

@Component({
  selector: 'app-c-reserva-det',
  templateUrl: './c-reserva-det.component.html',
  styleUrls: ['./c-reserva-det.component.scss']
})
export class CReservaDetComponent implements OnInit, OnDestroy {
  @Input() IA_data: any;
  @ViewChild('menu') menu!: Menu;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  visibleAsiento: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any = FormGroup;
  registerFormCuota!: FormGroup;
  idtipoproyecto: any;
  lstProyectos: any;
  lstCliente: Cliente[] = [];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  submitted = false;
  headerTitle: string = '';
  registerFormCliente: any = FormGroup;
  registerFormContacto: any = FormGroup;
  registerFormPago: any = FormGroup;
  lstMonedas: Moneda[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  montoTotal: number = 0;
  lstContacto: any;
  lstOrigen: any;
  idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  menuItemsAcciones: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnPreliminar: boolean = false;
  verbtnOrden: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  dataCT: any = { id: 0, razonsocial: '', description: '', nommoneda: '', startDate: '', nomcreador: '', tipocambio: '', idlista: '', quotes: [] };
  verCotizacion: boolean = true;
  lstTipo = [
    { name: 'COMPRA', code: 'OC' },
    { name: 'SERVICIO', code: 'OS' }
  ];
  lstTermino: any;
  lstQuotes: any[] = [];
  verAdjunto: boolean = false;
  contactoVisible: boolean = false;
  itemVisible: boolean = false;
  ExcelData: any;
  idtipoprod: any;
  idmarca: any;
  lstMarcas: any;
  lstTipoProducto: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  onlyReadSunat: boolean = true;
  //verReferencia: boolean = false;
  verProyecto: boolean = true;
  lstUnidades: any;
  errorMensaje: string = "";
  lstComprobante: any;
  listaCuotas: any[] = [];
  Cuotas: any;
  lstAsientos: any[] = [];
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
  nrocuotas!: number;
  s_monto!: number;
  s_igv!: number;
  lstSunatTrans: any[] = [];
  lstTipoDetra: any[] = [];
  lstTipoPagoDetra: any[] = [];
  lstTipoRetencion: any[] = [];
  onlyReadMonto: boolean = true;
  lstOrdenC: any;
  verDetraccion: boolean = false;
  lstTransacciones: any[] = [];
  verbtnFacturacion: boolean = false;
  vistaPrincipal: boolean = true;
  dataFacturacion: any;
  listadoPAX: any[] = [];
  selectedDetalle: any[] = [];
  dataPrc: any;
  lstPagos: any[] = [];
  tituloDetalle!: string;
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;
  visXperfil: boolean = true;
  lstEstados: any[] = [
    { codestadofel: 0, nomestadofel: 'TODOS' },
    { codestadofel: 1, nomestadofel: 'ACEPTADO' },
    { codestadofel: 2, nomestadofel: 'ERROR' },
    { codestadofel: 3, nomestadofel: 'EN PROCESO' },
    { codestadofel: 4, nomestadofel: 'ANULADO' },
    { codestadofel: 4, nomestadofel: 'EN PROCESO ANULACIÓN' }
  ];
  dropdownItemsTipNro = [];
  tituloTipoDocumento: string = 'Nro. Documento';
  esExtranjero: boolean = false;
  lsTipoTAM: any[] = [
    {
      codigo: 'D',
      descripcion: 'Días'
    },
    {
      codigo: 'M',
      descripcion: 'Mes'
    }
  ]

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
    private serviceReserva: ReservaService,
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit IA_data : ", this.IA_data);

    this.idOrdenC = this.IA_data.idordencompra;
    this.verbtnFacturacion = this.IA_data.visBtnFacturacion || false;

    this.createFrm();
    this.createFormRegistro();
    this.createFormContacto();
    this.createFormPagos();
    this.listaProyectoTipo();
    this.listaClientes();
    this.listaMonedas();
    this.listarItemsTabla();
    this.listarItemsTablaUnidad();
    this.listarItemsTablaComprobante();
    this.listarPAX();
    this.getListarPagos();
    this.listarTiposDoc();

    this.minimaFechaHasta = this.registerFormRegistro.value.fecemision;
    this.maximaFechaDesde = this.registerFormRegistro.value.fecvencimiento;

    if (this.idOrdenC > 0) {
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto = {
          idCliente: this.idOrdenC,
          codtipoproc: 8, //adjuntos compras
          veracciones: 1
        }
      } else {
        this.dataAdjunto = {
          idCliente: this.idOrdenC,
          codtipoproc: 8,
          veracciones: 0
        }
      }
      this.verAdjunto = true;
      this.traerUno();
      this.listarTransacciones();
    } else {
      this.dataAdjunto = {
        idCliente: 0,
        codtipoproc: 8,
        veracciones: 0
      }
      this.mostrarBotones('NVO');
      //this.getOrigen('OPO');
      //   const newDate = this.addDays(this.serviceUtilitario.obtenerFechaActual(), 30);
      // this.registerFormRegistro.get('fecvencimiento').setValue(newDate);
    }

    if (constantesLocalStorage.idperfil === 11) {
      this.visXperfil = false;
    } else {
      this.visXperfil = true;
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

  createFormPagos() {
    this.registerFormPago = this.formBuilder.group({
      fecini: [{ value: this.serviceUtilitario.obtenerFechaInicioMes(), disabled: false }],
      fecfin: [{ value: this.serviceUtilitario.obtenerFechaFinMes(), disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      idcliente: [{ value: 0, disabled: false }],
      idcentrocosto: [{ value: 0, disabled: false }],
      ind_estado_fel: [{ value: 0, disabled: false }]
    });
  }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: c_habitacion.tipoDocPRC, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd: [{ value: '', disabled: false }],
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
      codtipoorden: [{ value: 'OC', disabled: false }],
      codigonroorden: [{ value: '', disabled: true }],
      nomproyecto: [{ value: '', disabled: false }],
      nrodocumento: [{ value: '', disabled: false }],
      fecemision: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      fecha_ini: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      tc: [{ value: 0, disabled: false }],
      tipodoc_ctb: [{ value: '', disabled: false }],
      nroserie_ctb: [{ value: '', disabled: false }],
      nrodocumento_ctb: [{ value: '', disabled: false }],
      fecvencimiento: [{ value: this.addDays(this.serviceUtilitario.obtenerFechaActual(), 1), disabled: false, }],
      fecha_fin: [{ value: this.addDays(this.serviceUtilitario.obtenerFechaActual(), 1), disabled: false, }],
      nrocuotas: [{ value: 1, disabled: false }],
      porc_detraccion: [{ value: 0, disabled: false }],
      monto_detraccion_mn_CTB: [{ value: 0, disabled: false }],
      s_monto_detraccion_CTB: [{ value: 0, disabled: false }],
      s_monto_valor_venta_CTB: [{ value: 0, disabled: false }],
      s_monto_igv_CTB: [{ value: 0, disabled: false }],
      s_monto_total_CTB: [{ value: 0, disabled: false }],
      montoTotal: [{ value: 0, disabled: false }],
      nrocontrato_ctb: [{ value: null, disabled: false }],
      nroexpediente_ctb: [{ value: null, disabled: false }],
      codunidadejecutora_ctb: [{ value: null, disabled: false }],
      nroprocesoseleccion_ctb: [{ value: null, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      nrodias: [{ value: 1, disabled: false }],
      idordencompra_origen_ctb: [{ value: 0, disabled: false }],
      monto_pen_pago: [{ value: 0, disabled: false }],
      idcentrocosto: [{ value: 225, disabled: false }],
      s_monto_neto_CTB: [{ value: 0, disabled: false }],
      direccion: [{ value: null, disabled: false }],
      fel_sunat_transaction: [{ value: 1, disabled: false }],
      tipo_de_nota_de_credito: [{ value: null, disabled: false }],
      tipo_de_nota_de_debito: [{ value: null, disabled: false }],
      porcretencion: [{ value: 0, disabled: false }],
      monto_retencion: [{ value: 0, disabled: false }],
      detraccion_tipo: [{ value: 0, disabled: false }],
      detraccion_tipo_pago: [{ value: 0, disabled: false }],
      inddetraccion_ctb: [{ value: false, disabled: false }],
      monto_anticipo: [{ value: 0, disabled: false }],
      retencion_tipo: [{ value: 0, disabled: false }],
      retencion_base_imponible: [{ value: 0, disabled: false }],
      indmanualdetraccion: [{ value: false, disabled: false }],
      indsunatreg: [{ value: false, disabled: false }],
      //codctactble:[{ value: '0', disabled: false }],
      idtipodoc: [{ value: '', disabled: false }],

      indtam: [{ value: false, disabled: false }],
      fecingresopais: [{ value: null, disabled: false }],
      tiempopermanencia: [{ value: null, disabled: false }],
      tipopermanencia: [{ value: 'D', disabled: false }],
      codverificaciontam: [{ value: null, disabled: false }]
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

  mostrarBotones(data: any) {
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'CKI':
      case 'REG':
      case 'CFM':
        this.verbtnGrabar = true;
        this.verbtnPreliminar = true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = false;
        break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnPreliminar = false;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.onlyRead = false;
        break;
      case 'CKO':
        this.verbtnGrabar = true;
        this.verbtnPreliminar = true;
        this.verbtnOrden = true;
        this.verbtnAcciones = true;
        this.verItems = true;
        this.onlyRead = false;
        break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnPreliminar = false;
        this.verbtnOrden = true;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
        break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar = true;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
        break;
      case 'PAG':
        this.verbtnGrabar = false;
        this.verbtnPreliminar = true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = true;
        break;
      case 'CFM':
      case 'PCF':
        this.verbtnGrabar = true;
        this.onlyRead = false;
        this.verbtnAcciones = true;
        break;
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnPreliminar = this.idOrdenC === 0 ? true : false;
      this.verbtnOrden = this.idOrdenC === 0 ? false : true;
      this.verbtnAcciones = false;
      this.verItems = false;
      this.onlyRead = true;
    }

  }

  traerUno() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto = {
      idordencompra: this.idOrdenC,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta: any) => {
          if (rpta.length === 0) { return }
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
          this.ordenCompra = rpta.ordencompra[0];
          //this.getOcproveedor(rpta.ordencompra[0].idproveedor); 
          if (rpta.ordencompra[0].items !== undefined) {
            this.lstItemOC = rpta.ordencompra[0].items;
          }
          if (rpta.ordencompra[0].quotes !== undefined) {
            this.lstQuotes = rpta.ordencompra[0].quotes;
          }

          if (rpta.ordencompra[0].cuotas !== undefined) {
            this.listaCuotas = rpta.ordencompra[0].cuotas;
          }

          this.visibleDocument = false;
          this.visibleAsiento = false;

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.esExtranjero = rpta.ordencompra[0].idtipodoc === 'CEX' || rpta.ordencompra[0].idtipodoc === 'PAS';
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
          this.registerFormRegistro.get('fecha_fin')?.setValue(rpta.ordencompra[0].fecha_fin);
          this.registerFormRegistro.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision);
          this.registerFormRegistro.get('fecha_ini')?.setValue(rpta.ordencompra[0].fecha_ini);
          this.registerFormRegistro.get('fecingresopais')?.setValue(rpta.ordencompra[0].fecingresopais);
          this.registerFormRegistro.get('direccion').setValue(rpta.ordencompra[0].direcresumen);
          this.nrocuotas = rpta.ordencompra[0].nrocuotas
          this.getBusquedaRUC();
          this.cargarMenuAcciones(rpta.ordencompra[0].acciones);
          this.setSpinner(false);
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);

        }
      });
    this.$listSubcription.push($cargarOrdenC)
  }

  guardarOC() {

    if (this.validarDatos()) {
      this.setSpinner(false);
      this.messageService.add({ severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
      return;
    }
    if (this.listaCuotas.length > 0) {
      for (let i = 0; i < this.listaCuotas.length; i++) {
        this.listaCuotas[i].nrocuota = i + 1;
        if (this.listaCuotas[i].monto === 0) {
          this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'El monto de la cuota debe ser mayor que cero...' });
          return;
        }
      }
    }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    let fechaingreso;
    let fecemision;
    let fechaIni;
    let fecvencimiento;
    let fechaFin;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecemision = this.registerFormRegistro.value.fecemision;
    fechaIni = this.registerFormRegistro.value.fecha_ini;
    fecvencimiento = this.registerFormRegistro.value.fecvencimiento;
    fechaFin = this.registerFormRegistro.value.fecha_fin;

    if (fechaingreso.toString().length === 10) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));
    }
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));
    }
    if (fechaIni.toString().length === 10) {
      fechaIni = new Date(this.serviceUtilitario.formatFecha(fechaIni));
    }
    if (fecvencimiento.toString().length === 10) {
      fecvencimiento = new Date(this.serviceUtilitario.formatFecha(fecvencimiento));
    }
    if (fechaFin.toString().length === 10) {
      fechaFin = new Date(this.serviceUtilitario.formatFecha(fechaFin));
    }


    for (let i = 0; i < this.lstItemOC.length; i++) {
      if (this.lstItemOC[i].cantidad.toString() === '') {
        this.lstItemOC[i].cantidad = 0;
      }
      if (this.lstItemOC[i].preciocosto.toString() === '') {
        this.lstItemOC[i].preciocosto = 0;
      }
    }

    let retencion_tipo = this.registerFormRegistro.value.retencion_tipo;
    if (!this.registerFormRegistro.value.inddetraccion_ctb) {
      retencion_tipo = 0;
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecemision,
      fecha_ini: fechaIni,
      fecvencimiento,
      fecha_fin: fechaFin,
      tipodoc_ctb: (this.registerFormRegistro.value.tipodoc_ctb).toString(),
      cuotas: this.listaCuotas,
      nrocuotas: this.nrocuotas,
      retencion_tipo: retencion_tipo,
      //detraccion_tipo : detraccion_tipo,
      //detraccion_tipo_pago : detraccion_tipo_pago
    }

    console.log('guardarOC...', objeto);

    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0) {
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idOrdenC === 0) {
            this.idOrdenC = rpta.resultProceso;
            this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);
            this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);

            this.dataAdjunto = {
              idCliente: this.idOrdenC,
              codtipoproc: 8,
              veracciones: 0
            }
            this.verAdjunto = true;
            //agregar una cuota por defecto
            this.traerUno2();

            //preguntar si desea emitir el documento con una cuota
            /*this.confirmationService.confirm({
              key: 'confirm1',
              header: 'Confirmación',
              message: '¿Desea Emitir el Documento con una Cuota...?',
              accept: () => {
                this.guardarOC();
                this.procesarTRX();
              }
            });*/
          } else {
            this.traerUno();
          }


          this.visibleDocument = false;
          this.visibleAsiento = false;
        } else {
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

  traerUno2() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto = {
      idordencompra: this.idOrdenC,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta: any) => {
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
          this.ordenCompra = rpta.ordencompra[0];
          //this.getOcproveedor(rpta.ordencompra[0].idproveedor); 
          if (rpta.ordencompra[0].items !== undefined) {
            this.lstItemOC = rpta.ordencompra[0].items;
          }
          if (rpta.ordencompra[0].quotes !== undefined) {
            this.lstQuotes = rpta.ordencompra[0].quotes;
          }
          if (rpta.ordencompra[0].cuotas !== undefined) {
            this.listaCuotas = rpta.ordencompra[0].cuotas;
          }

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
          this.registerFormRegistro.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision);
          this.nrocuotas = rpta.ordencompra[0].nrocuotas
          this.setSpinner(false);
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
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
      complete: () => { },
    });
    this.$listSubcription.push($procesarTrx)
  }

  servicioGenerico() {
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
    let tiporol = "CLI";
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

  listaProyectoTipo() {
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
        this.lstOrigen = rpta.filter((x: { idtipoproyecto: number; }) => x.idtipoproyecto === 1);
        const objeto = {
          idtipoproyecto: 4,
          nomtipoproyecto: 'Otros',
          codproceso: 'OTR'
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

  getItem(data: any, index: number) {
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

      console.log('onClose', rpta);
      if (rpta != undefined) {
        const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
        if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
        }
        console.log('getItem', rpta.objeto);
        this.lstItemOC.push(rpta.objeto);
        console.log('this.lstItemOC', this.lstItemOC);
      }
    });
  }

  eliminarItem(data: any) {
    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message: '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?',
      accept: () => {
        if (data.idordencompra > 0) {
          const _posAll: number = this.lstItemOC.findIndex((x => x.idordencompraitem == data.idordencompraitem))
          if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
          }
        } else {
          const _posAll: number = this.lstItemOC.findIndex((x => x.idnvoitem == data.idnvoitem))
          if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
          }
        }
        if (this.lstItemOC.length === 0) {
          this.registerFormRegistro.get('nrocuota')?.setValue(0);
          this.nrocuotas = 0;
          this.listaCuotas = [];

          this.registerFormRegistro.get('s_monto_valor_venta_CTB')?.setValue(0);
          this.registerFormRegistro.get('s_monto_igv_CTB')?.setValue(0);
          this.registerFormRegistro.get('s_monto_total_CTB')?.setValue(0);
          this.registerFormRegistro.get('monto_detraccion_mn_CTB')?.setValue('');
          this.registerFormRegistro.get('monto_pen_pago')?.setValue(0);

          /*ACTUALIZANDO MONTOS TOTALES DE LOS ITEMS*/
          this.s_monto = 0;
          this.s_igv = 0;
          this.montoTotal = 0;
        } else {
        }

      }
    });
  }

  NuevoPersona(itemDocumento?: any) {
    const objet = {
      idrolpersona: 'PRO',
      ...itemDocumento
    }

    const refItem = this.dialogService.open(CModalPersonaComponent, {

      data: objet,
      header: "Agregar Cliente",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {

      console.log('onClose', rpta);
      if (rpta != undefined) {
        this.listaClientes();
        this.registerFormRegistro.get('nrodocumento').setValue(parseInt(rpta.objeto.nrodocumento));
        this.registerFormRegistro.get('idproveedor').setValue(parseInt(rpta.objeto.idpersona));
        this.registerFormRegistro.get('direccion').setValue(rpta.objeto.direcresumen);
      }
    });
  }

  vistaPreliminar() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Vista Preliminar...!';

    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: c_habitacion.tipoDocPRC,
      idplantilla: 0
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
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

  importarPlantilla() {
    this.listarTipoProducto();
    this.listarMarcas();
    this.idtipoprod = null;
    this.idmarca = null;
    this.verImportar = true;
    this.itemVisible = true;
  }

  disabelImportar() {
    console.log(this.idtipoprod, this.idmarca)
    if (this.idtipoprod != null && this.idmarca != null) {
      this.verImportar = false;
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

  validarDatos(): boolean {
    let _error = false;
    this.errorMensaje = "";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (!_error && (this.registerFormRegistro.value.nrodocumento === null || this.registerFormRegistro.value.nrodocumento === '')) {
      this.errorMensaje = "Ingresar RUC...!";
      _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.idproveedor === null || this.registerFormRegistro.value.idproveedor === '')) {
      this.errorMensaje = "Buscar Proveedor por RUC...!";
      _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.tipodoc_ctb === '' || this.registerFormRegistro.value.tipodoc_ctb === null)) {
      this.errorMensaje = "Seleccionar Tipo de Documento...!";
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

    if (!_error && (this.registerFormRegistro.value.codformapago === '' || this.registerFormRegistro.value.codformapago === null)) {
      this.errorMensaje = "Ingresar Forma de Pago...!";
      _error = true;
    }

    // if (!_error && (this.registerFormRegistro.value.porc_detraccion === '' || this.registerFormRegistro.value.porc_detraccion === null))
    //   {
    //       this.errorMensaje="Ingresar % Detracción...!";
    //       _error = true;
    //   }

    if (!_error && this.registerFormRegistro.value.idmoneda === null) {
      this.errorMensaje = "Seleccionar Moneda...!";
      _error = true;
    }

    if (this.registerFormRegistro.value.idmoneda !== 1) {
      if (!_error && (this.registerFormRegistro.value.tc === null || this.registerFormRegistro.value.tc === '' || this.registerFormRegistro.value.tc === 0)) {
        this.errorMensaje = "Ingresar Tipo Cambio...!";
        _error = true;
      }
    }

    if (!_error && this.registerFormRegistro.value.fel_sunat_transaction === null) {
      this.errorMensaje = "Seleccionar Transacción...!";
      _error = true;
    }


    if (!_error && this.registerFormRegistro.value.inddetraccion_ctb) {
      if (!_error && (this.registerFormRegistro.value.porc_detraccion === null
        || this.registerFormRegistro.value.porc_detraccion === ''
        || this.registerFormRegistro.value.porc_detraccion === 0)) {
        this.errorMensaje = "Ingresar Porcentaje Detracción...!";
        _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.detraccion_tipo === null || this.registerFormRegistro.value.detraccion_tipo === 0)) {
        this.errorMensaje = "Seleccionar Tipo Detracción...!";
        _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.detraccion_tipo_pago === null || this.registerFormRegistro.value.detraccion_tipo_pago === 0)) {
        this.errorMensaje = "Seleccionar Tipo Pago...!";
        _error = true;
      }
    }

    if (!_error && this.registerFormRegistro.value.fel_sunat_transaction === 4) {
      if (!_error && (this.registerFormRegistro.value.monto_anticipo === null
        || this.registerFormRegistro.value.monto_anticipo === ''
        || this.registerFormRegistro.value.monto_anticipo === 0)) {
        this.errorMensaje = "Ingresar Monto Anticipo...!";
        _error = true;
      }
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
    if (!_error && this.registerFormRegistro.value.indtam) {
      if (!_error && this.registerFormRegistro.value.fecingresopais === null) {
        this.errorMensaje = "Seleccionar Fecha Ingreso País...!";
        _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.tiempopermanencia === null || this.registerFormRegistro.value.tiempopermanencia === 0)) {
        this.errorMensaje = "Ingresar Tipo Permanencia...!";
        _error = true;
      }

      if (!_error && this.registerFormRegistro.value.tipopermanencia === null) {
        this.errorMensaje = "Seleccionar Tipo Permanencia...!";
        _error = true;
      }

      if (!_error && this.registerFormRegistro.value.codverificaciontam === null) {
        this.errorMensaje = "Ingresar Codigo de Verificación...!";
        _error = true;
      }

    }

    return _error;
  }

  getValidarNroDocumento(): boolean {
    const _idtipodoc = this.registerFormRegistro.get('idtipodoc')?.value;
    const _nro = this.registerFormRegistro.get('nrodocumento')?.value;

    switch (_idtipodoc) {
      case 'DNI':
        if (_nro.length !== 8) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'DNI no Valido...' });
          return false;
        }
        break;
      case 'RUC':
        if (_nro.length !== 11) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'RUC no Valido...' });
          return false;
        }
        break;
      case 'CEX':
        if (_nro.length < 12 || _nro.length > 16) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Carnet de Extranjería no Valido...' });
          return false;
        }
        break;
      case 'PAS':
        if (_nro.length < 8 || _nro.length > 16) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Pasaporte no Valido...' });
          return false;
        }
        break;
    }
    return true;
  }

  getBusquedaRUC() {
    const _idtipodoc = this.registerFormRegistro.get('idtipodoc')?.value;
    const _nro = this.registerFormRegistro.get('nrodocumento')?.value;
    console.log('getBusquedaRUC...', _nro);

    if (_nro === null || _nro === '') {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Ingresar Ruc...' });
      return;
    }
    console.log('length...', _nro.length);
    if (!this.getValidarNroDocumento()) {
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
        if (rpta.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Cliente no encontrado...' });
          this.NuevoPersona({ idtipodoc: _idtipodoc, nroDocumento: _nro });
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
        this.lstComprobante = rpta.filter((x: { codsunat: number; }) => (x.codsunat === 1 || x.codsunat === 2));
        //this.lstComprobante = rpta;
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
  }

  editarRegistro(data: any) {
    this.mensajeSpinner = "Actualizando...";
    console.log('editarRegistro...', data);
  }

  changeFechaDesde(event: Date) {
    this.minimaFechaHasta = event;
    const { fecha_ini, nrodias, fecha_fin } = this.registerFormRegistro.controls;

    const emision = fecha_ini.value;
    const vencimiento = this.addDays(emision, 1);
    const diferenci = this.calcularDiferenciaDias(emision, vencimiento);

    fecha_fin?.setValue(vencimiento);
    nrodias?.setValue(diferenci);
  }

  changeFechaHasta(event: Date) {
    this.maximaFechaDesde = event;
    const { fecha_ini, nrodias } = this.registerFormRegistro.controls;

    const vencimiento = this.parsearFecha(event);
    const _fecemision = this.parsearFecha(fecha_ini.value);
    const diferenciaEnDias = this.calcularDiferenciaDias(_fecemision, vencimiento);

    nrodias?.setValue(diferenciaEnDias);
  }

  private parsearFecha(value: any): Date {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    if (typeof value === 'string' && value.length === 10) {
      return new Date(this.serviceUtilitario.formatFecha(value));
    }
    return new Date(value);
  }

  private calcularDiferenciaDias(fechaInicio: Date, fechaFin: Date): number {
    return this.serviceUtilitario.diferenciaEnDias(fechaInicio, fechaFin);
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  addDiasFec() {
    const { fecha_ini, nrodias, fecha_fin } = this.registerFormRegistro.controls;
    if (!nrodias.value || Number.parseInt(nrodias.value) === 0) {
      nrodias?.setValue(1);
      const _fechaSalida = this.addDays(fecha_ini.value, nrodias.value);
      fecha_fin?.setValue(_fechaSalida);
      return;
    }

    let _fecemision = fecha_ini.value;
    if (_fecemision.toString().length === 10) {
      _fecemision = new Date(this.serviceUtilitario.formatFecha(_fecemision));
    }

    const fecha = this.addDays(_fecemision, Number.parseInt(nrodias.value));
    fecha_fin?.setValue(fecha);
  }

  setearDias(ven: any, emi: any) {
    let vencimiento = new Date(this.serviceUtilitario.formatFecha(ven));
    let emision = new Date(this.serviceUtilitario.formatFecha(emi));
    let diff = 0;
    if (emision.getTime() > vencimiento.getTime()) {
      diff = emision.getTime() - vencimiento.getTime()
    } else {
      diff = vencimiento.getTime() - emision.getTime()
    }
    this.registerFormRegistro.get('nrodias')?.setValue(diff / (1000 * 60 * 60 * 24));
  }

  getDatos(dato: any) {
    console.log('getDatos...', dato);
    let provee = this.lstCliente.filter((x: { idcliente: number; }) => x.idcliente === dato);
    this.registerFormRegistro.get('nrodocumento')?.setValue(provee[0].nrodocumento);
    this.registerFormRegistro.get('direccion')?.setValue(provee[0].direcresumen);
  }

  listarTransacciones() {
    const $lstTransacciones = this.proyectosService.listarTrasacciones(this.idOrdenC).subscribe({
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

  listarPAX() {
    console.log("data entrada: ", this.IA_data);

    const objeto = {
      idreserva: this.IA_data.idordencompra,
      idprod: 0,
      idusuario: constantesLocalStorage.idusuario,
      indvig: true
    }
    const $listarPAX = this.serviceReserva.listarPAX(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta listarPAX: ', rpta);
          this.listadoPAX = rpta;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listarPAX)
  }

  eliminaPAX(item: any) {
    console.log("eliminaPAX: ", item);

    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message: '¿Desea Eliminar Item ' + '<b>' + item.razonsocial + '</b>' + '?',
      accept: () => {
        const objeto = {
          iditempax: item.iditempax,
          idreserva: item.idreserva,
          idpersona: item.idpersona,
          idprod: 0,
          idusuario: constantesLocalStorage.idusuario,
        }

        const $eliminarPaxDel = this.serviceReserva.eliminarPaxDel(objeto)
          .subscribe({
            next: (rpta: any) => {
              this.setSpinner(false);
              console.log('rpta eliminarPaxDel: ', rpta);
              this.serviceSharedApp.messageToast({
                severity: rpta.resultProceso === "0" ? 'success' : 'info',
                summary: rpta.resultProceso === "0" ? 'Exito' : 'Aviso...!',
                detail: rpta.mensaje
              });
              this.listarPAX();
            },
            error: (err) => {
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
            },
            complete: () => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($eliminarPaxDel)
      }
    });
  }

  clientePAX() {
    const objet = {
      idreserva: this.IA_data.idordencompra,
      idprod: 0,
      idrolpersona: 'PRO'
    }

    const refItem = this.dialogService.open(CmPersonaPaxComponent, {

      data: objet,
      header: "Agregar Cliente PAX",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      console.log('onClose', rpta);
      if (rpta != undefined) {
        this.listarPAX();
      }
    });
  }

  getListarPagos() {
    const { idordencompra: iddocumentoprc_origen } = this.IA_data;
    console.log("iddocumentoprc_origen recibido: ", iddocumentoprc_origen);

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.registerFormPago.value,
      idtipodocprc: c_habitacion.tipoDocPRC,
      iddocumentoprc_origen
    }
    console.log("objeto recibido: ", objeto);
    const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);
          if (rpta.length === 0) { return }
          this.lstPagos = rpta.ordenescompra
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }

  pagarItemDetalle() {
    console.log("lstItemOC : ", this.lstItemOC);
    console.log("selectedDetalle : ", this.selectedDetalle);

    if (this.selectedDetalle.length === 0) {
      this.messageService.clear();
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Seleccionar al menos un item...' });
      return
    }

    const { idordencompra } = this.IA_data;
    const { idproveedor, idmoneda } = this.registerFormRegistro.getRawValue();
    console.log("lstCliente : ", this.lstCliente);
    const nombreCliente = this.lstCliente.find((x: { idcliente: number; }) => x.idcliente === idproveedor)?.razonsocial;
    const simboloMoneda = this.lstMonedas.find((x: { idmoneda: number; }) => x.idmoneda === idmoneda)?.simbmoneda;

    const data = {
      idordencompra,
      nombreCliente,
      fecha: this.serviceUtilitario.obtenerFechaFormateadoDMA(),
      totalPagar: this.montoTotal,
      idproveedor,
      idmoneda,
      simboloMoneda,
      idordencompraitemArray: this.selectedDetalle.map((x: { idordencompraitem: any; }) => x.idordencompraitem)
    }
    console.log("selectedDetalle data : ", data);

    /*this.ordenHabitacion.idtrx = item.idtrx;
    this.ordenHabitacion.idoperacion = item.idnrooperacion;
    this.ordenHabitacion.idoperacion_item = item.idnrooperacion_item;*/
    //console.log('onAccion', item);
    //const ref = this.dialogService.open(CmExcTransacReservaComponent, {
    const ref = this.dialogService.open(CmRegistrarPagoComponent, {
      data, //this.ordenHabitacion,
      header: 'Registrar Pago', //+ ' - ' + this.ordenHabitacion.nomHabitacion,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe((rpta: any) => {
      if (!rpta) { return; }
    });
  }

  onVer(data: any) {
    console.log("onVer data : ", data);

    this.dataPrc = {
      idordencompra: data.idordencompra,
      idproveedor: data.idproveedor,
      paramReg: 'V'
    }
    this.tituloDetalle = "Ver Factura N° " + data.nrofactura;
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  onEditar(data: any) {
    console.log("onEditar data : ", data);
    this.dataPrc = {
      idordencompra: data.idordencompra,
      idproveedor: data.idproveedor,
      paramReg: 'E'
    }
    this.tituloDetalle = "Editar Factura N° " + data.nrofactura;
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  onVerDetalle(data: any) {
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Detalle...!';

    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      iddocumentoprc: data.idordencompra,
      codtipoprc: 6,
      idplantilla: 0
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);

        const mediaType = 'application/pdf';
        const blob = new Blob([rpta.body], { type: mediaType });
        const filename = 'DET_FACT_VENTA_' + data.nrofactura;

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

  cargarMenuAcciones(data: any) {
    this.menuItemsAcciones = [];
    data.forEach((item: any) => {
      this.menuItemsAcciones.push({
        label: item.nomtrx,
        icon: 'pi pi-cog',
        command: () => this.onAccionAcciones(item)
      })
    });
  }

  onAccionAcciones(item: any) {
    this.ordenCompra.idtrx = item.idtrx;
    const ref = this.dialogService.open(CmExcTransacReservaComponent, {
      data: this.ordenCompra,
      header: item.nomtrx,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    ref.onClose.subscribe(() => {
      this.traerUno();
      this.listarTransacciones();
    });
  }

  toggleMenu(event: Event, data: any) {
    if (data.acciones) {
      this.cargarMenu(data.acciones);
      this.ordenCompra = data;
      this.menu.toggle(event);
    }
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
    this.guardarOCFacturacion(item);
  }

  guardarOCFacturacion(item: any) {
    let _fechaingreso;
    let _fecemision;
    let _fecvencimiento;
    _fechaingreso = this.ordenCompra.fechaingreso;
    _fecemision = this.ordenCompra.fecemision;
    _fecvencimiento = this.ordenCompra.fecvencimiento;

    if (_fechaingreso.toString().length === 10) {
      _fechaingreso = new Date(this.serviceUtilitario.formatFecha(_fechaingreso));
    }
    if (_fecemision.toString().length === 10) {
      _fecemision = new Date(this.serviceUtilitario.formatFecha(_fecemision));
    }
    if (_fecvencimiento.toString().length === 10) {
      _fecvencimiento = new Date(this.serviceUtilitario.formatFecha(_fecvencimiento));
    }

    this.ordenCompra.fechaingreso = _fechaingreso;
    this.ordenCompra.fecemision = _fecemision;
    this.ordenCompra.fecvencimiento = _fecvencimiento;
    this.ordenCompra.tipodoc_ctb = (this.ordenCompra.tipodoc_ctb).toString();

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjProcesando;

    this.ordencompraService.ordenCompraprc(this.ordenCompra).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0) {
          this.ordenCompra.idtrx = item.idtrx;
          const ref = this.dialogService.open(CModalTransacComponent, {
            data: this.ordenCompra,
            header: item.nomtrx,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '40%'
          });

          ref.onClose.subscribe(() => {
            this.getListarPagos();
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
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
      complete: () => {
      },
    });
  }

  emitirDocumento(data: any) {
    this.confirmationService.confirm({
      key: 'confirm2',
      header: 'Confirmación',
      message: '¿Estás seguro de Enviar a SUNAT?...',
      accept: () => {
        this.setSpinner(true);
        this.mensajeSpinner = "Enviando...!"

        const objeto = {
          codproceso: 0,
          idusuario: constantesLocalStorage.idusuario,
          idordendocumento: data.idordencompra,
        }

        const $procesarTrx = this.proyectosService.emitirDocumento(objeto).subscribe({
          next: (rpta: any) => {
            console.log('emitirDocumento', rpta);
            this.setSpinner(false);
            this.getListarPagos();

            if (rpta.aceptada_por_sunat) {
              this.messageService.add({ severity: 'info', summary: 'Aviso', detail: rpta.sunat_description });
              return;
            }

            this.messageService.add({ severity: 'error', summary: 'Error', detail: rpta.errors });
          },
          error: (err) => {
            this.setSpinner(false);
            console.error('error : ', err);
            this.serviceSharedApp.messageToast();
          },
          complete: () => {
            this.setSpinner(false);
          },
        });
        this.$listSubcription.push($procesarTrx)
      }
    });
  }

  getSeverity(data: any) {
    let color;
    switch (data) {
      case 0:
        color = 'primary'
        break;
      case 1:
        color = 'success'
        break;
      case 2:
        color = 'danger'
        break;
      case 3:
        color = 'warning'
        break;
      case 4:
        color = 'danger'
        break;
      case 5:
        color = 'warning'
        break;
    }
    return color;
  }

  getBackFactura() {
    this.vistaLista = true;
    this.visDetalle = false;
    this.visQuote = false;
  }

  listarTiposDoc() {
    const documentosValidos: string[] = ['DNI', 'RUC', 'CEX', 'PAS'];
    const $listartipodocumentotablasunat = this.serviceReserva.listartipodocumentotablasunat('X')
      .pipe(
        map((rpta: any) => {
          return rpta.filter((item: any) => item.idtipodoc && documentosValidos.includes(item.idtipodoc));
        })
      )
      .subscribe({
        next: (rpta: any) => {
          console.log('rpta listartipodocumentotablasunat: ', rpta);
          this.dropdownItemsTipNro = rpta;
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { }
      });
    this.$listSubcription.push($listartipodocumentotablasunat)
  }

  cambioTipoDoc(dato: any) {
    console.log('cambioTipoDoc...', dato);

    switch (dato) {
      case 'DNI':
        this.esExtranjero = false;
        this.tituloTipoDocumento = 'Nro. Documento de Identidad (DNI)';
        this.registerFormRegistro.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.registerFormRegistro.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'RUC':
        this.esExtranjero = false;
        this.tituloTipoDocumento = 'Número de RUC';
        this.registerFormRegistro.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
        this.registerFormRegistro.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'CEX':
        this.esExtranjero = true;
        this.tituloTipoDocumento = 'Número de Carné de Extranjería (CEX)';
        this.registerFormRegistro.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(16)]);
        this.registerFormRegistro.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'PAS':
        this.esExtranjero = true;
        this.tituloTipoDocumento = 'Número de Pasaporte (PAS)';
        this.registerFormRegistro.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
        this.registerFormRegistro.get('nrodocumento')?.updateValueAndValidity();
        break;
    }

    this.changeAplicaTAM(false);
  }

  getAgregarProdHabit(tipoProceso: string) {
    const data: any = {
      nroindex: 0,
      idordencompra: this.idOrdenC,
      origenreg: 'RV',
      idalmacen: 0,
      tipoProceso
    }
    console.log('CMAgregarProductoComponent', data);
    const refItem = this.dialogService.open(CMAgregarProductoComponent, {
      data,
      header: "Agregar Producto " + this.idOrdenC,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {

      console.log('onClose', rpta);
      if (rpta != undefined) {
        /*const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == 0))
        if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
        }*/
        console.log('getAgregarProducto', rpta.data);
        const dataOC = {
          idordencompraitem: 0,
          idprod: rpta.data.idprod,
          codproducto: rpta.data.codproducto,
          descripcion: rpta.data.despro,
          idunidad: 130,
          nomunidad: "UNIDAD",
          preciocosto: rpta.data.valorunit,
          cantidad: rpta.data.cantidad,
          preciocostototal: rpta.data.valorunit * rpta.data.cantidad,
          idtipoprod: rpta.data.idtipoprod,
          precioventa: 0,
          precioventatotal: 0,
          preprofit: 0,
          idnvoitem: 0,
          nroindex: 0,
          nromeses: 0,
          rutaubicacion: '',
          coptipoexistencia: '',
          nomtipoexistencia: '',
          idfamilia: rpta.data.idfamilia,
          idmarca: rpta.data.idmarca,
          idsubfamilia: rpta.data.idsubfamilia,
          modelo: rpta.data.modelo,
          nomfamilia: rpta.data.nomfamilia,
          nommarca: rpta.data.nommarca,
          nomsubfamilia: rpta.data.nomsubfamilia,
          preciovenmax: rpta.data.preciovenmax,
          preciovenmin: rpta.data.preciovenmin,
          serialnumber: rpta.data.serialnumber,
          valorunit: rpta.data.valorunit,
        }
        this.lstItemOC.push(dataOC);
        console.log('this.lstItemOC', this.lstItemOC);
      }
    });
  }

  getFacturacion() {
    console.log("lstItemOC : ", this.lstItemOC);
    console.log("selectedDetalle : ", this.selectedDetalle);

    if (this.selectedDetalle.length === 0) {
      this.messageService.clear();
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Seleccionar al menos un item...' });
      return
    }

    const { idordencompra } = this.IA_data;
    const { idproveedor, idmoneda } = this.registerFormRegistro.getRawValue();
    console.log("lstCliente : ", this.lstCliente);
    /*const nombreCliente = this.lstCliente.find((x: { idcliente: number; }) => x.idcliente === idproveedor)?.razonsocial;
    const simboloMoneda = this.lstMonedas.find((x: { idmoneda: number; }) => x.idmoneda === idmoneda)?.simbmoneda;*/

    /*const data = {
      idordencompra,
      nombreCliente,
      fecha: this.serviceUtilitario.obtenerFechaFormateadoDMA(),
      totalPagar: this.montoTotal,
      idproveedor,
      idmoneda,
      simboloMoneda,
      idordencompraitemArray: this.selectedDetalle.map((x: { idordencompraitem: any; }) => x.idordencompraitem)
    }*/
    const data = {
      ...this.registerFormRegistro.getRawValue(),
      idordencompra,
      detalleCompra: this.selectedDetalle,
      s_monto: this.s_monto,
      s_igv: this.s_igv,
      montoTotal: this.montoTotal,
    }
    console.log("selectedDetalle data : ", data);

    const ref = this.dialogService.open(CmRegistrarFacturacionComponent, {
      data, //this.ordenHabitacion,
      header: 'Registrar Facturación',
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%'
    });

    ref.onClose.subscribe((rpta: any) => {
      if (!rpta) { return; }
    });
  }

  changeAplicaTAM(value: boolean) {
    if (value) {
      this.registerFormRegistro.get('fecingresopais')?.enable();
      this.registerFormRegistro.get('tiempopermanencia')?.enable();
      this.registerFormRegistro.get('tipopermanencia')?.enable();
      this.registerFormRegistro.get('codverificaciontam')?.enable();

      this.registerFormRegistro.get('fecingresopais')?.setValidators([Validators.required]);
      this.registerFormRegistro.get('tiempopermanencia')?.setValidators([Validators.required]);
      this.registerFormRegistro.get('tipopermanencia')?.setValidators([Validators.required]);
      this.registerFormRegistro.get('codverificaciontam')?.setValidators([Validators.required]);

    } else {
      this.registerFormRegistro.get('fecingresopais')?.clearValidators();
      this.registerFormRegistro.get('tiempopermanencia')?.clearValidators();
      this.registerFormRegistro.get('tipopermanencia')?.clearValidators();
      this.registerFormRegistro.get('codverificaciontam')?.clearValidators();

      this.registerFormRegistro.get('fecingresopais')?.reset();
      this.registerFormRegistro.get('tiempopermanencia')?.reset();
      this.registerFormRegistro.get('tipopermanencia')?.reset();
      this.registerFormRegistro.get('codverificaciontam')?.reset();

      this.registerFormRegistro.get('fecingresopais')?.disable();
      this.registerFormRegistro.get('tiempopermanencia')?.disable();
      this.registerFormRegistro.get('tipopermanencia')?.disable();
      this.registerFormRegistro.get('codverificaciontam')?.disable();
    }

    this.registerFormRegistro.get('fecingresopais')?.updateValueAndValidity();
    this.registerFormRegistro.get('tiempopermanencia')?.updateValueAndValidity();
    this.registerFormRegistro.get('tipopermanencia')?.updateValueAndValidity();
    this.registerFormRegistro.get('codverificaciontam')?.updateValueAndValidity();
  }

  getAsignarHabit(){
    const { fecha_ini, fecha_fin } = this.registerFormRegistro.getRawValue();
    const data: any = {
      nroindex: 0,
      idordencompra: this.idOrdenC,
      origenreg: 'RV',
      idalmacen: 0,
      fecha_ini,
      fecha_fin
    }
    console.log('CmAgregarHabitacionComponent', data);
    const refItem = this.dialogService.open(CmAgregarHabitacionComponent, {
      data,
      header: "Asignar Habitacion " + this.idOrdenC,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      console.log('onClose', rpta);
      if (rpta != undefined) {
        console.log('getAsignarHabit', rpta.data);
        const dataOC = {
          idordencompraitem: 0,
          idprod: rpta.data.idprod,
          codproducto: rpta.data.codproducto,
          descripcion: rpta.data.despro,
          idunidad: 130,
          nomunidad: "UNIDAD",
          preciocosto: rpta.data.valorunit,
          cantidad: rpta.data.cantidad,
          preciocostototal: rpta.data.valorunit * rpta.data.cantidad,
          idtipoprod: rpta.data.idtipoprod,
          precioventa: 0,
          precioventatotal: 0,
          preprofit: 0,
          idnvoitem: 0,
          nroindex: 0,
          nromeses: 0,
          rutaubicacion: '',
          coptipoexistencia: '',
          nomtipoexistencia: '',
          idfamilia: rpta.data.idfamilia,
          idmarca: rpta.data.idmarca,
          idsubfamilia: rpta.data.idsubfamilia,
          modelo: rpta.data.modelo,
          nomfamilia: rpta.data.nomfamilia,
          nommarca: rpta.data.nommarca,
          nomsubfamilia: rpta.data.nomsubfamilia,
          preciovenmax: rpta.data.preciovenmax,
          preciovenmin: rpta.data.preciovenmin,
          serialnumber: rpta.data.serialnumber,
          valorunit: rpta.data.valorunit,
        }
        this.lstItemOC.push(dataOC);
        console.log('this.lstItemOC', this.lstItemOC);
      }
    });
  }

}