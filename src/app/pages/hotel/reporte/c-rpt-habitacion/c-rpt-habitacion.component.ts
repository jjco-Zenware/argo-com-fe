import { Component, OnDestroy, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CmReservaHabitacionComponent } from '../../habitacion/cm-reserva-habitacion/cm-reserva-habitacion.component';
import { HabitacionesService } from '../../habitacion/habitaciones.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-rpt-habitacion',
  templateUrl: './c-rpt-habitacion.component.html',
  styleUrls: ['./c-rpt-habitacion.component.scss']
})
export class CRptHabitacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  dataHabitaciones: any = [];
  dias: number[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  vistaLista: boolean = true;
  visSeccionReserva: boolean = false;
  dataPrc: any;

  constructor(
    private fb: FormBuilder,
    public dialogService: DialogService,
    public serviceHotel: HabitacionesService,
    private utilitariosService: UtilitariosService,
    private serviceSharedApp: SharedAppService,
  ) { }

  ngOnInit() {
    this.createFrm();
    this.obtenerData();
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
    })
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

  dataMockup() {
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

  loadDias(nrodias:number) {
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
    const ref = this.dialogService.open(CmReservaHabitacionComponent, {
      data: item,
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
    const habitacionData = {
      idprod: item.idhabitacion,
      idtipoprod: 0,
      nomHabitacion: item.deshabitacion
    };
    this.reservarHabitacion(habitacionData);
  }
}
