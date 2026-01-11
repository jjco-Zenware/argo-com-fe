import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner, c_habitacion } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-c-liquidacion-list',
  templateUrl: './c-liquidacion-list.component.html',
  styleUrls: ['./c-liquidacion-list.component.scss']
})
export class CLiquidacionListComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listado: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    private serviceSharedApp: SharedAppService,
    private serviceHotel: HotelService,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    //this.listaClientes();
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
      fechaInicio: [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
      fechaFin: [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      tipo: [{ value: 2, disabled: false }]
    })
  }

  getListar() {

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    /*const formValues = this.frmDatos.value;
    const objeto = {
      ...formValues,
      fechaInicio: this.utilitariosService.obtenerFechaFormatoISO(formValues.fechaInicio),
      fechaFin: this.utilitariosService.obtenerFechaFormatoISO(formValues.fechaFin)
    }*/

    const $listarProduccionHotel = this.serviceHotel.listarProduccionHotel({ ...this.frmDatos.getRawValue() })
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta listarProduccionHotel: ', rpta);
          this.listado = rpta.produccion;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listarProduccionHotel)
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
        'ID DOC': this.lstExportExcel[i].idordencompraitem,
        'ID PROD': this.lstExportExcel[i].idprod,
        'FAMILIA': this.lstExportExcel[i].nomfamilia,
        'PRODUCTO': this.lstExportExcel[i].descripcion,
        'CANTIDAD': this.lstExportExcel[i].cantidad,
        'MONEDA': this.lstExportExcel[i].desmoneda,
        'PRECIO': this.lstExportExcel[i].preciocosto,
        'TOTAL': this.lstExportExcel[i].totalmn,
      }
      this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'LIQUIDACION_HOTEL');
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
}
