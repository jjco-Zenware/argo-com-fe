import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner, constantesLocalStorage } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ReservaService } from '../reserva.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cm-registrar-pago',
  templateUrl: './cm-registrar-pago.component.html',
  styleUrls: ['./cm-registrar-pago.component.scss']
})
export class CmRegistrarPagoComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  lstMetodoPago = [];
  lstDetallePago: any[] = [];

  selectedMetodoPago = null;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  data!: any;
  frmDatos!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public refDatoItem: DynamicDialogRef,
    private serviceSharedApp: SharedAppService,
    private serviceReserva: ReservaService
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    console.log('data Modal', this.data);
    this.createFrm();
    this.obtenerItemsTabla();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      observaciones: [{ value: null, disabled: false }]
    })
  }

  agregarDetallePago(metodo: any): void {
    console.log("agregarDetallePago metodo: ", metodo);

    if (!this.lstDetallePago.some((p: any) => p.iditem === metodo.iditem)) {
      this.lstDetallePago.push({
        iditem: metodo.iditem,
        metodo: metodo.valoritem,
        monto: 0
      });
      this.selectedMetodoPago = metodo.iditem;
    } else {
      this.selectedMetodoPago = metodo.iditem;
    }
  }

  eliminarDetallePago(index: number): void {
    this.lstDetallePago.splice(index, 1);
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }


  obtenerItemsTabla() {
    const metodoPago: number = 202
    const $obtenerItemsTabla = this.serviceReserva.obtenerItemsTabla(metodoPago).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.lstMetodoPago = rpta
      },
      error: (err: any) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($obtenerItemsTabla)
  }

  getPagar() {
    if (!this.isTotalPagoValido()) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La suma de los montos no puede superar el total a pagar.'
      });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjProcesando;
    console.log("data : ", JSON.stringify(this.data));

    const lstformapago = this.lstDetallePago.map((item: any) => ({
      idpagodocitem: 0,
      idpagodocprc: 0,
      idformapago: item.iditem,
      idmoneda: this.data.idmoneda,
      montopago: item.monto,
      montoaplicado: item.monto,
      referencia: "",
      idbanco: 0,
      idusuario: constantesLocalStorage.idusuario
    }));

    const objeto = {
      idpagodocprc: 0,
      iddocumentoprc: this.data.idordencompra,
      tc: 0,
      observacion: this.frmDatos.get('observaciones')?.value,
      idusuario: constantesLocalStorage.idusuario,
      tipodeuda: 0,
      lstformapago
    };

    console.log("pagoVentaPRC : ", objeto);

    const $procesarTrx = this.serviceReserva.pagoVentaPRC(objeto).subscribe({
      next: (rpta: any) => {
        console.log('pagoVentaPRC', rpta);
        this.setSpinner(false);
        this.serviceSharedApp.messageToast({
          severity: rpta.procesoSwitch === 0 ? 'success' : 'info',
          summary: rpta.procesoSwitch === 0 ? 'Exito' : 'Validación...!',
          detail: rpta.mensaje
        });
        if (rpta.procesoSwitch === 0) {
          this.cerrar(objeto)
        }
      },
      error: (err: any) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($procesarTrx)
  }

  isTotalPagoValido(): boolean {
    return this.totalPago <= this.data.totalPagar;
  }

  get totalPago(): number {
    return this.lstDetallePago.reduce((acc, p) => acc + p.monto, 0);
  }


  onMontoChange(pago: any, value: number) {
    const montoValido = typeof value === 'number' && value >= 0;
    pago.monto = montoValido ? value : 0;
  }

  cerrar(data: any) {
    this.refDatoItem.close({ data });
  }

}