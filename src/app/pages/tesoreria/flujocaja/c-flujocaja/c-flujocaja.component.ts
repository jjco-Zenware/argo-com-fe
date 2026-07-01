import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
  selector: 'app-c-flujocaja',
  templateUrl: './c-flujocaja.component.html',
  styleUrls: ['./c-flujocaja.component.scss']
})

export class CFlujoCajaComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstProveedor: any;
  lstFlujoCaja: any[] = [];
  lstmontomesA: number[] = [];
  lstmontomesB: number[] = [];
  lstmontomesC: number[] = [];

  totalVentas: number = 0;
  totalCostos: number = 0;
  totalUtilidad: number = 0;
  margenBruto: number = 0;

  chartMonthlyDataA: any;
  chartMonthlyDataB: any;
  chartMonthlyDataC: any;
  chartMonthlyDataT: any;
  chartMonthlyOptions: any;
  chartMonthlyOptionsT: any;


  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public dialogService: DialogService  ,
      private confirmationService: ConfirmationService,  
      private serviceSharedApp: SharedAppService,
      private messageService: MessageService,
      private tesoreriaService: TesoreriaService, 
      private proyectosService: ProyectosService,
      
    ){    
      
  }

  ngOnInit(): void{
      this.createFrm();
      this.listaMonedas();

    this.getListar();
      
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idmoneda: [{ value: 0, disabled: false }],
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
    console.log('this.frmDatos...', (this.frmDatos.value.fecini).getFullYear());
    let anio = (this.frmDatos.value.fecini).getFullYear();

    const $getListar = this.tesoreriaService.listarFlujoCaja(anio)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta);

            this.lstFlujoCaja = rpta;
            this.lstmontomesC = [];
            this.lstFlujoCaja.forEach(element => {
              if (element.tipo === "C" ) {
                this.lstmontomesC = [element.enero, element.febrero, element.marzo, element.abril, element.mayo, element.junio, element.julio, element.agosto, element.xxxx, element.octubre, element.noviembre, element.diciembre];
              }
               if (element.tipo === "A" ) {
                this.lstmontomesA = [element.enero, element.febrero, element.marzo, element.abril, element.mayo, element.junio, element.julio, element.agosto, element.xxxx, element.octubre, element.noviembre, element.diciembre];
              }
               if (element.tipo === "B" ) {
                this.lstmontomesB = [element.enero, element.febrero, element.marzo, element.abril, element.mayo, element.junio, element.julio, element.agosto, element.xxxx, element.octubre, element.noviembre, element.diciembre];
              }
            });
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.totalVentas = this.lstmontomesA.reduce((a, b) => a + b, 0);
          this.totalCostos = this.lstmontomesB.reduce((a, b) => a + b, 0);
          this.totalUtilidad = this.lstmontomesC.reduce((a, b) => a + b, 0);
          this.margenBruto = this.totalVentas !== 0 ? (this.totalUtilidad / this.totalVentas) * 100 : 0;
          this.monthlyChartInit();
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListar)
  }

  selectHeaders(tabNumber: any) {
    if (tabNumber.index === 0) {
      //this.lstExportExcel = this.products;
    }else{
      //this.lstExportExcel = this.products;
    }
  }


  getExportarExcel(data :any) {
    this.lstExportar = [];
    console.log(data);
    if (data.filteredValue !== undefined) {
      this.lstExportExcel = data.filteredValue;
    }
    console.log( 'this.lstExportar...',  this.lstExportar);

    
    for (let i = 0; i < this.lstExportExcel.length; i++) {       
        const objeto = {
            'N°': i + 1,
            'TIPO': this.lstExportExcel[i].nomtipoorden,
            'N° ORDEN': this.lstExportExcel[i].codigonroorden,
            'N° RUC': this.lstExportExcel[i].nrodocumento,
            'PROVEEDOR': this.lstExportExcel[i].nomcomercial,
            'COD PROYECTO' : this.lstExportExcel[i].codigoproyecto,
            'NOM PROYECTO' : this.lstExportExcel[i].nomproyecto,
            'MONEDA': this.lstExportExcel[i].nommoneda,
            'BASE IMPONIBLE': this.lstExportExcel[i].s_monto,
            'IGV': this.lstExportExcel[i].s_igv,
            'TOTAL': this.lstExportExcel[i].s_monto_total,
            'ESTADO' : this.lstExportExcel[i].nomestado
            
        }
        this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Orden Compra');
      });
    }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_'+ EXCEL_EXTENSION);
  }  
  
  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }

   monthlyChartInit() {
    this.chartMonthlyDataA = this.getChartDataA();
    this.chartMonthlyDataB = this.getChartDataB();
    this.chartMonthlyDataC = this.getChartDataC();
    this.chartMonthlyDataT = this.getChartDataT();
    this.chartMonthlyOptions = this.getChartOptions();
    this.chartMonthlyOptionsT = this.getChartOptionsT();
  }

  getChartDataA() {
    const { greenColor } = this.getColors();
    const year = (this.frmDatos.value.fecini).getFullYear().toString();
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: year,
        data: this.lstmontomesA,
        borderColor: greenColor,
        backgroundColor: 'rgba(102, 187, 106, 0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: greenColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };
  }

  getChartDataB() {
    const { lightblueColor } = this.getColors();
    const year = (this.frmDatos.value.fecini).getFullYear().toString();
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: year,
        data: this.lstmontomesB,
        borderColor: lightblueColor,
        backgroundColor: 'rgba(41, 182, 246, 0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: lightblueColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };
  }

  getChartDataC() {
    const { orangeColor } = this.getColors();
    const year = (this.frmDatos.value.fecini).getFullYear().toString();
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: year,
        data: this.lstmontomesC,
        borderColor: orangeColor,
        backgroundColor: 'rgba(255, 167, 38, 0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: orangeColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    };
  }

  getChartDataT() {
    const { greenColor, lightblueColor, orangeColor } = this.getColors();
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          type: 'bar',
          label: 'Ventas',
          data: this.lstmontomesA,
          backgroundColor: 'rgba(102, 187, 106, 0.75)',
          borderColor: greenColor,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          type: 'bar',
          label: 'Costos',
          data: this.lstmontomesB,
          backgroundColor: 'rgba(41, 182, 246, 0.75)',
          borderColor: lightblueColor,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          type: 'line',
          label: 'Utilidad',
          data: this.lstmontomesC,
          borderColor: orangeColor,
          backgroundColor: 'rgba(255, 167, 38, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: orangeColor,
          pointRadius: 4,
          pointHoverRadius: 7,
        }
      ]
    };
  }

  getChartOptions() {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--surface-border') || 'rgba(160, 167, 181, .3)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `S/ ${ctx.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
          }
        }
      },
      animation: { duration: 600 },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            fontFamily,
            color: textColor,
            callback: (value: number) => {
              if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value;
            }
          },
          grid: { color: gridLinesColor }
        },
        x: {
          ticks: { fontFamily, color: textColor },
          grid: { color: 'transparent' }
        }
      }
    };
  }

  getColors() {
      const isLight = true;
      return {
          pinkColor: isLight ? '#EC407A' : '#F48FB1',
          purpleColor: isLight ? '#AB47BC' : '#CE93D8',
          deeppurpleColor: isLight ? '#7E57C2' : '#B39DDB',
          indigoColor: isLight ? '#5C6BC0' : '#9FA8DA',
          blueColor: isLight ? '#42A5F5' : '#90CAF9',
          lightblueColor: isLight ? '#29B6F6' : '#81D4FA',
          cyanColor: isLight ? '#00ACC1' : '#4DD0E1',
          tealColor: isLight ? '#26A69A' : '#80CBC4',
          greenColor: isLight ? '#66BB6A' : '#A5D6A7',
          lightgreenColor: isLight ? '#9CCC65' : '#C5E1A5',
          limeColor: isLight ? '#D4E157' : '#E6EE9C',
          yellowColor: isLight ? '#FFEE58' : '#FFF59D',
          amberColor: isLight ? '#FFCA28' : '#FFE082',
          orangeColor: isLight ? '#FFA726' : '#FFCC80',
          deeporangeColor: isLight ? '#FF7043' : '#FFAB91',
          brownColor: isLight ? '#8D6E63' : '#BCAAA4'
      };
  }

  getChartOptionsT() {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--surface-border') || 'rgba(160, 167, 181, .3)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { fontFamily, color: textColor, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.dataset.label}: S/ ${ctx.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
          }
        }
      },
      animation: { duration: 700 },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            fontFamily,
            color: textColor,
            callback: (value: number) => {
              if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value;
            }
          },
          grid: { color: gridLinesColor }
        },
        x: {
          categoryPercentage: 0.8,
          barPercentage: 0.7,
          ticks: { fontFamily, color: textColor },
          grid: { color: 'transparent' }
        }
      }
    };
  }
}
