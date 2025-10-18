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
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  ordenHabitacion: any;

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
  }

  toggleMenu(event: Event, data: any) {
    if (data.acciones) {
      this.cargarMenu(data.acciones);
      this.ordenHabitacion = data;
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

    ref.onClose.subscribe((rpta:any) => {
      if(!rpta) { return; }
      
      this.serviceSharedApp.messageToast({
        severity: rpta.data.procesoSwitch === 0 ? 'success' : 'info',
        summary: rpta.data.procesoSwitch === 0 ? 'Exito' : 'Validación...!',
        detail: rpta.data.mensaje
      });

      this.listarHabitacion();
    });
  }

  reservarHabitacion(item: any){
    console.log('Reservar habitación:', item);
    const ref = this.dialogService.open(CmReservaHabitacionComponent, {
      data: item,
      header: item.nomHabitacion,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe(() => {
      this.listarHabitacion();
    });
  }

}