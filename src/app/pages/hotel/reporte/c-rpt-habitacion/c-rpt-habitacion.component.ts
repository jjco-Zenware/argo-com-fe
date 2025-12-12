import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-c-rpt-habitacion',
  templateUrl: './c-rpt-habitacion.component.html',
  styleUrls: ['./c-rpt-habitacion.component.scss']
})
export class CRptHabitacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  dataHabitaciones: any = {};
  dias: number[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";

  constructor() { }

  ngOnInit() {
    this.loadData();
    this.loadDias();
    //this.obtenerData();
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  /*obtenerData() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista


    const $rptHabitaciones = this.service.ordenCompraList()
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          this.dataHabitaciones = rpta;
          this.loadDias();
        },
        error: () => {
          this.setSpinner(false);
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($rptHabitaciones)
  }*/

  loadData() {
    this.dataHabitaciones = {
      "nrodias": 30,
      "habitaciones": [
        {
          "idhabitacion": 101,
          "nrohabitacion": 201,
          "deshabitacion": "Habitación Simple",
          "mensaje": "Disponible parcialmente",
          "idestado": 1,
          "estado": "Disponible",
          "idpersona": 0,
          "nompersona": "",
          "fechas": [
            {
              "nrodia": 10,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-10",
              "idoperacion": 0,
              "idestado": 1,
              "estado": "Libre",
              "idpersona": 0,
              "nompersona": "",
              "mensaje": "Disponible",
              "color": "#4CAF50",
              "icono": "check"
            },
            {
              "nrodia": 11,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-11",
              "idoperacion": 3456,
              "idestado": 2,
              "estado": "Reservado",
              "idpersona": 501,
              "nompersona": "Juan Pérez",
              "mensaje": "Reserva confirmada",
              "color": "#F44336",
              "icono": "lock"
            }
          ]
        },
        {
          "idhabitacion": 102,
          "nrohabitacion": 202,
          "deshabitacion": "Habitación Doble",
          "mensaje": "Ocupada",
          "idestado": 2,
          "estado": "Ocupada",
          "idpersona": 502,
          "nompersona": "María Gómez",
          "fechas": [
            {
              "nrodia": 10,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-10",
              "idoperacion": 6789,
              "idestado": 2,
              "estado": "Ocupada",
              "idpersona": 502,
              "nompersona": "María Gómez",
              "mensaje": "Check-in realizado",
              "color": "#FF9800",
              "icono": "hotel"
            },
            {
              "nrodia": 11,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-11",
              "idoperacion": 6789,
              "idestado": 2,
              "estado": "Ocupada",
              "idpersona": 502,
              "nompersona": "María Gómez",
              "mensaje": "Continúa hospedaje",
              "color": "#FF9800",
              "icono": "hotel"
            }
          ]
        },
        {
          "idhabitacion": 103,
          "nrohabitacion": 203,
          "deshabitacion": "Suite",
          "mensaje": "En limpieza",
          "idestado": 3,
          "estado": "Mantenimiento",
          "idpersona": 0,
          "nompersona": "",
          "fechas": [
            {
              "nrodia": 10,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-10",
              "idoperacion": 0,
              "idestado": 3,
              "estado": "Limpieza",
              "idpersona": 0,
              "nompersona": "",
              "mensaje": "Limpieza programada",
              "color": "#2196F3",
              "icono": "broom"
            },
            {
              "nrodia": 11,
              "nromes": 7,
              "mes": "Julio",
              "nroano": 2025,
              "fecha": "2025-07-11",
              "idoperacion": 0,
              "idestado": 1,
              "estado": "Disponible",
              "idpersona": 0,
              "nompersona": "",
              "mensaje": "Lista para reserva",
              "color": "#4CAF50",
              "icono": "check"
            }
          ]
        }
      ]
    };
  }

  loadDias() {
    const nrodias = this.dataHabitaciones.nrodias || 0;
    this.dias = Array.from({ length: nrodias }, (_, i) => i + 1);
  }

  getFechaInfo(habitacion: any, nrodia: number) {
    if (!habitacion.fechas) return null;
    return habitacion.fechas.find((f: any) => f.nrodia === nrodia) || null;
  }

}
