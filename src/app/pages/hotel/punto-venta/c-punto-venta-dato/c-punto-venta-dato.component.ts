import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Subscription, forkJoin, Observable } from 'rxjs';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ReservaService } from '../../reserva/reserva.service';
import { CModalPersonaComponent } from 'src/app/pages/compras/registro-compra/modalPersona/c-modalpersona.component';
import { CMAgregarProductoComponent } from '../../reserva/cm-agregar-producto/cm-agregar-producto.component';
import { CmRegistrarPagoComponent } from '../../reserva/cm-registrar-pago/cm-registrar-pago.component';

@Component({
  selector: 'app-c-punto-venta-dato',
  templateUrl: './c-punto-venta-dato.component.html',
  styleUrls: ['./c-punto-venta-dato.component.scss']
})
export class CPuntoVentaDatoComponent implements OnInit, OnDestroy {
  private readonly IGV = 0.18;
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  //idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  errorMensaje: string = "";
  lstTermino: any;
  dropdownItemsTipNro = [];
  tituloTipoDocumento: string = 'Nro. Documento';
  onlyRead: boolean = false;
  lstCliente: Cliente[] = [];
  lstHabitaciones: any[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  //ordenCompra: any;
  lstQuotes: any[] = [];
  listaCuotas: any[] = [];
  selectedDetalle: any[] = [];
  lstMonedas: Moneda[] = [];
  montoTotal: number = 0;
  lstComprobante: any;
  s_monto!: number;
  s_igv!: number;
  verbtnGrabar: boolean = true;
  tipoigv:number=1;

  constructor(
    private readonly fb: FormBuilder,
    private readonly proyectosService: ProyectosService,
    private readonly messageService: MessageService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceUtilitario: UtilitariosService,
    public readonly dialogService: DialogService,
    private readonly ordencompraService: OrdencompraService,
    private readonly contabilidadService: ContabilidadService,
    private readonly serviceReserva: ReservaService,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.traerUno();
    console.log("IA_data: ", this.IA_data);

    if (this.IA_data.paramReg === 'RES') {
      this.listarHabitacionReserva();
      this.verbtnGrabar = this.IA_data.idordencompra > 0
    } else {
      this.verbtnGrabar = this.IA_data.idordencompra === 0
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      iddocumentoprc_origen: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 6, disabled: false }],
      idprod: [{ value: 0, disabled: false }],
      idordencompra: [{ value: this.IA_data.idordencompra, disabled: true }],
      idtipodoc: [{ value: '', disabled: false }],
      nrodocumento: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: true }],
      codtipodoc: [{ value: 'OPO', disabled: false }],
      lugarentrega: [{ value: '', disabled: false }],
      idmoneda: [{ value: 1, disabled: false }],
      tipodoc_ctb: [{ value: 2, disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      fecemision: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      codformapago: [{ value: 14328, disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  listarHabitacionReserva() {
    const objeto =
    {
      codproducto: "",
      idfamilia: 325,
      idsubfamilia: 525,
      desproducto: "",
      idalmacen: 0,
      idprod: 0,
      idreserva: this.IA_data.idordencompra,
      idusuario: constantesLocalStorage.idusuario
    }

    const $listarHabitacionesCombo = this.serviceReserva.listarHabitacionesCombo(objeto)
      .subscribe({
        next: (rpta: any) => {
          console.log('rpta listarHabitacionesCombo: ', rpta);
          this.lstHabitaciones = rpta.habitaciones;
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { }
      });
    this.$listSubcription.push($listarHabitacionesCombo)
  }

  listarItemsTablaComprobante$(): Observable<any> {
    return this.contabilidadService.listarItemsTablaSunat(2).pipe(
      map((rpta: any) => {
        this.lstComprobante = rpta.filter((x: { codsunat: number; }) => (x.codsunat === 1 || x.codsunat === 2));
        return this.lstComprobante;
      })
    );
  }

  listaHabitaciones$(): Observable<any> {
    const objeto = {
      codproducto: "",
      idfamilia: 125,
      idsubfamilia: 0,
      desproducto: "",
      idalmacen: 0,
      idprod: 0,
      idusuario: constantesLocalStorage.idusuario
    };
    return this.serviceReserva.listarHabitacionesCombo3(objeto).pipe(
      map((rpta: any) => {
        this.lstHabitaciones = rpta.habitaciones;
        return this.lstHabitaciones;
      })
    );
  }

  changeHabitacion(codHabitacion: number) {
    if (this.IA_data.paramReg === 'RES') {
      this.tipoigv = 1;
      return;
    }

    const habitacion = this.lstHabitaciones.find(x => x.idprod === codHabitacion);
    console.log('habitacion', habitacion);

    const { iddocumentoprc_origen, idtipodoc, nrodocumento, idproveedor } = this.frmDatos.controls;
    iddocumentoprc_origen?.setValue(habitacion?.idreserva || 0);
    idtipodoc?.setValue(habitacion?.idtipodoc || "");
    nrodocumento?.setValue(habitacion?.nrodocumento || "");
    idproveedor?.setValue(habitacion?.idpersona || "");
    this.tipoigv = habitacion?.tipoigv_item || 1;
  }

  listarTiposDoc$(): Observable<any> {
    const documentosValidos: string[] = ['DNI', 'RUC', 'CEX', 'PAS'];
    return this.serviceReserva.listartipodocumentotablasunat('X').pipe(
      map((rpta: any) => {
        const filtrados = rpta.filter((item: any) => item.idtipodoc && documentosValidos.includes(item.idtipodoc));
        this.dropdownItemsTipNro = filtrados;
        return filtrados;
      })
    );
  }

  listaClientes$(): Observable<any> {
    let tiporol = "CLI";
    return this.proyectosService.obtenerClientes(tiporol).pipe(
      map((rpta: any) => {
        this.lstCliente = rpta;
        return rpta;
      })
    );
  }

  listaMonedas$(): Observable<any> {
    return this.proyectosService.obtenerMonedas().pipe(
      map((rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;
        return rpta;
      }),
    );
  }

  getDatos(codCliente: number) {
    const { nrodocumento, direccion } = this.frmDatos.controls;
    const cliente = this.lstCliente.find((x: { idcliente: number; }) => x.idcliente === codCliente);
    nrodocumento?.setValue(cliente?.nrodocumento);
    direccion?.setValue(cliente?.direcresumen);
  }

  cambioTipoDoc(tipoDoc: string) {
    const { nrodocumento } = this.frmDatos.controls;
    switch (tipoDoc) {
      case 'DNI':
        this.tituloTipoDocumento = 'Nro. Documento de Identidad (DNI)';
        nrodocumento?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
        nrodocumento?.updateValueAndValidity();
        break;
      case 'RUC':
        this.tituloTipoDocumento = 'Número de RUC';
        nrodocumento?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)]);
        nrodocumento?.updateValueAndValidity();
        break;
      case 'CEX':
        this.tituloTipoDocumento = 'Número de Carné de Extranjería (CEX)';
        nrodocumento?.setValidators([Validators.required, Validators.minLength(12), Validators.maxLength(16)]);
        nrodocumento?.updateValueAndValidity();
        break;
      case 'PAS':
        this.tituloTipoDocumento = 'Número de Pasaporte (PAS)';
        nrodocumento?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(16)]);
        nrodocumento?.updateValueAndValidity();
        break;
    }
  }

  getValidarNroDocumento(): boolean {
    const { idtipodoc, nrodocumento } = this.frmDatos.getRawValue();

    switch (idtipodoc) {
      case 'DNI':
        if (nrodocumento.length !== 8) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'DNI no Valido...' });
          return false;
        }
        break;
      case 'RUC':
        if (nrodocumento.length !== 11) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'RUC no Valido...' });
          return false;
        }
        break;
      case 'CEX':
        if (nrodocumento.length < 12 || nrodocumento.length > 16) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Carnet de Extranjería no Valido...' });
          return false;
        }
        break;
      case 'PAS':
        if (nrodocumento.length < 8 || nrodocumento.length > 16) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Pasaporte no Valido...' });
          return false;
        }
        break;
    }
    return true;
  }

  getBusquedaRUC() {
    const { idtipodoc, nrodocumento, idproveedor, direccion } = this.frmDatos.controls;
    idproveedor?.setValue(null);
    direccion?.setValue(null);

    if (nrodocumento.value === null || nrodocumento.value === '') {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Ingresar Ruc...' });
      return;
    }
    if (!this.getValidarNroDocumento()) {
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = 'Buscando...!';

    const objet = {
      nrodocumento: nrodocumento.value
    }

    this.ordencompraService.buscarporRUC(objet).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log('rpta...', rpta);
        if (rpta.length === 0) {
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Cliente no encontrado...' });
          this.NuevoPersona({ idtipodoc, nrodocumento });
          return;
        }
        idproveedor?.setValue(rpta[0].idcliente);
        direccion?.setValue(rpta[0].direcresumen);
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

  NuevoPersona(itemDocumento?: any) {
    const { nrodocumento, direccion, idproveedor } = this.frmDatos.controls;
    nrodocumento?.setValue(null);
    idproveedor?.setValue(null);
    direccion?.setValue(null)

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
      if (rpta === undefined) { return; }
      this.listaClientes$();
      nrodocumento?.setValue(Number.parseInt(rpta.objeto.nrodocumento));
      idproveedor?.setValue(Number.parseInt(rpta.objeto.idpersona));
      direccion?.setValue(rpta.objeto.direcresumen);

    });
  }

  validarDatos(): boolean {
    this.errorMensaje = "";
    const { nrodocumento, tipodoc_ctb, idproveedor } = this.frmDatos.getRawValue();

    if (nrodocumento === null || nrodocumento === '') {
      this.errorMensaje = "Ingresar RUC...!";
      return false;
    }

    if (idproveedor === null || idproveedor === '') {
      this.errorMensaje = "Buscar Proveedor por RUC...!";
      return false;
    }

    if (tipodoc_ctb === '' || tipodoc_ctb === null) {
      this.errorMensaje = "Seleccionar Tipo de Documento...!";
      return false;
    }

    return true;
  }

  traerUno() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';

    forkJoin([
      this.listarTiposDoc$(),
      this.listaClientes$(),
      this.listaHabitaciones$(),
      this.listarItemsTablaComprobante$(),
      this.listaMonedas$()
    ]).subscribe({
      next: () => {
        if (!this.IA_data.idordencompra) {
          this.setSpinner(false);
          this.mensajeSpinner = '';
          return;
        }

        const objeto = {
          idordencompra: this.IA_data.idordencompra,
          idusuario: constantesLocalStorage.idusuario
        };

        const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
          .subscribe({
            next: (rpta: any) => {
              console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
              const ordenCompra = rpta.ordencompra[0];
              this.frmDatos.patchValue(ordenCompra);
              const { fecemision, fechaingreso, fecvencimiento } = this.frmDatos.controls;
              if (this.IA_data.paramReg === 'RES') {
                this.frmDatos.get('iddocumentoprc_origen')?.setValue(this.IA_data.idordencompra);
                fecemision?.setValue(this.serviceUtilitario.obtenerFechaFormatDDMMYY(ordenCompra.fecemision));
                fechaingreso?.setValue(this.serviceUtilitario.obtenerFechaFormatDDMMYY(ordenCompra.fechaingreso));
                fecvencimiento?.setValue(this.serviceUtilitario.obtenerFechaFormatDDMMYY(ordenCompra.fecvencimiento));
              } else {
                fecemision?.setValue(new Date(ordenCompra.fecemision));
                fechaingreso?.setValue(new Date(ordenCompra.fechaingreso));
                fecvencimiento?.setValue(new Date(ordenCompra.fecvencimiento));
              }
              /*fecemision?.setValue(new Date(ordenCompra.fecemision));
              fechaingreso?.setValue(new Date(ordenCompra.fechaingreso));
              fecvencimiento?.setValue(new Date(ordenCompra.fecvencimiento));*/

              if (ordenCompra.items !== undefined) {
                this.lstItemOC = ordenCompra.items;
                this.calcularMontosCompra();
              }

              this.setSpinner(false);
              this.mensajeSpinner = '';
            },
            error: (err) => {
              this.setSpinner(false);
              this.serviceSharedApp.messageToast();
            },
            complete: () => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($cargarOrdenC);
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      }
    });
  }

  getAgregarProdHabit(tipoProceso: string) {
    const { idordencompra } = this.IA_data
    const data: any = {
      nroindex: 0,
      idordencompra,
      origenreg: 'RV',
      idalmacen: 0,
      tipoProceso
    }
    const refItem = this.dialogService.open(CMAgregarProductoComponent, {
      data,
      header: "Agregar Producto " + idordencompra,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      if (rpta === undefined) { return; }
      console.log('onClose agregar prod/habit', rpta);

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
        tipoigv: this.tipoigv
      }
      this.lstItemOC.push(dataOC);
      this.calcularMontosCompra();
    });
  }

  calcularMontosCompra() {
    const total = this.lstItemOC.reduce((acc, item) => acc + (item.preciocostototal || 0), 0);
    const igvFactor = 1 + this.IGV;
    this.s_monto = +(total / igvFactor).toFixed(2);
    this.s_igv = +(total - this.s_monto).toFixed(2);
    this.montoTotal = +total.toFixed(2);
  }

  guardarOC() {
    if (!this.validarDatos()) {
      this.setSpinner(false);
      this.messageService.add({ severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';

    for (const item of this.lstItemOC) {
      if (item.cantidad.toString() === '') {
        item.cantidad = 0;
      }
      if (item.preciocosto.toString() === '') {
        item.preciocosto = 0;
      }
    }

    const objeto = {
      ...this.frmDatos.getRawValue(),
      items: this.lstItemOC,
      tipodoc_ctb: this.frmDatos.get('tipodoc_ctb')?.value.toString(),
      cuotas: this.listaCuotas,
      nrocuotas: null,
      retencion_tipo: 0
    }

    console.log('guardarOC...', objeto);

    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        console.log("ordenCompraprc: ", rpta);
        this.setSpinner(false);
        if (rpta.procesoSwitch !== 0) {
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
          return;
        }

        this.pagarItemDetalle(Number.parseInt(rpta.resultProceso));
      },
      error: (err: any) => {
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

  pagarItemDetalle(idordencompra: number) {
    console.log("lstItemOC : ", this.lstItemOC);

    //const { idordencompra } = this.IA_data;
    const { idproveedor, idmoneda } = this.frmDatos.getRawValue();
    const nombreCliente = this.lstCliente.find((x: { idcliente: number; }) => x.idcliente === idproveedor)?.razonsocial;
    const simboloMoneda = this.lstMonedas.find((x: { idmoneda: number; }) => x.idmoneda === idmoneda)?.simbmoneda;

    const data = {
      //resultProceso,
      idordencompra,
      nombreCliente,
      fecha: this.serviceUtilitario.obtenerFechaFormateadoDMA(),
      totalPagar: this.montoTotal,
      idproveedor,
      idmoneda,
      simboloMoneda,
      //idordencompraitemArray: this.lstItemOC.map((x: { idordencompraitem: any; }) => x.idordencompraitem)
    }
    console.log("selectedDetalle data : ", data);


    const ref = this.dialogService.open(CmRegistrarPagoComponent, {
      data, //this.ordenHabitacion,
      header: 'Registrar Pago', //+ ' - ' + this.ordenHabitacion.nomHabitacion,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe(async (rpta: any) => {
      if (!rpta) { return; }
      const rptaFacturar = await this.serviceSharedApp.confirmDialog({
        message: '¿Desea facturar?',
        header: 'Aviso'
      });

      if (!rptaFacturar) { return; }

      this.setSpinner(true);
      this.mensajeSpinner = 'Generando Factura...!';

      this.emitirDocumento(idordencompra);
    })
  }

  emitirDocumento(idordendocumento: number) {
    const objeto = {
      codproceso: 0,
      idusuario: constantesLocalStorage.idusuario,
      idordendocumento
    }

    const $procesarTrx = this.proyectosService.emitirDocumento(objeto).subscribe({
      next: (rpta: any) => {
        console.log('emitirDocumento', rpta);
        this.setSpinner(false);
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

  async eliminarItem(data: any) {
    const rpta = await this.serviceSharedApp.confirmDialog({
      message: '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?',
      header: 'Confirmación'
    });

    if (!rpta) { return; }

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
      this.frmDatos.get('nrocuota')?.setValue(0);
      //this.nrocuotas = 0;
      this.listaCuotas = [];

      this.frmDatos.get('s_monto_valor_venta_CTB')?.setValue(0);
      this.frmDatos.get('s_monto_igv_CTB')?.setValue(0);
      this.frmDatos.get('s_monto_total_CTB')?.setValue(0);
      this.frmDatos.get('monto_detraccion_mn_CTB')?.setValue('');
      this.frmDatos.get('monto_pen_pago')?.setValue(0);

      /*ACTUALIZANDO MONTOS TOTALES DE LOS ITEMS*/
      this.s_monto = 0;
      this.s_igv = 0;
      this.montoTotal = 0;
    } /*else {
      this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
    }*/

  }
}