import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedPrimeNgModule } from '@primeNgModule';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { MsalModule } from '@azure/msal-angular';
import { SharedAppModule } from 'src/app/shared/shared-App.module';
import { SharedAppService } from '@sharedAppService';
import { TimelineModule } from 'primeng/timeline';
import { FileUploadModule } from 'primeng/fileupload';
import { CAgendaComponent } from './c-agenda/c-agenda.component';
import { AgendaRoutingModule } from './agenda-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CModalAgendaComponent } from './modalagenda/c-modalagenda.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoHabitacionService } from '../catalogo-habitacion/catalogo-habitacion.service';


@NgModule({
  declarations: [
    CAgendaComponent,
    CModalAgendaComponent
  ],
  imports: [
    CommonModule,
    SharedPrimeNgModule,
    ReactiveFormsModule,
    HttpClientModule,
    KnobModule,
    FormsModule,
    MsalModule,
    SharedAppModule,
    TimelineModule,
    FileUploadModule,
    AgendaRoutingModule,
    FullCalendarModule
  ],
  providers: [
    
    SharedAppService,
    DialogService,
    CatalogoHabitacionService
  ]
})
export class AgendaModule { }
