import { Component, OnDestroy, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CajaService } from '../../caja.service';

@Component({
  selector: 'app-c-cierre-listado',
  templateUrl: './c-cierre-listado.component.html',
  styleUrls: ['./c-cierre-listado.component.scss']
})
export class CCierreListadoComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  listado: any[] = [];
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  visXperfil: boolean = true;
  visListadoGeneral: boolean = true;
  lstRptaProceso: any[] = [];

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

    const $cajaList = this.serviceCaja.cajaList(idlocal, 2)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta cajaList', rpta);
          const _estadoCerrado = 2;
          const data = rpta.map((item: any) => ({
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

  procesarCaja(data: any) {
    console.log('procesarCaja', data);
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    const objeto = {
      idaperturacaja: data.idaperturacaja,
      idcaja: data.idcaja,
      idusuario: constantesLocalStorage.idusuario
    }

    const $aperturaCierreCaja = this.serviceCaja.aperturaCierreCaja(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast({
            severity: 'info',
            summary: 'Información',
            detail: rpta.length === 0 ? 'No se encontraron registros para procesar.' : 'Se procesaron los registros correctamente.'
          });
          console.log('rpta aperturaCierreCaja', rpta);
          this.getDataDetalle(rpta);
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($aperturaCierreCaja)
  }

  getDataDetalle(data: any) {
    if (data.length === 0) {
      this.lstRptaProceso = [];
      this.visListadoGeneral = true;
      return
    }

    this.visListadoGeneral = false;
    this.lstRptaProceso = data;
  }

  async cerrarCaja() {
    const rpta = await this.serviceSharedApp.confirmDialog({
      header: 'Confirmación',
      message: '¿Está seguro de cerrar la caja?',
    });

    if (!rpta) {
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;
    const idusuario = constantesLocalStorage.idusuario;

    const itemInvalido = this.lstRptaProceso.find((item: any) => item.monto_arqueo < 0);

    if (itemInvalido) {
      this.setSpinner(false);
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ingrese un monto de arqueo válido.'
      });
      return;
    }

    const items = this.lstRptaProceso.map((item: any) => {
      const { idaperturacajadetalle, monto_arqueo, monto_saldo_final } = item;

      return {
        idaperturacajadetalle,
        monto_arqueo,
        monto_diferencia: monto_arqueo - monto_saldo_final,
        idusuario
      }
    });

    if (items.length === 0) {
      this.setSpinner(false);
      return;
    }

    const { idaperturacaja } = this.lstRptaProceso[0];
    const objeto = {
      idaperturacaja,
      idusuario,
      items
    }

    const $cierreCaja = this.serviceCaja.cierreCaja(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta cierreCaja', rpta);
          this.serviceSharedApp.messageToast({
            severity: rpta.resultProceso === '0' ? 'success' : 'info',
            summary: rpta.resultProceso === '0' ? 'Éxito' : 'Información',
            detail: rpta.resultProceso === '0' ? 'La caja se cerró correctamente.' : 'No se pudo cerrar la caja.'
          });
          this.getBackListado();
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($cierreCaja)
  }

  getBackListado() {
    this.visListadoGeneral = true;
    this.lstRptaProceso = [];
    this.getListar();
  }

}
