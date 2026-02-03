import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { OrdenCompraItem } from '@interfaces';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ReservaService } from '../reserva.service';
import { SharedAppService } from '@sharedAppService';
import { HabitacionesService } from '../../habitacion/habitaciones.service';

@Component({
  selector: 'app-cm-transferir-items',
  templateUrl: './cm-transferir-items.component.html',
  styleUrls: ['./cm-transferir-items.component.scss']
})
export class CmTransferirItemsComponent implements OnInit, OnDestroy {
  private readonly IGV = 0.18;
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = '';
  lstHabitaciones: any[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  s_monto!: number;
  s_igv!: number;
  montoTotal: number = 0;
  data: any;
  existeHabitacionTransferible: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public readonly dialogService: DialogService,
    private readonly serviceReserva: ReservaService,
    private readonly serviceHotel: HabitacionesService,
    private readonly serviceSharedApp: SharedAppService
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    console.log('CmTransferirItemsComponent data:', this.data);

    this.createFrm();
    this.obtenerHabitaciones();
    this.lstItemOC = this.data.items;
    this.calcularMontosCompra();
  }

  ngOnDestroy(): void {
    this.$listSubcription.forEach(sub => sub.unsubscribe());
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      idprod: [{ value: null, disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  obtenerHabitaciones() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Transfiriendo reservas...';
    this.existeHabitacionTransferible = false;
    const objeto = {
      codproducto: '',
      idfamilia: 125,
      idsubfamilia: 0,
      desproducto: '',
      idalmacen: 0,
      idprod: 0,
      idusuario: constantesLocalStorage.idusuario,
    };
    this.serviceReserva.listarReservasCombo(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.lstHabitaciones = rpta.reservas;
        this.existeHabitacionTransferible = rpta.reservas.length > 0;
      },
      error: (err) => {
        this.setSpinner(false);
        this.existeHabitacionTransferible = false;
        this.serviceSharedApp.messageToast({ severity: 'error', summary: 'Error', detail: err.message });
      },
      complete: () => {
        this.setSpinner(false);
      },
    });
  }

  calcularMontosCompra() {
    if (this.lstItemOC.length === 0) {
      this.s_monto = 0;
      this.s_igv = 0;
      this.montoTotal = 0;
      return;
    }

    /*const total = this.lstItemOC.reduce(
      (acc, item) => acc + (item.preciocostototal || 0),
      0,
    );
    const igvFactor = 1 + this.IGV;
    this.s_monto = +(total / igvFactor).toFixed(2);
    this.s_igv = +(total - this.s_monto).toFixed(2);
    this.montoTotal = +total.toFixed(2);*/
    const items = this.lstItemOC.map((item: any) => {
      return {
        idprod: item.idprod,
        preciocosto: item.preciocosto,
        cantidad: item.cantidad,
        mtodescuento: item.descuento,
        tipoafectacion: item.tipoigv
      }
    })
    const { tc, idmoneda } = this.data;
    const objeto = {
      porc_detraccion: 0,
      tc,
      idmoneda,
      indmanualdetraccion: false,
      monto_detraccion_mn_manual: 0,
      p_igv: 0,
      idusuario: constantesLocalStorage.idusuario,
      items,
      itemsJson: ""
    }
    const $calculoDetraccionV2 = this.serviceReserva.calculoDetraccionV2(objeto)
      .subscribe({
        next: (rpta: any) => {
          console.log('calculoDetraccionV2...', rpta);
          if (rpta.length === 0) {
            this.setSpinner(false);
            return;
          }

          const data = rpta.datos[0].detraccion[0];

          this.s_monto = data.monto_gravado;
          this.s_igv = data.monto_igv;
          this.montoTotal = data.monto;

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
    this.$listSubcription.push($calculoDetraccionV2)
  }

  transferir() {
    const { idprod } = this.frmDatos.getRawValue();
    if (!idprod) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Debe seleccionar una habitación destino para la transferencia'
      });
      return;
    }

    /*const { idreserva: iddocumentoprc } = this.lstHabitaciones.find(hab => hab.idreserva === idprod) || {};
    if (!iddocumentoprc) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'La habitación destino no tiene una reserva asociada válida'
      });
      return;
    }*/

    const listaItems = this.lstItemOC.map(item => ({
      iditemreserva: item.idordencompraitem,
    }));

    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      iddocumentoprc: idprod, //this.data.idnrooperacion,
      idhabitacion: 0,
      itemsJson: "",
      listaItems
    };

    console.log('Objeto a enviar:', objeto);

    this.setSpinner(true);
    this.mensajeSpinner = 'Transfiriendo reservas...';

    this.serviceHotel.transferirReservaHabitacionItems(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast({
          severity: rpta.procesoSwitch === 0 ? 'success' : 'error',
          summary: rpta.procesoSwitch === 0 ? 'Éxito' : 'Error',
          detail: rpta.mensaje
        });
        this.ref.close(true);
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast({
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

  getDatosReserva(dato: any) {
    console.log('getDatos...', dato);
    /*let provee = this.lstCliente.filter((x: { idcliente: number; }) => x.idcliente === dato);
    this.registerFormRegistro.get('nrodocumento')?.setValue(provee[0].nrodocumento);
    this.registerFormRegistro.get('direccion')?.setValue(provee[0].direcresumen);*/
  }
}
