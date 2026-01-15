import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner, constantesLocalStorage } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ReservaService } from '../reserva.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Moneda } from '@interfaces';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

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
  lstTipoCambio: any[] = [];
  lstMonedas: Moneda[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public refDatoItem: DynamicDialogRef,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceReserva: ReservaService,
    private readonly proyectosService: ProyectosService,
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    console.log('data Modal', this.data);
    this.createFrm();
    this.obtenerItemsTabla();
    this.obtenerTipoCambio();
    this.listaMonedas();
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
        coditem: metodo.coditem,
        idmoneda: this.data.idmoneda,
        metodo: metodo.valoritem,
        montoPago: 0,
        montoAplicado: 0,
        referencia: ''
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
        console.log("lstMetodoPago response: ", rpta);
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

  /*changeTipoMoneda(codMoneda: number, index: number) {
    console.log("changeTipoMoneda: ", codMoneda);
    const monedaSoles: number = 1;
    let montoAplicado: number;
    if (codMoneda === monedaSoles) {
      montoAplicado = this.lstDetallePago[index].montoPago;
    } else {
      const tipoCambio = this.lstTipoCambio.length > 0 ? this.lstTipoCambio[0].tc_venta : 0;
      montoAplicado = this.lstDetallePago[index].montoPago * tipoCambio;
    }
    this.lstDetallePago[index].montoAplicado = montoAplicado;
  }*/

  getPagar() {
    if (!this.isTotalPagoValido()) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El monto a pagar no puede ser diferente al total a pagar.'
      });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjProcesando;
    console.log("data : ", JSON.stringify(this.data));

    const lstformapago = this.lstDetallePago.map((item: any) => {
      return {
        idpagodocitem: 0,
        idpagodocprc: 0,
        idformapago: item.iditem,
        idmoneda: item.idmoneda,
        montopago: item.montoPago,
        montoaplicado: item.montoAplicado,
        referencia: item.referencia || '',
        idbanco: 0,
        idusuario: constantesLocalStorage.idusuario
      };
    });

    const objeto = {
      idpagodocprc: 0,
      iddocumentoprc: this.data.idordencompra,
      tc: this.lstTipoCambio.length > 0 ? this.lstTipoCambio[0].tc_venta : 0,
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
    return this.totalPago === Number.parseFloat(this.data.totalPagar);
  }

  get totalPago(): number {
    return this.lstDetallePago.reduce((acc, p) => acc + p.montoAplicado, 0);
  }

  onMontoPagoChange(pago: any, value: number, index:number) {
    const montoValido = typeof value === 'number' && value >= 0;
    pago.montoPago = montoValido ? value : 0;
    
    if(pago.montoPago === 0) { return; }

    const monedaSoles: number = 1;
    let montoAplicado: number = 0;
    const codMoneda = this.lstDetallePago[index].idmoneda;;
    if (codMoneda === monedaSoles) {
      montoAplicado = pago.montoPago;
    } else {
      const tipoCambio = this.lstTipoCambio.length > 0 ? this.lstTipoCambio[0].tc_venta : 0;
      montoAplicado = Number((pago.montoPago * tipoCambio).toFixed(2));
    }

    this.lstDetallePago[index].montoAplicado = montoAplicado;
  }

  obtenerTipoCambio() {
    const $obtenerTipoCambio = this.serviceReserva.obtenerTipoCambio().subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log("obtenerTipoCambio response: ", rpta);
        this.lstTipoCambio = rpta
      },
      error: (err: any) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($obtenerTipoCambio)
  }

  listaMonedas() {
    const $obtenerTipoCambio = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.lstMonedas = rpta;
      },
      error: (err: any) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($obtenerTipoCambio)

  }

  cerrar(data: any) {
    this.refDatoItem.close({ data });
  }

}