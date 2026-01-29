import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CmReservaHabitacionComponent } from '../../habitacion/cm-reserva-habitacion/cm-reserva-habitacion.component';
import { HabitacionesService } from '../../habitacion/habitaciones.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { SharedAppService } from '@sharedAppService';
import { CModalExcTransacHotelComponent } from '../../habitacion/modal-exc-transac-hotel/modal-exc-transac-hotel.component';

@Component({
  selector: 'app-c-rpt-habitacion',
  templateUrl: './c-rpt-habitacion.component.html',
  styleUrls: ['./c-rpt-habitacion.component.scss']
})
export class CRptHabitacionComponent implements OnInit, AfterViewInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  dataHabitaciones: any = [];
  dias: number[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  vistaLista: boolean = true;
  visSeccionReserva: boolean = false;
  dataPrc: any;
  dataLeyenda: any = [];

  menuContextualVisible = false;
  menuContextualTop = 0;
  menuContextualLeft = 0;
  menuContextualData: any = null;

  opcionesMenuContextual: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    public serviceHotel: HabitacionesService,
    private readonly utilitariosService: UtilitariosService,
    private readonly serviceSharedApp: SharedAppService,
  ) { }

  ngOnInit() {
    this.createFrm();
    this.changeFechas();
    this.obtenerData();
  }

  ngAfterViewInit() {
    window.addEventListener('click', this.closeContextMenu);
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      fechainicio: [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
      fechafin: [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idhotel: [{ value: 0, disabled: false }],
    });
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  obtenerData() {
    const fechaInicio = this.frmDatos.get('fechainicio')?.value;
    const fechaFin = this.frmDatos.get('fechafin')?.value;

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Aviso', detail: 'La fecha de inicio no puede ser mayor a la fecha de fin' });
      return;
    }

    const diffTime = Math.abs(new Date(fechaFin).getTime() - new Date(fechaInicio).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Aviso', detail: 'La diferencia entre las fechas no puede ser mayor a 30 días' });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const $planingReservasTraer = this.serviceHotel.planingReservasTraer(this.frmDatos.getRawValue())
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          this.dataHabitaciones = rpta.hotel[0].habitaciones;
          this.dataLeyenda = rpta.hotel[0].leyenda;
          //console.log("dataHabitaciones: ", this.dataHabitaciones);

          this.loadDias(rpta.hotel[0].nrodias || 0);
        },
        error: () => {
          this.setSpinner(false);
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($planingReservasTraer)
  }

  loadDias(nrodias: number) {
    this.dias = Array.from({ length: nrodias }, (_, i) => i + 1);
  }

  getFechaInfo(habitacion: any, nrodia: number) {
    if (!habitacion.fechas) return null;
    return habitacion.fechas.find((f: any) => f.nrodia === nrodia) || null;
  }

  procesarReserva(item: any) {
    console.log('Procesar reserva para:', item);
    if (item.idoperacion) {
      this.getReserva(item);
    } else {
      this.reservarHabitacion(item);
    }
  }

  getReserva(item: any): void {
    console.log('Habitación seleccionada:', item);

    //this.onAccionReservas({idnrooperacion: habitacion.idnrooperacion})
    this.vistaLista = false;
    this.visSeccionReserva = true;
    this.dataPrc = {
      idordencompra: item.idoperacion,
      paramReg: 'E',
      visBtnFacturacion: true
    }
  }

  reservarHabitacion(item: any) {
    console.log('Reservar habitación:', item);
    const data = {
      ...item,
      tipoProceso: 'PLANING',
    }
    const ref = this.dialogService.open(CmReservaHabitacionComponent, {
      data,
      header: item.nomHabitacion,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe(() => {
      this.obtenerData()
    });
  }

  getBack() {
    this.vistaLista = true;
    this.obtenerData()
  }

  procesarSinFecha(item: any, dia: number) {
    console.log('Procesar sin fecha para:', item);
    console.log('Procesar sin fecha - dia:', dia);
    let _fechaInicio = this.frmDatos.get('fechainicio')?.value;
    if (_fechaInicio) {
      const fecha = new Date(_fechaInicio);
      fecha.setDate(dia);
      _fechaInicio = fecha;
    }
    const habitacionData = {
      idprod: item.idhabitacion,
      idtipoprod: 0,
      nomHabitacion: item.nomHabitacion,
      fechaSeleccionada: _fechaInicio
    };
    this.reservarHabitacion(habitacionData);
  }

  onCellContextMenu(event: MouseEvent, habitacionPorFecha: any) {
    event.preventDefault();
    this.menuContextualData = habitacionPorFecha;
    const menuHeight = 150;
    const windowHeight = window.innerHeight;
    if (event.clientY + menuHeight > windowHeight) {
      this.menuContextualTop = event.clientY - menuHeight;
    } else {
      this.menuContextualTop = event.clientY;
    }
    this.menuContextualLeft = event.clientX;
    if (habitacionPorFecha && Array.isArray(habitacionPorFecha.acciones) && habitacionPorFecha.acciones.length > 0) {
      this.opcionesMenuContextual = habitacionPorFecha.acciones.map((accion: any) => ({
        ...accion,
        etiqueta: accion.nomtrx || 'Acción',
        icono: accion.icono || '',
        accion: () => this.ejecutarAccionHabitacion(accion, habitacionPorFecha)
      }));
    } else {
      this.opcionesMenuContextual = [];
    }
    this.menuContextualVisible = true;
  }

  ejecutarAccionHabitacion(accion: any, habitacion: any) {
    console.log('Acción seleccionada:', accion, 'para habitación:', habitacion);
    this.menuContextualVisible = false;
    const ordenHabitacion = {
      ...habitacion,
      idtrx: accion.idtrx,
      /*idoperacion: habitacion.idnrooperacion,
      idoperacion_item: habitacion.idnrooperacion_item,*/
    }
    console.log('onAccion', habitacion);
    const ref = this.dialogService.open(CModalExcTransacHotelComponent, {
      data: ordenHabitacion,
      header: accion.nomtrx,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe((rpta: any) => {
      if (!rpta) { return; }

      this.serviceSharedApp.messageToast({
        severity: rpta.data.procesoSwitch === 0 ? 'success' : 'info',
        summary: rpta.data.procesoSwitch === 0 ? 'Exito' : 'Validación...!',
        detail: rpta.data.mensaje
      });

      this.obtenerData();
    });
  }

  closeContextMenu = (event?: any) => {
    if (event && event.target && (event.target as HTMLElement).closest('.custom-context-menu')) {
      return;
    }
    this.menuContextualVisible = false;
  }

  accionMenuContextual(item: any) {
    if (item && typeof item.accion === 'function') {
      item.accion(this.menuContextualData);
      this.menuContextualVisible = false;
    }
  }

  changeFechas() {
    this.frmDatos.get('fechainicio')?.valueChanges.subscribe((fechaInicio: any) => {
      if (!fechaInicio) return;
      const fecha = new Date(fechaInicio);
      const lastDay = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      const actualFin = this.frmDatos.get('fechafin')?.value;
      if (!actualFin || new Date(actualFin).getTime() !== lastDay.getTime()) {
        this.frmDatos.get('fechafin')?.setValue(lastDay, { emitEvent: false });
      }
    });

    this.frmDatos.get('fechafin')?.valueChanges.subscribe((fechaFin: any) => {
      if (!fechaFin) return;
      const fecha = new Date(fechaFin);
      const firstDay = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const actualInicio = this.frmDatos.get('fechainicio')?.value;
      if (!actualInicio || new Date(actualInicio).getTime() !== firstDay.getTime()) {
        this.frmDatos.get('fechainicio')?.setValue(firstDay, { emitEvent: false });
      }
    });
  }

}
