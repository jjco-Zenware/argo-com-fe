import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HabitacionesService } from '../habitaciones.service';
import { Subscription } from 'rxjs';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { CModalExcTransacHotelComponent } from '../modal-exc-transac-hotel/modal-exc-transac-hotel.component';
import { CmReservaHabitacionComponent } from '../cm-reserva-habitacion/cm-reserva-habitacion.component';
import { CmTransferenciaReservaComponent } from '../cm-transferencia-reserva/cm-transferencia-reserva.component';

export interface I_GrupoHabitacionesPorUbicacion {
  idubicacion: number;
  rutaubicacion: string;
  habitaciones: any[];
}

@Component({
  selector: 'app-c-habitacion-list',
  templateUrl: './c-habitacion-list.component.html',
  styleUrls: ['./c-habitacion-list.component.scss']
})
export class CHabitacionListComponent implements OnInit, OnDestroy {
  habitacionesAgrupadas: I_GrupoHabitacionesPorUbicacion[] = [];
  $listSubcription: Subscription[] = [];

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listadoHabitacion: any[] = [];
  menuItemsAcciones: MenuItem[] = [];
  menuItemsReservas: MenuItem[] = [];
  menuItemsFacturacion: MenuItem[] = [];
  @ViewChild('menuAccion') menuAccion!: Menu;
  @ViewChild('menuReserva') menuReserva!: Menu;
  @ViewChild('menuFacturacion') menuFacturacion!: Menu;
  ordenHabitacion: any;
  vistaLista: boolean = true;
  dataPrc: any;
  visSeccionReserva: boolean = false;
  visSeccionFacturacion: boolean = false;

  constructor(
    public dialogService: DialogService,
    private serviceHabitacion: HabitacionesService,
    private serviceSharedApp: SharedAppService,
  ) { }

  ngOnInit(): void {
    this.listarHabitacion();
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  listarHabitacion() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto =
    {
      codproducto: "",
      idfamilia: 325,
      idsubfamilia: 525,
      desproducto: "",
      idalmacen: 0,
      idprod: 0,
      idusuario: constantesLocalStorage.idusuario
    }

    const $listarhabitacion = this.serviceHabitacion.listarhabitacion(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);
          this.listadoHabitacion = rpta.habitaciones;
          this.habitacionesAgrupadas = this.getHabitacionesAgrupadasPorUbicacion(this.listadoHabitacion);
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listarhabitacion)
  }

  getHabitacionesAgrupadasPorUbicacion(listado: any[]): I_GrupoHabitacionesPorUbicacion[] {
    const grupos: { [key: string]: I_GrupoHabitacionesPorUbicacion } = {};
    listado.forEach(h => {
      if (!grupos[h.rutaubicacion]) {
        grupos[h.rutaubicacion] = {
          idubicacion: h.idubicacion,
          rutaubicacion: h.rutaubicacion,
          habitaciones: []
        };
      }
      grupos[h.rutaubicacion].habitaciones.push(h);
    });
    return Object.values(grupos);
  }

  trackByHabitacion(index: number, habitacion: any): any {
    return habitacion.id || habitacion.nomHabitacion || index;
  }

  getHabitacion(habitacion: any): void {
    console.log('Habitación seleccionada:', habitacion);
    if (habitacion.idnrooperacion === 0) {
      /*this.serviceSharedApp.messageToast({
        severity: 'info',
        summary: 'Aviso',
        detail: 'La habitación no tiene una operación asociada.'
      });*/
      return;
    }

    this.onAccionReservas({idnrooperacion: habitacion.idnrooperacion})
  }

  toggleMenuAcciones(event: Event, data: any) {
    if (data.acciones) {
      this.cargarMenuAcciones(data.acciones);
      this.ordenHabitacion = data;
      this.menuAccion.toggle(event);
    }
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
    this.ordenHabitacion.idtrx = item.idtrx;
    this.ordenHabitacion.idoperacion = item.idnrooperacion;
    this.ordenHabitacion.idoperacion_item = item.idnrooperacion_item;
    console.log('onAccion', item);
    const ref = this.dialogService.open(CModalExcTransacHotelComponent, {
      data: this.ordenHabitacion,
      header: item.nomtrx + ' - ' + this.ordenHabitacion.nomHabitacion,
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

      this.listarHabitacion();
    });
  }

  reservarHabitacion(item: any) {
    console.log('Reservar habitación:', item);
    const data = {
      ...item,
      tipoProceso: 'RESERVA',
    }
    const ref = this.dialogService.open(CmReservaHabitacionComponent, {
      data,
      header: item.nomHabitacion,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe(() => {
      this.listarHabitacion();
    });
  }

  toggleMenuReservas(event: Event, data: any) {
    if (data.reservas) {
      this.cargarMenuReservas(data.reservas);
      this.ordenHabitacion = data;
      this.menuReserva.toggle(event);
    }
  }

  cargarMenuReservas(data: any) {
    this.menuItemsReservas = [];
    data.forEach((item: any) => {
      this.menuItemsReservas.push({
        label: item.lineareserva,
        icon: 'pi pi-cog',
        command: () => this.onAccionReservas(item)
      })
    });
  }

  onAccionReservas(item: any) {
    this.vistaLista = false;
    this.visSeccionReserva = true;
    this.visSeccionFacturacion = false;
    this.dataPrc = {
      idordencompra: item.idnrooperacion,
      paramReg: 'E',
      visBtnFacturacion: true
    }
  }

  getBack() {
    this.vistaLista = true;
    this.listarHabitacion();
  }

  toggleMenuFacturacion(event: Event, data: any) {
    if (data.facturacion) {
      this.cargarMenuFacturacion(data.facturacion);
      this.ordenHabitacion = data;
      this.menuFacturacion.toggle(event);
    }
  }

  cargarMenuFacturacion(data: any) {
    this.menuItemsFacturacion = [];
    data.forEach((item: any) => {
      this.menuItemsFacturacion.push({
        label: item.lineareserva,
        icon: 'pi pi-cog',
        command: () => this.onAccionFacturacion(item)
      })
    });
  }

  onAccionFacturacion(item: any) {
    debugger
    this.vistaLista = false;
    this.visSeccionReserva = false;
    this.visSeccionFacturacion = true;
    this.dataPrc = {
      iddocumentoprc_origen: item.idnrooperacion,
      paramReg: 'E',
      visBtnFacturacion: true
    }
  }

  getTransferenciaReserva(idnrooperacion: number) {
    console.log('getTransferenciaReserva:', idnrooperacion);
    const ref = this.dialogService.open(CmTransferenciaReservaComponent, {
      data: { idnrooperacion, habitacionesAgrupadas: this.habitacionesAgrupadas },
      header: 'Transferencia de Reserva',
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '70%'
    });

    ref.onClose.subscribe(() => {
      this.listarHabitacion();
    });
  }

}