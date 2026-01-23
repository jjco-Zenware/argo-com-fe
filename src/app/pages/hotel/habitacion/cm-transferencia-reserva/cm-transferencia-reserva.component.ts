import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { HabitacionesService } from '../habitaciones.service';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ReservaService } from '../../reserva/reserva.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-cm-transferencia-reserva',
  templateUrl: './cm-transferencia-reserva.component.html',
  styleUrls: ['./cm-transferencia-reserva.component.scss']
})
export class CmTransferenciaReservaComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";

  data: any;
  habitacionesAgrupadas: any[] = [];
  existeHabitacionTransferible: boolean = false;
  lstHabitaciones: any[] = []

  constructor(
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private readonly serviceHotel: HabitacionesService,
    private readonly serviceReserva: ReservaService,
    private readonly serviceSharedApp: SharedAppService
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    this.createFrm();
    this.getHabitaciones();
    this.habitacionesAgrupadas = this.data.habitacionesAgrupadas;

    /*this.existeHabitacionTransferible = false;
    for (const grupo of this.habitacionesAgrupadas) {
      for (const habitacion of grupo.habitaciones) {
        if (habitacion.idnrooperacion && habitacion.idnrooperacion > 0) {
          this.existeHabitacionTransferible = true;
          break;
        }
      }
      if (this.existeHabitacionTransferible) break;
    }*/

    for (const grupo of this.habitacionesAgrupadas) {
      /*grupo.habitaciones = grupo.habitaciones.filter(
        (habitacion: any) => habitacion.idnrooperacion && habitacion.idnrooperacion > 0);*/
      for (const habitacion of grupo.habitaciones) {
        habitacion.chkActivo = false;
      }
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      for (const sub of this.$listSubcription) {
        sub.unsubscribe();
      }
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      idprod: [{ value: 0, disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getHabitaciones() {
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
    this.serviceReserva.listarHabitacionesCombo3(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.lstHabitaciones = rpta.habitaciones;
        this.existeHabitacionTransferible = rpta.habitaciones.length > 0;
      },
      error: (err) => {
        this.setSpinner(false);
        this.existeHabitacionTransferible = false;
        this.messageService.clear();
        this.messageService.add({
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

  transferir() {
    const { idprod } = this.frmDatos.getRawValue();
    if(!idprod) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Debe seleccionar una habitación destino para la transferencia'
      });
      return;
    }

    const { idreserva: iddocumentoprc } = this.lstHabitaciones.find(hab => hab.idprod === idprod) || {};
    if(!iddocumentoprc) {
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'La habitación destino no tiene una reserva asociada válida'
      });
      return;
    }

    const habitacionesSeleccionadas: any[] = [];
    for (const grupo of this.habitacionesAgrupadas) {
      for (const habitacion of grupo.habitaciones) {
        if (habitacion.chkActivo && habitacion.idprod /*idnrooperacion*/) {
          habitacionesSeleccionadas.push({
            //idreservaTransfiere: habitacion.idnrooperacion
            idreservaTransfiere: habitacion.idprod
          });
        }
      }
    }

    if (habitacionesSeleccionadas.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Aviso',
        detail: 'Debe seleccionar al menos una habitación para transferir'
      });
      return;
    }

    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      iddocumentoprc, //this.data.idnrooperacion,
      idhabitacion: idprod,
      reservasJson: "",
      listaReservas: habitacionesSeleccionadas
    };

    console.log('Objeto a enviar:', objeto);

    this.setSpinner(true);
    this.mensajeSpinner = 'Transfiriendo reservas...';

    this.serviceHotel.TransferirReservaHabitacion(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.messageService.add({
          severity: rpta.procesoSwitch === 0 ? 'success' : 'error',
          summary: rpta.procesoSwitch === 0 ? 'Éxito' : 'Error',
          detail: rpta.mensaje
        });
        this.ref.close(true);
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
        this.setSpinner(false);
      },
    });
  }

  trackByHabitacion(index: number, habitacion: any): any {
    return habitacion.id || habitacion.idnrooperacion || index;
  }

  getHabitacion(habitacion: any): void {
    console.log('Habitación seleccionada:', habitacion);
  }
}
