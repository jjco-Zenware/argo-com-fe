import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, map, tap, catchError, of, Subscription } from 'rxjs';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ReservaService } from '../reserva.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { CModalPersonaComponent } from 'src/app/pages/compras/registro-compra/modalPersona/c-modalpersona.component';

@Component({
  selector: 'app-cm-registrar-facturacion',
  templateUrl: './cm-registrar-facturacion.component.html',
  styleUrls: ['./cm-registrar-facturacion.component.scss']
})
export class CmRegistrarFacturacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos: any = FormGroup;
  data!: any;
  lstCliente: Cliente[] = [];
  lstComprobante: any;
  lstMonedas: Moneda[] = [];
  lstFormaPago: any;
  minimaFechaDesde!: Date;
  maximaFechaDesde!: Date; //= this.serviceUtilitario.obtenerFechaFinMesTotal();
  minimaFechaHasta!: Date;
  maximaFechaHasta!: Date; //= this.serviceUtilitario.obtenerFechaFinMesTotal();
  lstSunatTrans: any[] = [];
  lstCategoriaDoc: any;
  verDetraccion: boolean = false;
  lstTipoRetencion: any[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  lstCuotas = [
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '4', code: 4 },
    { name: '5', code: 5 }
  ];
  nrocuotas!: number;
  listaCuotas: any[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  idOrdenC: number = 0;
  errorMensaje: string = "";
  dropdownItemsTipNro = [];
  tituloTipoDocumento: string = 'Nro. Documento';
  esExtranjero: boolean = false;
  s_monto!: number;
  s_igv!: number;
  montoTotal: number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly formBuilder: FormBuilder,
    private readonly proyectosService: ProyectosService,
    private readonly messageService: MessageService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceUtilitario: UtilitariosService,
    public readonly dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly ordencompraService: OrdencompraService,
    private readonly contabilidadService: ContabilidadService,
    private readonly comprasService: ComprasService,
    private readonly serviceReserva: ReservaService
  ) { }

  ngOnInit(): void {
    //this.idOrdenC = this.IA_data.idordencompra;
    this.data = this.config.data;
    console.log("data : ", this.data);

    this.createFrm();
    this.procesarDataInicial();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 6, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd: [{ value: '', disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      idordencompra: [{ value: this.idOrdenC, disabled: false }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: '', disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
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
      tc: [{ value: 0, disabled: false }],
      tipodoc_ctb: [{ value: '', disabled: false }],
      nroserie_ctb: [{ value: '', disabled: false }],
      nrodocumento_ctb: [{ value: '', disabled: false }],
      fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
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
      idcategoria: [{ value: null, disabled: false }],
      idtipodoc: [{ value: '', disabled: false }],
    });
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  procesarDataInicial() {
    this.setSpinner(true);
    forkJoin([
      this.listarTiposDoc(),
      this.listaClientes(),
      this.listarItemsTablaComprobante(),
      this.listaMonedas(),
      this.listarCategoriaDoc(),
      this.listarItemsTabla(),
      this.listarTipoRetencion(),
    ]).subscribe({
      next: () => {
        const { detalleCompra, ...itemFrmDatos } = this.data;
        this.frmDatos.patchValue(itemFrmDatos);
        this.lstItemOC = detalleCompra;
        this.s_monto = itemFrmDatos.s_monto;
        this.s_igv = itemFrmDatos.s_igv;
        this.montoTotal = itemFrmDatos.montoTotal;
        this.frmDatos.get('fechaingreso')?.setValue(this.serviceUtilitario.obtenerFechaActual());
        this.frmDatos.get('fecemision')?.setValue(this.serviceUtilitario.obtenerFechaActual());
        this.frmDatos.get('fecvencimiento')?.setValue(this.serviceUtilitario.obtenerFechaActual());
        this.minimaFechaHasta = this.parsearFecha(this.frmDatos.value.fecemision);
        this.maximaFechaDesde = this.parsearFecha(this.frmDatos.value.fecvencimiento);
        this.setSpinner(false);
      },
      error: (err:any) => {
        this.setSpinner(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al cargar los datos.' });
      }
    });
  }

  listaMonedas() {
    return this.proyectosService.obtenerMonedas().pipe(
      tap((rpta: any) => {
        this.lstMonedas = rpta;
      }),
      catchError((err) => {
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  listarTiposDoc() {
    const documentosValidos: Set<string> = new Set(['DNI', 'RUC', 'CEX', 'PAS']);
    return this.serviceReserva.listartipodocumentotablasunat('X').pipe(
      map((rpta: any) => rpta.filter((item: any) => item.idtipodoc && documentosValidos.has(item.idtipodoc))),
      tap((rpta: any) => {
        this.dropdownItemsTipNro = rpta;
        this.frmDatos.get('idtipodoc')?.setValue('DNI');
      }),
      catchError((err) => {
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  listarItemsTabla() {
    return this.comprasService.obtenerItemsTabla(114).pipe(
      tap((rpta: any) => {
        this.lstFormaPago = rpta;
      }),
      catchError((err) => {
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  listarItemsTablaComprobante() {
    return this.contabilidadService.listarItemsTablaSunat(2).pipe(
      map((rpta: any) => rpta.filter((x: { codsunat: number; }) => (x.codsunat === 1 || x.codsunat === 2))),
      tap((filtered: any) => {
        this.lstComprobante = filtered;
      }),
      catchError((err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  cambioTipoDoc(dato: any) {
    console.log('cambioTipoDoc...', dato);

    switch (dato) {
      case 'DNI':
        this.esExtranjero = false;
        this.tituloTipoDocumento = 'Nro. Documento de Identidad (DNI)';
        this.frmDatos.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        this.frmDatos.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'RUC':
        this.esExtranjero = false;
        this.tituloTipoDocumento = 'Número de RUC';
        this.frmDatos.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
        this.frmDatos.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'CEX':
        this.esExtranjero = true;
        this.tituloTipoDocumento = 'Número de Carné de Extranjería (CEX)';
        this.frmDatos.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(16)]);
        this.frmDatos.get('nrodocumento')?.updateValueAndValidity();
        break;
      case 'PAS':
        this.esExtranjero = true;
        this.tituloTipoDocumento = 'Número de Pasaporte (PAS)';
        this.frmDatos.get('nrodocumento')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
        this.frmDatos.get('nrodocumento')?.updateValueAndValidity();
        break;
    }
  }

  getDatos(dato: any) {
    console.log('getDatos...', dato);
    let provee = this.lstCliente.filter((x: { idcliente: number; }) => x.idcliente === dato);
    this.frmDatos.get('nrodocumento')?.setValue(provee[0].nrodocumento);
    this.frmDatos.get('direccion')?.setValue(provee[0].direcresumen);
  }

  changeAplicaSunat(value: any) {
    if (!value) {
      //this.onlyReadSunat = true;
      this.frmDatos.get('nroserie_ctb')?.setValue('');
      this.frmDatos.get('nrodocumento_ctb')?.setValue('');
    }
  }

  changeFechaDesde(event: Date) {
    this.gettipocambiodia(event);

    this.minimaFechaHasta = event;
    const { fecemision, nrodias, fecvencimiento } = this.frmDatos.controls;

    const emision = fecemision.value;
    const vencimiento = this.parsearFecha(fecvencimiento.value); //this.addDays(emision, 1);
    const diferenci = this.calcularDiferenciaDias(emision, vencimiento);

    fecvencimiento?.setValue(vencimiento);
    nrodias?.setValue(diferenci);

    this.prcCuota(this.nrocuotas);
  }

  changeFechaHasta(event: Date) {
    this.maximaFechaDesde = event;
    const { fecemision, nrodias } = this.frmDatos.controls;

    const vencimiento = this.parsearFecha(event);
    const _fecemision = this.parsearFecha(fecemision.value);
    const diferenciaEnDias = this.calcularDiferenciaDias(_fecemision, vencimiento);

    nrodias?.setValue(diferenciaEnDias);

    this.prcCuota(this.nrocuotas);
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
    const { fecemision, nrodias, fecvencimiento } = this.frmDatos.controls;
    if (!nrodias.value || Number.parseInt(nrodias.value) === 0) {
      nrodias?.setValue(1);
      const _fechaSalida = this.addDays(fecemision.value, nrodias.value);
      fecvencimiento?.setValue(_fechaSalida);
      this.maximaFechaDesde = this.parsearFecha(fecemision.value);
      this.minimaFechaHasta = this.parsearFecha(_fechaSalida);
      return;
    }

    let _fecemision = fecemision.value;
    if (_fecemision.toString().length === 10) {
      _fecemision = new Date(this.serviceUtilitario.formatFecha(_fecemision));
    }

    const fecha = this.addDays(_fecemision, Number.parseInt(nrodias.value));
    fecvencimiento?.setValue(fecha);
    this.maximaFechaDesde = fecha;
    this.minimaFechaHasta = this.parsearFecha(fecemision.value);
    this.prcCuota(this.nrocuotas);
  }

  gettipocambiodia(fecha: any) {
    const objeto = {
      anio: fecha.getFullYear(),
      mes: fecha.getMonth() + 1,
      dia: fecha.getDate(),
    };

    const $gettipocambio = this.proyectosService.gettipocambiodia(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          if(!rpta){ return; }
          this.frmDatos.get('tc')?.setValue(Number.parseFloat(rpta.valTipo));
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($gettipocambio)

  }

  changeAplicaDetra(value: any) {
    console.log('changeAplicaDetra...', value);
    this.listarItemsTablaSunat();
    if (!value) {
      console.log('entro...', value);
      this.verDetraccion = false;
      this.frmDatos.get('porc_detraccion').disable();
      this.frmDatos.get('monto_detraccion_mn_CTB').disable();
      this.frmDatos.get('indmanualdetraccion').disable();
      this.frmDatos.get('detraccion_tipo').disable();
      this.frmDatos.get('detraccion_tipo_pago').disable();

      this.frmDatos.get('retencion_tipo').enable();
      this.frmDatos.get('monto_retencion').enable();
      this.frmDatos.get('retencion_base_imponible').enable();

      this.frmDatos.get('retencion_tipo')?.setValue(0);
      this.frmDatos.get('porc_detraccion')?.setValue(0);
      this.frmDatos.get('monto_detraccion_mn_CTB')?.setValue(0);
    } else {
      console.log('false...', value);
      this.verDetraccion = true;
      this.frmDatos.get('porc_detraccion').enable();
      this.frmDatos.get('monto_detraccion_mn_CTB').enable();
      this.frmDatos.get('indmanualdetraccion').enable();
      this.frmDatos.get('detraccion_tipo').enable();
      this.frmDatos.get('detraccion_tipo_pago').enable();

      this.frmDatos.get('retencion_tipo').disable();
      this.frmDatos.get('monto_retencion').disable();
      this.frmDatos.get('retencion_base_imponible').disable();

      this.frmDatos.get('retencion_tipo')?.setValue(0);
      this.frmDatos.get('monto_retencion')?.setValue(0);
      this.frmDatos.get('retencion_base_imponible')?.setValue(0);
    }
  }

  listarItemsTablaSunat() {
    this.contabilidadService.listarItemsTablaSunat(1).subscribe({
      next: (rpta: any) => {
        console.info('listarItemsTablaSunat : ', rpta);
        if (this.frmDatos.get('inddetraccion_ctb')?.value === true) {
          this.lstSunatTrans = rpta.filter((x: { codsunat: number; }) => (x.codsunat === 30 || x.codsunat === 31 || x.codsunat === 32 || x.codsunat === 33));
          this.frmDatos.get('fel_sunat_transaction')?.setValue(30);
        } else {
          this.lstSunatTrans = rpta.filter((x: { codsunat: number; }) => (x.codsunat === 1 || x.codsunat === 2 || x.codsunat === 4 || x.codsunat === 29 || x.codsunat === 34 || x.codsunat === 35));
          this.frmDatos.get('fel_sunat_transaction')?.setValue(1);
        }
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
  }

  getMontoAnticipo(value: any) {
    if (value === 4) {
      this.frmDatos.get('monto_anticipo').enable();
    } else {
      this.frmDatos.get('monto_anticipo').disable();
    }
  }

  listarTipoRetencion() {
    return this.contabilidadService.listarItemsTablaSunat(8).pipe(
      tap((rpta: any) => {
        this.lstTipoRetencion = rpta;
      }),
      catchError((err) => {
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  listarCategoriaDoc() {
    let tipo = this.frmDatos.value.idtipodocprc;
    return this.contabilidadService.listarCategoriasDoc(tipo).pipe(
      tap((rpta: any) => {
        this.setSpinner(false);
        this.lstCategoriaDoc = rpta;
      }),
      catchError((err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
        return of(null);
      })
    );
  }

  getValidarNroDocumento(): boolean {
    const _idtipodoc = this.frmDatos.get('idtipodoc')?.value;
    const _nro = this.frmDatos.get('nrodocumento')?.value;

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
    const _idtipodoc = this.frmDatos.get('idtipodoc')?.value;
    const _nro = this.frmDatos.get('nrodocumento')?.value;
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
        this.frmDatos.get('idproveedor')?.setValue(rpta[0].idcliente);
        this.frmDatos.get('direccion')?.setValue(rpta[0].direcresumen);
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

  listaClientes(data?:any) {
    let tiporol = "CLI";
    return this.proyectosService.obtenerClientes(tiporol).pipe(
      tap((rpta: any) => {
        this.lstCliente = rpta;
        console.log('listaClientes', this.lstCliente);
        if(!data) { return; }
        this.frmDatos.get('nrodocumento').setValue(data.nrodocumento);
        this.frmDatos.get('idproveedor').setValue(Number.parseInt(data.idpersona));
        this.frmDatos.get('direccion').setValue(data.direcresumen);
      }),
      catchError((err) => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesQuestion.msgErrorGenerico,
        });
        return of(null);
      })
    );
  }

  NuevoPersona(itemDocumento?: any) {
    const dctsNaturales: string[] = ['DNI', 'CEX', 'CDI', 'PAS'];
    const objet = {
      idrolpersona: 'PRO',
      ...itemDocumento,
      tipopersona: itemDocumento.idtipodoc && dctsNaturales.includes(itemDocumento.idtipodoc) ? 'N' : 'J',
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
        this.listaClientes(rpta.objeto);
        /*this.frmDatos.get('nrodocumento').setValue(Number.parseInt(rpta.objeto.nrodocumento));
        this.frmDatos.get('idproveedor').setValue(Number.parseInt(rpta.objeto.idpersona));
        this.frmDatos.get('direccion').setValue(rpta.objeto.direcresumen);*/
      }
    });
  }

  prcCuota(data: number) {
    if (this.frmDatos.value.monto_pen_pago === 0) {
      this.messageService.add({ severity: 'info', summary: 'Aviso', detail: 'Aún no existe Monto de Pago para agregar cuotas' });
      this.frmDatos.get('nrocuotas')?.setValue(data);
      this.nrocuotas = 0;
      return;
    }
    this.nrocuotas = data;
    this.listaCuotas = [];
    const _monto = this.frmDatos.value.monto_pen_pago / data;

    let fecemision;
    fecemision = this.frmDatos.value.fecemision;

    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));
    }

    let tot_dia = this.frmDatos.value.nrodias / data;

    for (let i = 0; i < data; i++) {
      console.log('index...', i);
      console.log('tot_dia...', tot_dia);

      let dias = (tot_dia * i) + tot_dia

      const newDate = this.addDays(fecemision, dias);
      const objet = {
        fechacuota: newDate,
        monto: _monto,
        idcuotadoc: 0
      }

      this.listaCuotas.push(objet);
    }
  }

  validarDatos(): boolean {
    this.errorMensaje = "";
    console.log('this.formValue...', this.frmDatos.value);

    if (this.frmDatos.value.nrodocumento === null || this.frmDatos.value.nrodocumento === '') {
      this.errorMensaje = "Ingresar RUC...!";
      return false;
    }

    if (this.frmDatos.value.idproveedor === null || this.frmDatos.value.idproveedor === '') {
      this.errorMensaje = "Buscar Proveedor por RUC...!";
      return false;
    }

    if (this.frmDatos.value.tipodoc_ctb === '' || this.frmDatos.value.tipodoc_ctb === null) {
      this.errorMensaje = "Seleccionar Tipo de Documento...!";
      return false;
    }

    if (this.frmDatos.value.codformapago === '' || this.frmDatos.value.codformapago === null) {
      this.errorMensaje = "Ingresar Forma de Pago...!";
      return false;
    }

    if (this.frmDatos.value.idmoneda === null) {
      this.errorMensaje = "Seleccionar Moneda...!";
      return false;
    }

    if (this.frmDatos.value.idmoneda !== 1) {
      if (this.frmDatos.value.tc === null || this.frmDatos.value.tc === '' || this.frmDatos.value.tc === 0) {
        this.errorMensaje = "Ingresar Tipo Cambio...!";
        return false;
      }
    }

    if (this.frmDatos.value.fel_sunat_transaction === null) {
      this.errorMensaje = "Seleccionar Transacción...!";
      return false;
    }

    if (this.frmDatos.value.idcategoria === null) {
      this.errorMensaje = "Seleccionar Motivo...!";
      return false;
    }

    if (this.frmDatos.value.inddetraccion_ctb) {
      if (this.frmDatos.value.porc_detraccion === null
        || this.frmDatos.value.porc_detraccion === ''
        || this.frmDatos.value.porc_detraccion === 0) {
        this.errorMensaje = "Ingresar Porcentaje Detracción...!";
        return false;
      }

      if (this.frmDatos.value.detraccion_tipo === null || this.frmDatos.value.detraccion_tipo === 0) {
        this.errorMensaje = "Seleccionar Tipo Detracción...!";
        return false;
      }

      if (this.frmDatos.value.detraccion_tipo_pago === null || this.frmDatos.value.detraccion_tipo_pago === 0) {
        this.errorMensaje = "Seleccionar Tipo Pago...!";
        return false;
      }
    }

    if (this.frmDatos.value.fel_sunat_transaction === 4) {
      if (this.frmDatos.value.monto_anticipo === null
        || this.frmDatos.value.monto_anticipo === ''
        || this.frmDatos.value.monto_anticipo === 0) {
        this.errorMensaje = "Ingresar Monto Anticipo...!";
        return false;
      }
    }

    return true;
  }

  guardarOC() {
    if (!this.validarDatos()) {
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
    let fecvencimiento;
    fechaingreso = this.frmDatos.value.fechaingreso;
    fecemision = this.frmDatos.value.fecemision;
    fecvencimiento = this.frmDatos.value.fecvencimiento;

    if (fechaingreso.toString().length === 10) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));
    }
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));
    }
    if (fecvencimiento.toString().length === 10) {
      fecvencimiento = new Date(this.serviceUtilitario.formatFecha(fecvencimiento));
    }
    for (let i = 0; i < this.lstItemOC.length; i++) {
      if (this.lstItemOC[i].cantidad.toString() === '') {
        this.lstItemOC[i].cantidad = 0;
      }
      if (this.lstItemOC[i].preciocosto.toString() === '') {
        this.lstItemOC[i].preciocosto = 0;
      }
    }

    let retencion_tipo = this.frmDatos.value.retencion_tipo;
    if (!this.frmDatos.value.inddetraccion_ctb) {
      retencion_tipo = 0;
    }

    const objeto = {
      ...this.frmDatos.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecemision,
      fecvencimiento,
      tipodoc_ctb: (this.frmDatos.value.tipodoc_ctb).toString(),
      cuotas: this.listaCuotas,
      nrocuotas: this.nrocuotas,
      retencion_tipo: retencion_tipo,
      idordencompra: 0,
      iddocumentoprc_origen: this.data.idordencompra,
      idtipodocprc: 6,
    }

    console.log('guardarOC...', objeto);

    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0) {
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
        this.cerrar(true);
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

  cerrar(proceso:boolean) {
    this.ref.close({proceso});
  }
}
