import { Component, OnDestroy, OnInit } from '@angular/core';
import { HabitacionesService } from '../habitaciones.service';
import { Subscription } from 'rxjs';
import { mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-habitacion-list',
  templateUrl: './c-habitacion-list.component.html',
  styleUrls: ['./c-habitacion-list.component.scss']
})
export class CHabitacionListComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listadoHabitacion: any[] = [];

  constructor(
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
      idprod: 0
    }

    const $listarhabitacion = this.serviceHabitacion.listarhabitacion(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);
          this.listadoHabitacion = rpta

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

  trackByHabitacion(index: number, habitacion: any): any {
    return habitacion.id || habitacion.nomHabitacion || index;
  }

  getHabitacion(habitacion: any): void {
    console.log('Habitación seleccionada:', habitacion);
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'DISPONIBLE':
        return '#28a745';
      case 'OCUPADA':
        return '#dc3545';
      case 'MANTENIMIENTO':
        return '#ffc107';
      case 'LIMPIEZA':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  }

  getEstadoSeverity(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'DISPONIBLE':
        return 'success';
      case 'OCUPADA':
        return 'danger';
      case 'MANTENIMIENTO':
        return 'warning';
      case 'LIMPIEZA':
        return 'info';
      default:
        return 'secondary';
    }
  }

}