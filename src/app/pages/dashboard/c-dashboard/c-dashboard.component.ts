import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
    selector: 'app-c-dashboard',
    templateUrl: './c-dashboard.component.html',
    styleUrls: ['./c-dashboard.component.scss'],
})

export class CDashboardComponent implements OnInit {

    //tareasDias:any;
    nomUsuario: string;
    nomPerfil: string;

    $listSubcription: Subscription[] = [];
    events: any;
    Cliente: any;
    Proveedor: any;
    event: any;
    dataCT: any;
    idperfil: number = 0;
   
    annio!: Date;
    lstQ: any[]=[];
    verbtn: number = 1;

    chartMonthlyData: any;
    chartMonthlyOptions: any;

    constructor(private route: ActivatedRoute,
      protected router: Router,
        private messageService: MessageService,
        private utilitariosService: UtilitariosService
        ) {

        console.log('constantesLocalStorage', constantesLocalStorage);

        this.nomUsuario = constantesLocalStorage.nombreUsuario;
        this.nomPerfil = '@' + constantesLocalStorage.nomperfil;
        this.idperfil = constantesLocalStorage.idperfil;
    }


  ngOnInit(): void {
    this.monthlyChartInit();   
  }      

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  monthlyChartInit() {
    this.chartMonthlyData = this.getChartData();
    this.chartMonthlyOptions = this.getChartOptions();
  }

  getChartData() {
      const { limeColor, amberColor, orangeColor, blueColor, lightblueColor,
          cyanColor, tealColor, greenColor, lightgreenColor } = this.getColors();

      return {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
          datasets: [                
              
              // {
              //     label: '2019',
              //     data: [31, 9, 18, 76, 6, 11, 79],
              //     borderColor: tealColor,
              //     backgroundColor: tealColor,
              //     borderWidth: 2,
              //     fill: true
              // },
              // {
              //     label: '2020',
              //     data: [85, 37, 47, 29, 2, 10, 54],
              //     borderColor: greenColor,
              //     backgroundColor: greenColor,
              //     borderWidth: 2,
              //     fill: true
              // },
              // {
              //     label: '2021',
              //     data: [28, 48, 40, 19, 86, 27, 90],
              //     borderColor: lightgreenColor,
              //     backgroundColor: lightgreenColor,
              //     borderWidth: 2,
              //     fill: true
              // },
              // {
              //     label: '2022',
              //     data: [89, 18, 95, 18, 97, 61, 54],
              //     borderColor: limeColor,
              //     backgroundColor: limeColor,
              //     borderWidth: 2,
              //     fill: true
              // },
              {
                  label: '2024',
                  data: [18, 36, 39, 58, 41, 50, 72,50],
                  borderColor: tealColor,
                  backgroundColor: tealColor,
                  borderWidth: 2,
                  fill: true
              },
              {
                  label: '2025',
                  data: [31, 4, 35, 74, 47, 35, 46, 4],
                  borderColor: greenColor,
                  backgroundColor: greenColor,
                  borderWidth: 2,
                  fill: true
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
              legend: {
                  display: true,
                  labels: {
                      fontFamily,
                      color: textColor
                  }
              },
          },
          animation: {
              animateScale: true,
              animateRotate: true
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  ticks: {
                      fontFamily,
                      color: textColor
                  },
                  grid: {
                      color: gridLinesColor
                  }
              },
              x: {
                  categoryPercentage: .9,
                  barPercentage: .8,
                  ticks: {
                      fontFamily,
                      color: textColor
                  },
                  grid: {
                      color: gridLinesColor
                  }
              }
          },
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

 

  goCuentaCobrar( ) {   
    this.router.navigate(['/pages/tesoreria/cuentaporcobrar'])
  }

  goCuentaPagar( ) {  
    this.router.navigate(['/pages/tesoreria/cuentaporpagar'])    
  }

  goCajaChica( ) {  
    this.router.navigate(['/pages/tesoreria/cajachica'])    
  }

  goFlujoCaja( ) {  
    this.router.navigate(['/pages/tesoreria/flujocaja'])    
  }
}
