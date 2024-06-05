import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { constantesLocalStorage, globalVariable, mensajesQuestion, mensajesSpinner, respuestaProceso } from '@constantes';
import { CotizacionItem, CasoNegocio, Secciones } from '@interfaces';
import { Subscription } from 'rxjs';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CDatoCotizacionViewComponent } from '../c-dato-cotizacion-view/c-dato-cotizacion-view.component';

@Component({
  selector: 'app-c-business-case',
  templateUrl: './c-business-case.component.html',
  styleUrls: ['./c-business-case.component.scss'],
})
export class CBusinessCaseComponent implements OnInit, OnChanges, OnDestroy {
    @Input() IS_codigo: string = '';
    @Output() OB_back = new EventEmitter<boolean>();
    $listSubcription: Subscription[] = [];
    filteredProd!: CotizacionItem[];
    filteredProdAll: CotizacionItem[] = [];
    selectedProd!: number;
    selectedProdColor: string = "";
    lstCasoNegocio: CasoNegocio[] = [];
    lstSecciones: Secciones[] = [];
    lstCotizacionItem: CotizacionItem[] = [];
    cotizacionItemNew!: CotizacionItem;
    headCliente: string = '';
    headDescrip!: string;
    headMoneda!: string;
    headFecha!: string;
    preVtaUnitario!: number;
    preVtaTotal!: number;
    preProfit!: number;
    titleTabla:string='';
    totalSecciones:number=0;
    titleBusinessCase: string = "";

    blockedDocument: boolean = false;
    mensajeSpinner: string = "Cargando...";

    codestadoBC: boolean = true;

    headTipoCambio: number = 0;
    headImporte!: number;
    headMargen: number = 0;
    headProfit!: number;
    headNomCreador!: string;
    mostrarPorProducto: boolean = true;
    mostrarResumen: boolean = false;
    mostrarPorProveedor: boolean = false;
    headNomPreventa!: string;

    totalPrecioventatotal!: number;
    totalPreprofit!: number;
    totalPreciocosto!:  number;
    totalPreciocostototal!: number;
    totalPrecioventa!: number;


