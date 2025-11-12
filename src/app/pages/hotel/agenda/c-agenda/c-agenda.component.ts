import { Component, OnInit, ViewChild } from '@angular/core';
import { mensajesQuestion, mensajesSpinner } from '@constantes';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { DialogService } from 'primeng/dynamicdialog';
import { CModalAgendaComponent } from '../modalagenda/c-modalagenda.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CatalogoHabitacionService } from '../../catalogo-habitacion/catalogo-habitacion.service';

@Component({
    selector: 'app-c-agenda',
    templateUrl: './c-agenda.component.html',
    styleUrls: ['./c-agenda.component.scss'],
})

export class CAgendaComponent implements OnInit {

    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    
    $listSubcription: Subscription[] = [];
    Vendedor: any []=[];
    Usuario!: any;
    idcliente: number = 0;
    events: any;
    idvendedor: number = 0;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    desde: any;
    hasta: any;
    periodo: any = new Date();
    lstTareas: any[]= [];

  calendarOptions: CalendarOptions = {
    initialDate: new Date(),
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    locale: esLocale,
    displayEventTime: false,
    dayMaxEventRows: true, // for all non-TimeGrid views
    views: {
      timeGrid: {
        dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
      }
    },
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth, timeGridWeek, timeGridDay,'
    },
    eventClick: (info) => {
      this.mostrarTarea(info.event._def.extendedProps['description']);
    },
    firstDay: 1, // 0=Domingo, 1=Lunes
    dayHeaderFormat: { weekday: 'long' },
    dayHeaderDidMount: (arg) => {

    const day = arg.date.getDay(); // 0=Dom, 1=Lun, ..., 6=Sáb
    },

  };

    constructor(
        private messageService: MessageService,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private serviceCatalogoHabitacion: CatalogoHabitacionService
        ) {
    }

    ngOnInit(): void {
        this.desde = this.utilitariosService.obtenerFechaInicioMes();
        this.hasta = this.utilitariosService.obtenerFechaFinMes();
        this.getBuscar();
      }

      setSpinner(valor: boolean) {
        this.blockedDocument = valor;
      }

    

    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    getBuscar() {
            this.setSpinner(true);
            this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;
            let _eventos: any[]=[];
            this.lstTareas = [];

            const objeto ={
                fechaini: this.desde,
                fechafin: this.hasta,
                idusuario: this.idvendedor,
                idcliente:0,
                idoprotunidad:0            
            }
    
            const $listaTareas = this.serviceCatalogoHabitacion
                .listaAgenda(objeto)
                .subscribe({
                    next: (rpta: any) => {
                        this.setSpinner(false);
                        console.log('rpta listaAgenda', rpta);
                        this.lstTareas = rpta;

                        rpta.forEach((element: any) => {
                            _eventos.push({
                                title: element.descripcion,
                                start:  element.fechainicial,
                                description: element.idtarea,
                                color: element.completo ? 'green' : 'blue'
                            });
                        });

                        this.events = [..._eventos];
                        console.log('this.events', this.events);

                        // redireccionamos el calendario a la fecha seleccionada
                        let calendarApi = this.calendarComponent.getApi();
                        calendarApi.gotoDate(this.periodo); 
                    },
                    error: (err) => {
                        this.setSpinner(false);
                        console.error('error : ', err);
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
            this.$listSubcription.push($listaTareas);
        }

    changePeriodo(dato: any) {
        console.log('changePeriodo', dato);

        this.desde = this.utilitariosService.obtenerFechaInicioMesPeriodo(dato);
        this.hasta = this.utilitariosService.obtenerFechaFinMesPeriodo(dato);
        this.getBuscar();

        // redireccionamos el calendario a la fecha seleccionada
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate(dato); // recibe string 'YYYY-MM-DD' o Date
    }

     mostrarTarea(data: any) {
        console.log('mostrarTarea', data);
        let objeto = this.lstTareas.filter((item: any) => item.idtarea === data);
        const refMensaje = this.dialogService.open(CModalAgendaComponent, {
            data: objeto,
            header: objeto[0].descripcion,
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '25%',
        });
      
    }

    handleDateClick(arg: any) {
    const titulo = prompt('Ingrese el título del evento:');
    if (titulo) {
      this.calendarOptions.events = [
        ...(this.calendarOptions.events as any[]),
        {
          title: titulo,
          start: arg.date,
          allDay: true
        }
      ];
    }
  }

}
