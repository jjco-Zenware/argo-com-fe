import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { HabitacionesService } from '../habitaciones.service';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';

@Component({
  selector: 'app-cm-transferencia-reserva',
  templateUrl: './cm-transferencia-reserva.component.html',
  styleUrls: ['./cm-transferencia-reserva.component.scss']
})
export class CmTransferenciaReservaComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";

  data: any;
  habitacionesAgrupadas: any[] = [];

  constructor(
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private readonly serviceHotel: HabitacionesService,
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    console.log('data config: ', this.data);
    this.habitacionesAgrupadas = this.data.habitacionesAgrupadas;
    
    for (const grupo of this.habitacionesAgrupadas) {
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

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  guardar() {
    debugger
    const habitacionesSeleccionadas: any[] = [];
    
    for (const grupo of this.habitacionesAgrupadas) {
      for (const habitacion of grupo.habitaciones) {
        if (habitacion.chkActivo && habitacion.idnrooperacion) {
          habitacionesSeleccionadas.push({
            idreservaTransfiere: habitacion.idnrooperacion
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
      iddocumentoprc: this.data.idnrooperacion,
      reservasJson: "",
      listaReservas: habitacionesSeleccionadas
    };

    console.log('Objeto a enviar:', objeto);

    this.setSpinner(true);
    this.mensajeSpinner = 'Transfiriendo reservas...';

    this.serviceHotel.transferirReservaItems(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reservas transferidas correctamente'
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
