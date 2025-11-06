import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner, c_habitacion } from '@constantes';
import { Subscription } from 'rxjs';
import { HotelService } from '../hotel.service';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-c-produccion-list',
  templateUrl: './c-produccion-list.component.html',
  styleUrls: ['./c-produccion-list.component.scss']
})
export class CProduccionListComponent implements OnInit, OnDestroy {
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
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }]
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
          this.listado = rpta.ordendocumento;
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
        'CODIGO PRODUCTO': this.lstExportExcel[i].codproducto,
        'DESCRIPCIÓN': this.lstExportExcel[i].descripcion,
        'MARCA': this.lstExportExcel[i].nommarca,
        'SUB FAMILIA': this.lstExportExcel[i].nomsubfamilia,
        'TIPO PRODUCTO': this.lstExportExcel[i].nomtipoprod,
      }
      this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'PRODUCCION_HOTEL');
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
