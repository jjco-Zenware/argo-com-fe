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

  getExportarExcel(data: any) {
    this.setSpinner(true);
    this.mensajeSpinner = "Exportando datos a Excel..."

    this.lstExportar = [];
    if (data.filteredValue !== undefined) {
      this.lstExportExcel = data.filteredValue;
    } else {
      this.lstExportExcel = data._value
    }

    for (let i = 0; i < this.lstExportExcel.length; i++) {
      const objeto = {
        'N°': i + 1,
        'HABITACION': this.lstExportExcel[i].nomhabitacion,
        'TIPO': this.lstExportExcel[i].tipohabitacion,
        'ESTADO': this.lstExportExcel[i].estado,
        'PAX': this.lstExportExcel[i].PAX,
        'TIPO DOCUMENTO': this.lstExportExcel[i].tipodoc,
        'NRO DOCUMENTO': this.lstExportExcel[i].nrodoc,
        'NACIONALIDAD': this.lstExportExcel[i].nacionalidad,
        'EMPRESA': this.lstExportExcel[i].empresa,
        'FECHA DE INGRESO': this.lstExportExcel[i].ingreso,
        'FECHA DE SALIDA': this.lstExportExcel[i].salida,
      }
      this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'ROOMING_LIST_HOTEL');
    });

    this.setSpinner(false);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
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
}
