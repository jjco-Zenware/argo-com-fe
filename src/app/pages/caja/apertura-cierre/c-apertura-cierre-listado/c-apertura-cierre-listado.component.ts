import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { CajaService } from '../../caja.service';

@Component({
  selector: 'app-c-apertura-cierre-listado',
  templateUrl: './c-apertura-cierre-listado.component.html',
  styleUrls: ['./c-apertura-cierre-listado.component.scss']
})
export class CAperturaCierreListadoComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  listado: any[] = [];
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  visXperfil: boolean = true;

  constructor(
    public readonly dialogService: DialogService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceCaja: CajaService,
  ) { }

  ngOnInit(): void {
    this.getListar();
    this.visXperfil = constantesLocalStorage.idperfil !== 11
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getListar() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    const { idlocal } = constantesLocalStorage;

    const $cajaList = this.serviceCaja.cajaList(idlocal)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta cajaList', rpta);
          const _estadoCerrado = 2;
          const data = rpta.map((item:any)=>({
            ...item,
            estadoCerrado: item.idestadocaja === _estadoCerrado
          }))

          this.listado = data
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($cajaList)
  }

  getExportarExcel(data: any) {
    this.lstExportar = [];
    if (data.filteredValue === undefined) {
      this.lstExportExcel = data._value
    } else {
      this.lstExportExcel = data.filteredValue;
    }

    for (let i = 0; i < this.lstExportExcel.length; i++) {
      const objeto = {
        'N°': i + 1,
        'FECHA EMISIÓN': this.lstExportExcel[i].fecemision,
        'FECHA VENCIMIENTO': this.lstExportExcel[i].fecvencimiento,
        'DOCUMENTO': this.lstExportExcel[i].nrofactura,
        'RUC': this.lstExportExcel[i].nrodocumento,
        'CLIENTE': this.lstExportExcel[i].nomempresa,
        'CENTRO COSTO': this.lstExportExcel[i].descentrocostoPRY,
        'MONEDA': this.lstExportExcel[i].simbmoneda,
        'BASE IMPONIBLE': this.lstExportExcel[i].ind_estado_fel === 4 ? 0 : this.lstExportExcel[i].s_monto,
        'IGV': this.lstExportExcel[i].ind_estado_fel === 4 ? 0 : this.lstExportExcel[i].s_igv,
        'TOTAL': this.lstExportExcel[i].ind_estado_fel === 4 ? 0 : this.lstExportExcel[i].s_monto_total,
        'ESTADO': this.lstExportExcel[i].nomestadofel,
        '% DETRACCIÓN': this.lstExportExcel[i].ind_estado_fel === 4 ? 0 : this.lstExportExcel[i].porc_detraccion,
        'S/ DETRACCIÓN': this.lstExportExcel[i].ind_estado_fel === 4 ? 0 : this.lstExportExcel[i].s_monto_detraccion_mn_CTB,

      }
      this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'REGISTRO_VENTA');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  getSeverity(data: any) {
    let color;
    switch (data) {
      case 0:
        color = 'primary'
        break;
      case 1:
        color = 'success'
        break;
      case 2:
        color = 'danger'
        break;
      case 3:
        color = 'warning'
        break;
      case 4:
        color = 'danger'
        break;
      case 5:
        color = 'warning'
        break;
    }
    return color;
  }

  procesarCaja(data: any){
    console.log('procesarCaja', data);
  }
  
}
