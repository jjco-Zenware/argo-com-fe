import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { HotelService } from '../../produccion/hotel.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-room-list',
  templateUrl: './c-room-list.component.html',
  styleUrls: ['./c-room-list.component.scss']
})
export class CRoomListComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listado: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilitariosService: UtilitariosService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceHotel: HotelService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.getListar();
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      /*fechaInicio: [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
      fechaFin: [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],*/
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }]
    })
  }

  getListar() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.getRawValue()
    };

    const $roomingList = this.serviceHotel.roomingList(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta roomingList: ', rpta);
          this.listado = rpta.hotel[0].roomlist;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($roomingList)
  }

   vistaPreliminar() {
      this.setSpinner(true);
      this.mensajeSpinner = 'Descargando Vista Preliminar...!';
  
      const objeto = {
      ...this.frmDatos.getRawValue()
    };
  
      const $cargarOrdenC = this.serviceHotel.prcDocumentoRoom(objeto).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
  
          const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = 'Room-list';
  
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.target = '_blank';
          a.click();
  
          window.open(url);
  
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
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
        },
      });
      this.$listSubcription.push($cargarOrdenC)
    }

    getExportarExcel() {
     if (this.listado === undefined || this.listado === null) {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail: 'No existen registros para exportar...' });

      return;
    }

     this.setSpinner(true);
     this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
 
     const objeto = {
       ...this.frmDatos.value,
     }
 
     const $getListar = this.serviceHotel.exportarexcelhotelRoom(objeto)
     .subscribe({
       next: (rpta:any) => {
           this.setSpinner(false);
           this.utilitariosService.descargarExcel(rpta, 'RoomList');
       },
       error:(err)=>{
           this.setSpinner(false);
           this.serviceSharedApp.messageToast()
       },
       complete:() => {
         this.setSpinner(false);
       }
     });
   this.$listSubcription.push($getListar)
   }
}
