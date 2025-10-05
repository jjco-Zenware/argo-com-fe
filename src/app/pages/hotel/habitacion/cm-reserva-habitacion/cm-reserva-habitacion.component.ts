import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, OrdenCompraItem } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CModalPersonaComponent } from 'src/app/pages/compras/registro-compra/modalPersona/c-modalpersona.component';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-cm-reserva-habitacion',
  templateUrl: './cm-reserva-habitacion.component.html',
  styleUrls: ['./cm-reserva-habitacion.component.scss']
})
export class CmReservaHabitacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  minimaFechaDesde!: Date;
  maximaFechaDesde: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  minimaFechaHasta!: Date;
  maximaFechaHasta: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  lstCliente: Cliente[] = [];
  lstComprobante: any;
  listaCuotas: any[] = [];
  errorMensaje: string = "";
  lstItemOC: OrdenCompraItem[] = [];
  nrocuotas!: number;
  idOrdenC: number = 0;
  dataAdjunto: any;
  s_monto!: number;
  s_igv!: number;
  ordenCompra: any;
  montoTotal: number = 0;
  lstQuotes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private confirmationService: ConfirmationService,
    private ordencompraService: OrdencompraService,
    private proyectosService: ProyectosService,
    private contabilidadService: ContabilidadService,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.listaClientes();
    this.listarItemsTablaComprobante();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 201, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd: [{ value: '', disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaFormateadoDMA(), disabled: false, }],
      idordencompra: [{ value: 0, disabled: false }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: '', disabled: false }],
      idmoneda: [{ value: 1, disabled: false }],
      //idorigen: [{ value: this.IA_data, disabled: false }],
      idcontacto: [{ value: 0, disabled: false }],
      codtipodoc: [{ value: 'OPO', disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: 14328, disabled: false }],
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
    });
  }

  getBusquedaRUC() {
    const _nro = this.frmDatos.get('nrodocumento')?.value;
    console.log('getBusquedaRUC...', _nro);

    if (_nro === null || _nro === '') {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Ingresar Ruc...' });
      return;
    }
    console.log('length...', _nro.length);
    if (_nro.length < 11) {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'Ruc no Valido...' });
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

  NuevoPersona() {
    const objet = {
      idrolpersona: 'PRO'
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
        this.frmDatos.get('nrodocumento')?.setValue(parseInt(rpta.objeto.nrodocumento));
        this.frmDatos.get('idproveedor')?.setValue(parseInt(rpta.objeto.idpersona));
        this.frmDatos.get('direccion')?.setValue(rpta.objeto.direcresumen);
      }
    });
  }

  getDatos(dato: any) {
    console.log('getDatos...', dato);
    let provee = this.lstCliente.filter((x: { idcliente: number; }) => x.idcliente === dato);
    this.frmDatos.get('nrodocumento')?.setValue(provee[0].nrodocumento);
    this.frmDatos.get('direccion')?.setValue(provee[0].direcresumen);
  }

  changeFechaDesde(event: Date) {
    this.minimaFechaHasta = event;
    console.log('changeFechaDesde event', event);
    let emision = new Date(this.frmDatos.get('fecemision')?.value);

    let vencimiento = this.frmDatos.value.fecvencimiento;
    console.log('changeFechaDesde vencimiento', vencimiento);
    if (vencimiento.toString().length === 10) {
      vencimiento = new Date(this.serviceUtilitario.formatFecha(vencimiento));
    }

    let diferenci = this.serviceUtilitario.diferenciaEnDias(emision, vencimiento);
    this.frmDatos.get('nrodias')?.setValue(diferenci);
  }

  changeFechaHasta(event: Date) {
    let fecemision = this.frmDatos.value.fecemision;
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));
    }

    this.maximaFechaDesde = event;
    let vencimiento = event;
    let diferenci = this.serviceUtilitario.diferenciaEnDias(fecemision, vencimiento);
    this.frmDatos.get('nrodias')?.setValue(diferenci);
  }

  addDiasFec() {
    let fecemision = this.frmDatos.value.fecemision;
    if (fecemision.toString().length === 10) {
      fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));
    }

    let fecha = this.addDays(fecemision, parseInt(this.frmDatos.value.nrodias));
    this.frmDatos.get('fecvencimiento')?.setValue(fecha);
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

  validarDatos(): boolean {
    let _error = false;
    this.errorMensaje = "";
    console.log('this.formValue...', this.frmDatos.value);

    if (!_error && (this.frmDatos.value.nrodocumento === null || this.frmDatos.value.nrodocumento === '')) {
      this.errorMensaje = "Ingresar RUC...!";
      _error = true;
    }

    if (!_error && (this.frmDatos.value.idproveedor === null || this.frmDatos.value.idproveedor === '')) {
      this.errorMensaje = "Buscar Proveedor por RUC...!";
      _error = true;
    }

    if (!_error && (this.frmDatos.value.tipodoc_ctb === '' || this.frmDatos.value.tipodoc_ctb === null)) {
      this.errorMensaje = "Seleccionar Tipo de Documento...!";
      _error = true;
    }

    if (!_error && (this.frmDatos.value.codformapago === '' || this.frmDatos.value.codformapago === null)) {
      this.errorMensaje = "Ingresar Forma de Pago...!";
      _error = true;
    }

    if (!_error && this.frmDatos.value.idmoneda === null) {
      this.errorMensaje = "Seleccionar Moneda...!";
      _error = true;
    }

    /*if (this.frmDatos.value.idmoneda !== 1) {
      if (!_error && (this.frmDatos.value.tc === null || this.frmDatos.value.tc === '' || this.frmDatos.value.tc === 0)) {
        this.errorMensaje = "Ingresar Tipo Cambio...!";
        _error = true;
      }
    }*/

    if (!_error && this.frmDatos.value.fel_sunat_transaction === null) {
      this.errorMensaje = "Seleccionar Transacción...!";
      _error = true;
    }

    if (!_error && this.frmDatos.value.inddetraccion_ctb) {
      if (!_error && (this.frmDatos.value.porc_detraccion === null
        || this.frmDatos.value.porc_detraccion === ''
        || this.frmDatos.value.porc_detraccion === 0)) {
        this.errorMensaje = "Ingresar Porcentaje Detracción...!";
        _error = true;
      }

      if (!_error && (this.frmDatos.value.detraccion_tipo === null || this.frmDatos.value.detraccion_tipo === 0)) {
        this.errorMensaje = "Seleccionar Tipo Detracción...!";
        _error = true;
      }

      if (!_error && (this.frmDatos.value.detraccion_tipo_pago === null || this.frmDatos.value.detraccion_tipo_pago === 0)) {
        this.errorMensaje = "Seleccionar Tipo Pago...!";
        _error = true;
      }
    }

    if (!_error && this.frmDatos.value.fel_sunat_transaction === 4) {
      if (!_error && (this.frmDatos.value.monto_anticipo === null
        || this.frmDatos.value.monto_anticipo === ''
        || this.frmDatos.value.monto_anticipo === 0)) {
        this.errorMensaje = "Ingresar Monto Anticipo...!";
        _error = true;
      }
    }
    return _error;
  }

  guardar() {

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
    let fecvencimiento;
    fechaingreso = this.frmDatos.value.fechaingreso;
    fecemision = this.frmDatos.value.fecemision;
    fecvencimiento = this.frmDatos.value.fecvencimiento;

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
            this.frmDatos.get('idordencompra')?.setValue(rpta.resultProceso);
            this.frmDatos.get('codigonroorden')?.setValue(rpta.resultProceso);

            this.dataAdjunto = {
              idCliente: this.idOrdenC,
              codtipoproc: 8,
              veracciones: 0
            }
            //this.verAdjunto = true;
            //agregar una cuota por defecto
            this.traerUno2();

            //preguntar si desea emitir el documento con una cuota
            this.confirmationService.confirm({
              key: 'confirm1',
              header: 'Confirmación',
              message: '¿Desea Emitir el Documento con una Cuota...?',
              accept: () => {
                this.guardar();
                this.procesarTRX();
              }
            });
          } else {
            this.traerUno();
          }
          this.ref.close(true);
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

          /*this.visibleDocument = false;
          this.visibleAsiento = false;*/

          this.frmDatos.patchValue(rpta.ordencompra[0]);
          this.frmDatos.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
          //this._alm_idordencompra = rpta.ordencompra[0].alm_idordencompra;
          this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
          this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.mostrarBotones(rpta.ordencompra[0].estado);
          this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);
          this.frmDatos.get('monto_pen_pago')?.setValue(rpta.ordencompra[0].s_monto_neto_CTB);
          this.frmDatos.get('fecvencimiento')?.setValue(rpta.ordencompra[0].fecvencimiento);
          this.frmDatos.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision);
          this.nrocuotas = rpta.ordencompra[0].nrocuotas
          this.getBusquedaRUC();
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

          /*this.visibleDocument = false; 
          this.visibleAsiento = false;*/

          this.frmDatos.patchValue(rpta.ordencompra[0]);
          this.frmDatos.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
          //this._alm_idordencompra = rpta.ordencompra[0].alm_idordencompra;
          this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
          this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.mostrarBotones(rpta.ordencompra[0].estado);
          this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);
          this.frmDatos.get('monto_pen_pago')?.setValue(rpta.ordencompra[0].s_monto_neto_CTB);
          this.frmDatos.get('fecvencimiento')?.setValue(rpta.ordencompra[0].fecvencimiento);
          this.frmDatos.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision);
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
          //this.onlyRead = true;
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

  mostrarBotones(data: any) {
    //console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    /*switch (data) {
      case 'CKI':
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
      case 'CKO':
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
    }*/

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
    this.frmDatos.get('nrodias')?.setValue(diff / (1000 * 60 * 60 * 24));
  }

}