  constructor(
    private cdr: ChangeDetectorRef,
    private serviceProyecto: ProyectosService,
    private serviceSharedApp: SharedAppService,
    public dialogService: DialogService,
  ) { }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IS_codigo']) {
      console.log('IS_codigo',this.IS_codigo);
      this.listarCasoNegocio();
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  listarCasoNegocio() {
    this.setSpinner(true);
    //this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

    this.lstCasoNegocio = [];
    this.lstSecciones = [];
    this.lstCotizacionItem = [];
    this.filteredProd = [];
    this.filteredProdAll = [];
    const objeto ={
      idoportunidad: this.IS_codigo,
      idusuario: constantesLocalStorage.idusuario,
    }
    const $listarCasoNegocio = this.serviceProyecto.listarCasoNegocio(objeto)
      .subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.log('lstCasoNegocio', rpta);
          this.lstCasoNegocio = rpta;
          this.cargarFilterItems();
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => {

        }
      });
    this.$listSubcription.push($listarCasoNegocio);
  }

  cargarFilterItems() {

    for (let i = 0; i < this.lstCasoNegocio.length; i++) {
      this.lstCasoNegocio[i].secciones.forEach((item) => {
        this.lstSecciones.push({ ...item })
      });
    }

    if (this.lstSecciones.length > 0) {
      this.selectedProd = this.lstSecciones[0].idtipoprod;
      this.selectedProdColor = this.lstSecciones[0].badgeColor;
      this.cargarItems(this.lstSecciones);
      this.cargarCabecera();
    }
  }

  cargarItems(lista: Secciones[]) {
    for (let x = 0; x < lista.length; x++) {
      lista[x].itemsQuote.forEach((item) => {
        this.lstCotizacionItem.push({...item})
      });
    }

    if (this.lstCotizacionItem.length > 0) {
        console.log('this.lstCotizacionItem', this.lstCotizacionItem);
        this.mostrarPorProducto = false;
        this.mostrarResumen = true;
        this.mostrarPorProveedor = false;
        //this.filteredProd = this.lstCotizacionItem.filter(item => item.idtipoprod === this.selectedProd);
        this.filteredProd = this.lstCotizacionItem;
        //this.titleTabla = team.nomtipoproducto.concat('( ',this.filteredProd.length.toString(),')')
        this.calcularTotales();
      }

    //const _totalSecciones =this.lstCotizacionItem.length > 0 ? this.lstCotizacionItem.filter(item => item.idtipoprod === this.selectedProd):[];
    this.titleTabla = this.lstSecciones[0].nomtipoproducto.concat('( ',this.filteredProd.length.toString(),')')

  }

  cargarCabecera() {
    console.log('this.lstCasoNegocio[0]', this.lstCasoNegocio[0]);
    this.headCliente = this.lstCasoNegocio[0].razonsocial;
    this.headDescrip = this.lstCasoNegocio[0].descripcion;
    this.headMoneda = this.lstCasoNegocio[0].desmoneda;
    this.headFecha = this.lstCasoNegocio[0].fecoportunidad;

    this.headTipoCambio = this.lstCasoNegocio[0].tipocambio;
    this.headImporte = this.lstCasoNegocio[0].monto;
    this.headMargen = this.lstCasoNegocio[0].margen;
    this.headProfit = this.lstCasoNegocio[0].profit;
    this.headNomCreador = this.lstCasoNegocio[0].nomusuariocomercial;
    this.headNomPreventa = this.lstCasoNegocio[0].nomusuariopreventa;
    this.titleBusinessCase = 'Business Case de Oportunidad N° - ' + this.lstCasoNegocio[0].idoportunidad ;
    this.cdr.detectChanges();
  }

  itemsFilter(team: any) {
    console.log('team...', team);
    this.filteredProd = [];
    this.selectedProd = team.idtipoprod;
    this.selectedProdColor = team.badgeColor;

    // if (team.idtipoprod == 0) {
    //     console.log('this.lstCotizacionItem...', this.lstCotizacionItem);
    //     this.mostrarPorProducto = false;
    //     this.mostrarResumen = true;
    //     this.mostrarPorProveedor = false;
    //     this.filteredProd = this.lstCotizacionItem;
    // }
    // else{
    //     this.mostrarPorProducto = true;
    //     this.mostrarResumen = false;
    //     this.mostrarPorProveedor = false;
    //     this.filteredProd = this.lstCotizacionItem.filter(item => item.idtipoprod === this.selectedProd);
    // }
    switch (team.idtipoprod) {
      case 0:
          this.mostrarPorProducto = false;
          this.mostrarResumen = true;
          this.mostrarPorProveedor = false
          this.filteredProd = this.lstCotizacionItem;
      break;
      case 8:
          this.mostrarPorProducto = false;
          this.mostrarResumen = false;
          this.mostrarPorProveedor = true
          this.filteredProd = this.lstCotizacionItem;
      break;

      default:
          this.mostrarPorProducto = true;
          this.mostrarResumen = false;
          this.mostrarPorProveedor = false
          this.filteredProd = this.lstCotizacionItem.filter(item => item.idtipoprod === this.selectedProd);
      break;
  }

    // this.mostrarPorProducto = true;
    //     this.mostrarResumen = false;
    //     this.filteredProd = this.lstCotizacionItem.filter(item => item.idtipoprod === this.selectedProd);

    this.titleTabla = team.nomtipoproducto.concat('( ',this.filteredProd.length.toString(),')')
    this.calcularTotales();

  }

  verResumen() {
    this.mostrarPorProducto = false;
    this.mostrarResumen = true;
    this.filteredProd = this.lstCotizacionItem.sort((a, b) => {{a.idtipoprod > b.idtipoprod?1:-1}
     return 0;
    });
    this.selectedProdColor = "bg-primary-900";
    let titulo="Resumen Business Case";

    this.titleTabla = titulo.concat('( ',this.filteredProd.length.toString(),')')
    this.calcularTotales();

  }

  calcularTotales() {
        console.log('this.filteredProd...', this.filteredProd);
        let totalpreventot = 0;
        let totalprofit = 0;
        let totalprecosto = 0;
        let totalprecostotot = 0;
        let totalpreve = 0;

        for (let lstCotiza of this.filteredProd) {
            totalpreventot = totalpreventot + lstCotiza.precioventatotal;
            totalprofit = totalprofit + lstCotiza.preprofit;
            totalprecosto = totalprecosto + lstCotiza.preciocosto;
            totalprecostotot = totalprecostotot + lstCotiza.preciocostototal;
            totalpreve = totalpreve +lstCotiza.precioventa;
        }

        this.totalPrecioventatotal = totalpreventot;
        this.totalPreprofit = totalprofit;
        this.totalPreciocosto = totalprecosto;
        this.totalPreciocostototal = totalprecostotot;
        this.totalPrecioventa = totalpreve;
    }

    calcularPreciocosto(id: number) {
        let total = 0;

        if (this.filteredProd) {
            for (let lstTipiProd of this.filteredProd) {
                if (lstTipiProd.idtipoprod === id) {
                    total = total + lstTipiProd.preciocosto;
                }
            }
        }

        return total;
    }

    calcularPreciocostoTotal(id: number) {
        let total = 0;

        if (this.filteredProd) {
            for (let lstTipiProd of this.filteredProd) {
                if (lstTipiProd.idtipoprod === id) {
                    total = total + lstTipiProd.preciocostototal;
                }
            }
        }

        return total;
    }

    calcularPrecioVenta(id: number) {
        let total = 0;

        if (this.filteredProd) {
            for (let lstTipiProd of this.filteredProd) {
                if (lstTipiProd.idtipoprod === id) {
                    total = total + lstTipiProd.precioventa;
                }
            }
        }

        return total;
    }

    calcularPrecioVentaTotal(id: number) {
        let total = 0;

        if (this.filteredProd) {
            for (let lstTipiProd of this.filteredProd) {
                if (lstTipiProd.idtipoprod === id) {
                    total = total + lstTipiProd.precioventatotal;
                }
            }
        }

        return total;
    }

    calcularProfitProvee(id: number) {
      let total = 0;

      if (this.filteredProd) {
          for (let lstTipiProd of this.filteredProd) {
              if (lstTipiProd.idproveedor === id) {
                  total = total + lstTipiProd.preprofit;
              }
          }
      }

      return total;
  }

  calcularPrecioVentaTotalProvee(id: number) {
      let total = 0;

      if (this.filteredProd) {
          for (let lstTipiProd of this.filteredProd) {
              if (lstTipiProd.idproveedor === id) {
                  total = total + lstTipiProd.precioventatotal;
              }
          }
      }

      return total;
  }

  calcularPreciocostoProvee(id: number) {
      let total = 0;

      if (this.filteredProd) {
          for (let lstTipiProd of this.filteredProd) {
              if (lstTipiProd.idproveedor === id) {
                  total = total + lstTipiProd.preciocostototal;
              }
          }
      }

      return total;
  }

    calcularProfit(id: number) {
        let total = 0;

        if (this.filteredProd) {
            for (let lstTipiProd of this.filteredProd) {
                if (lstTipiProd.idtipoprod === id) {
                    total = total + lstTipiProd.preprofit;
                }
            }
        }

        return total;
    }

  calcularMargen(event: any) {
    this.preVtaUnitario =  parseInt((event.preciocosto / (1 - (event.margen) / 100)).toFixed(2));

    this.preVtaTotal = parseInt((event.cantidad * this.preVtaUnitario).toFixed(2));

    this.preProfit = parseInt((this.preVtaTotal - event.preciocostototal).toFixed(2));
    let _posicion:number=this.filteredProd.findIndex((x=>x.idcotizaitem == event.idcotizaitem))

    this.filteredProd[_posicion].margen = event.margen;
    this.filteredProd[_posicion].precioventa = this.preVtaUnitario;
    this.filteredProd[_posicion].precioventatotal = this.preVtaTotal;
    this.filteredProd[_posicion].preprofit = this.preProfit;

    console.log('this.filteredProd[_posicion]...', this.filteredProd[_posicion]);

    this.calcularTotales();

    let _posAll:number=this.filteredProdAll.findIndex((x=>x.idcotizaitem == event.idcotizaitem))
    if (_posAll != -1){
      this.filteredProdAll.splice(_posAll, 1)
    }
    this.filteredProdAll.push(this.filteredProd[_posicion]);


  }

  getBack(){
    this.OB_back.emit(true);
  }

  verQuoteItems(data: any)
    {
        this.setSpinner(true);
        const $listarCotizacionUno = this.serviceProyecto.listarCotizacionUno(data.idcotiza)
          .subscribe({
            next: (rpta: any) => {
                console.log('listarCotizacionUno', rpta.quotes);
                this.verDetalle(rpta.quotes);
                this.setSpinner(false);
            },
            error: (err) => {
              console.error('error : ', err)
              this.serviceSharedApp.messageToast()
            },
            complete: () => {
            }
          });
        this.$listSubcription.push($listarCotizacionUno);
    }

    verDetalle(data: any) {

      console.log('verDetalle...', data, this.lstCasoNegocio[0].idoportunidad);
      globalVariable.codigoId = data[0].idcotiza;
      globalVariable.oportunidadId = this.lstCasoNegocio[0].idoportunidad;

       const objeto = {
          data: data[0],
          idindicador: 3,
          lstCotizacionItem: data[0].items,
          idoportunidad: this.lstCasoNegocio[0].idoportunidad,
          idnroproceso: data[0].idcotiza
        }

        console.log('objeto........', objeto);
        const ref = this.dialogService.open(CDatoCotizacionViewComponent, {
          data: objeto,
          header: "Cotización N° - " + data[0].idcotiza,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '50%',
        });
    }
}
