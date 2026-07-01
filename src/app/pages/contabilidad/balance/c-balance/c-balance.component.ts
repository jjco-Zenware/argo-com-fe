import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from '../../../../services/utilitarios.service';
import { TesoreriaService } from '../../../tesoreria/service/tesoreriaServices';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-c-balance',
  templateUrl: './c-balance.component.html',
  styleUrls: ['./c-balance.component.scss']
})
export class CBalanceComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstBancos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    dataDet: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private tesoreriaService: TesoreriaService,     
        private serviceSharedApp: SharedAppService,         
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'razonsocial', header: 'NOMBRE ' },
          { field: 'destipobanco', header: 'TIPO BANCO' },
          { field: 'idtipodoc', header: 'TIPO DOC' },
          { field: 'nrodoc', header: 'NRO DOC' },
          { field: 'codctactble', header: 'CTA CTBLE' },
          { field: 'codigobcr', header: 'BCR'},
          { field: 'codbancosbs', header: 'SBS'},
          { field: 'codbancosunat', header: 'SUNAT'}
          
      ];
    }

    createFrm(){
        this.frmDatos = this.fb.group({
          fecini: [
            {
              value: this.utilitariosService.obtenerFechaInicioMes(),
              disabled: false,
            },
          ],
          fecfin: [
            {
              value: this.utilitariosService.obtenerFechaFinMes(),
              disabled: false,
            },
          ],
          idusuario: [
            {
              value: constantesLocalStorage.idusuario,
              disabled: false,
            },
          ],
        })
      }

    ngOnDestroy(): void {
      if (this.$listSubcription != undefined) {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
      }
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
    }

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista


      const periodo = (this.frmDatos.get('fecini')?.value).getFullYear().toString() + ('0' + ((this.frmDatos.get('fecini')?.value).getMonth() + 1)).slice(-2);
      console.log('periodo...', periodo)
      
      const $getListarOrdenCompra = this.tesoreriaService.listarbalancecomprobacion(periodo)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('getListar', rpta);
              this.lstBancos = rpta;
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
          }
        });
      this.$listSubcription.push($getListarOrdenCompra)
    }

    getExportarExcel() {
        const periodoDate: Date = this.frmDatos.get('fecini')?.value;
        const mes = String(periodoDate.getMonth() + 1).padStart(2, '0');
        const anio = periodoDate.getFullYear();
        const periodoStr = `${mes}/${anio}`;

        const empresa = 'ZENWARE E.I.R.L';
        const direccion = 'AV. IGNACIO MERINO 2134 LINCE';

        import('xlsx').then((xlsx) => {
            const aoa: any[][] = [
                [empresa],
                [direccion],
                [`BALANCE DE COMPROBACIÓN - PERIODO: ${periodoStr}`],
                [],
                ['COD PCG', 'CUENTAS DEL MAYOR', 'SUMAS DEL MAYOR', '', 'SALDOS', '', 'INVENTARIO', '', 'RESULTADOS POR NATURALEZA', '', 'RESULTADOS POR FUNCIÓN', ''],
                ['', '', 'DÉBITO', 'CRÉDITO', 'DEUDOR', 'ACREEDOR', 'DEBE', 'HABER', 'PÉRDIDAS', 'GANANCIAS', 'PÉRDIDAS', 'GANANCIAS'],
            ];

            (this.lstBancos || []).forEach((d: any) => {
                aoa.push([
                    d.CodCuenta, d.Descripcion,
                    +d.Mayor_Debito || 0, +d.Mayor_Credito || 0,
                    +d.Saldo_Deudor || 0, +d.Saldo_Acreedor || 0,
                    +d.Inventario_Debe || 0, +d.Inventario_Haber || 0,
                    +d.RxNaturaleza_Perdida || 0, +d.RxNaturaleza_Ganancia || 0,
                    +d.RxFuncion_Perdida || 0, +d.RxFuncion_Ganancia || 0,
                ]);
            });

            aoa.push([
                'TOTALES', '',
                this.totalMayorDebito, this.totalMayorCredito,
                this.totalSaldoDeudor, this.totalSaldoAcreedor,
                this.totalInventarioDebe, this.totalInventarioHaber,
                this.totalRxNatPerdida, this.totalRxNatGanancia,
                this.totalRxFunPerdida, this.totalRxFunGanancia,
            ]);

            const worksheet = xlsx.utils.aoa_to_sheet(aoa);

            worksheet['!cols'] = [
                { wch: 12 }, { wch: 42 }, { wch: 16 }, { wch: 16 },
                { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
                { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
            ];

            worksheet['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
                { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
                { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } },
                { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
                { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } },
                { s: { r: 4, c: 2 }, e: { r: 4, c: 3 } },
                { s: { r: 4, c: 4 }, e: { r: 4, c: 5 } },
                { s: { r: 4, c: 6 }, e: { r: 4, c: 7 } },
                { s: { r: 4, c: 8 }, e: { r: 4, c: 9 } },
                { s: { r: 4, c: 10 }, e: { r: 4, c: 11 } },
            ];

            const workbook = { Sheets: { 'BALANCE': worksheet }, SheetNames: ['BALANCE'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, `BALANCE_COMPROBACION_${mes}_${anio}`);
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        FileSaver.saveAs(data, fileName + '.xlsx');
    }

    get totalMayorDebito(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Mayor_Debito || 0), 0); }
    get totalMayorCredito(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Mayor_Credito || 0), 0); }
    get totalSaldoDeudor(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Saldo_Deudor || 0), 0); }
    get totalSaldoAcreedor(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Saldo_Acreedor || 0), 0); }
    get totalInventarioDebe(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Inventario_Debe || 0), 0); }
    get totalInventarioHaber(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.Inventario_Haber || 0), 0); }
    get totalRxNatPerdida(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.RxNaturaleza_Perdida || 0), 0); }
    get totalRxNatGanancia(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.RxNaturaleza_Ganancia || 0), 0); }
    get totalRxFunPerdida(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.RxFuncion_Perdida || 0), 0); }
    get totalRxFunGanancia(): number { return (this.lstBancos || []).reduce((s: number, d: any) => s + (+d.RxFuncion_Ganancia || 0), 0); }

    onVer(dato: any) {
      this.tituloDetalle =  dato.razonsocial;
      this.dataDet = {
        idcodigo: dato.idbanco,
        paramReg:'V'
      } 
      this.vistaLista = false;
    }

    onEditar(dato: any) {
      this.tituloDetalle = dato.razonsocial;
      this.dataDet = {
        idcodigo: dato.idbanco,
        paramReg:'E'
      }
      this.vistaLista = false;
    } 

    getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    onNuevo() {        
      this.tituloDetalle = "REGISTRAR BANCO ";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
    }
   
}
