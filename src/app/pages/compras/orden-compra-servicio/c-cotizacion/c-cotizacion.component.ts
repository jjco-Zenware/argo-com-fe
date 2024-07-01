import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedAppService } from '@sharedAppService';
import { Subscription } from 'rxjs';
import { CotizacionItem, Cotizacion } from '@interfaces';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { globalVariable } from '@constantes';
import { OrdencompraService } from '../service/ordencompra.service';
import { CDatoCotizacionComponent } from '../c-dato-cotizacion/c-dato-cotizacion.component';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './c-cotizacion.component.html',
  styleUrls: ['./c-cotizacion.component.scss'],

})
export class CCotizacionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() IA_data: any;
  @Output() OB_back = new EventEmitter<any>();
  $listSubcription: Subscription[] = [];

  filteredCotizaItems: CotizacionItem[] = [];
  selectedCoti: number = 0;
  nomproveedor!: string ;
  idoportunidad: number = 0;
  headerTitleProducto!: string;
  headerTitleItem!: string;
  headCliente!: string;
  headDescrip!: string;
  headMoneda!: string;
  headFecha!: string;
  lstCotizacionItem: CotizacionItem[] = [];
  lstCotizacion: Cotizacion[] = [];
  titleQuote: string = '';
  titleQuoteOportunidad: string = "";
  headTotalQuote: number = 0;

  blockedDocument: boolean = false;
  mensajeSpinner: string = "Cargando...";

  headTipoCambio: number = 0;
  headNomCreador!: string;
  Cantidad: number = 0;
  PreciocostoTotal: number = 0;
  smonto!: string ;
  simbmoneda!: string;
  stateOptions: any[] = [
    {label: 'Todos', value: '0'}, 
    {label: 'Check', value: '1'}
  ];
  value: string = '0';
  listaQuotes: any[]=[];

  constructor(
    private cdr: ChangeDetectorRef,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private OrdencompraService: OrdencompraService,
  ) { }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['IA_data']) {
      if (this.IA_data.id > 0) {
        this.cargarCabecera();
      this.listarCotizaciones();
      this.ObtenerMonto();
      }        
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  changeCheckBox(team:any) {
    console.log('team...', team);
    this.OB_back.emit(team);
  }

  cargarCabecera() {
    console.log('this.IA_data...', this.IA_data);

    this.listaQuotes = this.IA_data.quotes;
    this.headCliente = this.IA_data.razonsocial;
    this.headDescrip = this.IA_data.description;
    this.headMoneda = this.IA_data.nommoneda;
    this.headFecha = this.IA_data.startDate;
    this.idoportunidad = this.IA_data.id;

    this.headTipoCambio = this.IA_data.tipocambio;
    this.headNomCreador = this.IA_data.nomcreador;
    this.titleQuoteOportunidad = "Quotes de Oportunidad N° - " + this.IA_data.id;
  }

  listarCotizaciones() {
    this.setSpinner(true);

    this.lstCotizacion = [];
    this.lstCotizacionItem = [];
    this.filteredCotizaItems = [];
    const $listarCotizaciones = this.OrdencompraService.listarCotizaciones(this.IA_data.id)
      .subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.log('listarCotizaciones', rpta);
            this.lstCotizacion = rpta.quotes;
            this.selectedCoti = this.lstCotizacion[0].idcotiza;
            this.nomproveedor = this.lstCotizacion[0].nomempresa ;
            this.smonto = this.lstCotizacion[0].s_monto;
            this.simbmoneda = this.lstCotizacion[0].simbmoneda;
            this.cargarFilterItems();
            this.calcularPreciocosto(this.lstCotizacion[0].idcotiza);
            this.calcularPreciocostoTotal(this.lstCotizacion[0].idcotiza);
            this.valCheckbox();
        },
        error: (err) => {
            this.setSpinner(false);
          console.error('error : ', err)
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
            this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listarCotizaciones);
  }

  valCheckbox(){
    for (let i = 0; i < this.listaQuotes.length; i++) {
      let idcotiza = this.listaQuotes[i].idcotiza;
      for (let y = 0; y < this.lstCotizacion.length; y++) {
        if (idcotiza == this.lstCotizacion[y].idcotiza) {
          this.lstCotizacion[y].indseleccion = true;
        }        
      }      
    }
  }

  cargarFilterItems() {
    this.lstCotizacionItem=[];

    if (this.lstCotizacion[0].idcotiza == 0) {
        this.lstCotizacion = [];
    }else{
        for (let i = 0; i < this.lstCotizacion.length; i++) {
            if (this.lstCotizacion[i].items && this.lstCotizacion[i].items.length > 0) {
              for (let y = 0; y < this.lstCotizacion[i].items.length; y++) {
                this.lstCotizacionItem.push(this.lstCotizacion[i].items[y]);
              }
            }
          }
          if (this.lstCotizacionItem.length > 0) {
            this.filteredCotizaItems = this.lstCotizacionItem.filter(item => item.idcotiza === this.selectedCoti);
          }
          this.titleQuote = "Quote (" + this.lstCotizacion.length.toString()+ ")";
    }
    //this.calcularTotalQuote();
    this.ObtenerMonto();
    this.cdr.detectChanges();
  }

  calcularTotalQuote() {
    //console.log('this.lstCotizacionItem...',this.lstCotizacionItem);
        let total = 0;

        if (this.lstCotizacionItem) {
            for (let lista of this.lstCotizacionItem) {
                total = total + lista.preciocostototal;
            }
        }
        this.headTotalQuote= total;
    }

    calcularPreciocosto(id: any) {
        let total = 0;
        if (this.lstCotizacionItem) {
            for (let lstTipiProd of this.lstCotizacionItem) {
                if (lstTipiProd.idcotiza === id) {
                    total = total + lstTipiProd.cantidad;
                }
            }
        }
        this.Cantidad = total;
    }

    calcularPreciocostoTotal(id: any) {
        let total = 0;
        if (this.lstCotizacionItem) {
            for (let lstTipiProd of this.lstCotizacionItem) {
                if (lstTipiProd.idcotiza === id) {
                    total = total + lstTipiProd.preciocostototal;
                }
            }
        }
        this.PreciocostoTotal = total;
    }

  cotizaFilter(dato: any) {
    //console.log('dato...',dato);
    this.selectedCoti = dato.idcotiza;
    this.nomproveedor = dato.nomempresa;
    this.smonto = dato.s_monto;
            this.simbmoneda = dato.simbmoneda;

    this.calcularPreciocosto(dato.idcotiza);
    this.calcularPreciocostoTotal(dato.idcotiza);

    if (this.lstCotizacionItem.length > 0) {
      this.filteredCotizaItems = this.lstCotizacionItem.filter(item => item.idcotiza === dato.idcotiza)
    }
  }

  getCotizacion(data: any, idindicador: number) {
    data.idoportunidad = this.idoportunidad;
    console.log('getCotizacion...', data);

    globalVariable.codigoId = data.idcotiza;
    globalVariable.oportunidadId = this.idoportunidad;

    const objeto = {
      data,
      idindicador: idindicador,
      lstCotizacionItem: this.lstCotizacionItem.filter(item => item.idcotiza === data.idcotiza)
    }

    const ref = this.dialogService.open(CDatoCotizacionComponent, {
      data: objeto,
      header: data.length == 0 ? "Nuevo Quote" : "Editar Quote N° - " + data.idcotiza,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%',
      //height: '60%'
    });

    ref.onClose.subscribe(() => {
      this.listarCotizaciones();
    });
  }

  ObtenerMonto() {
    const $ObtenerMonto = this.OrdencompraService.obtenerMontoOportunidad(this.IA_data.id)
      .subscribe({
        next: (rpta: any) => {
            //console.log('ObtenerMonto', rpta);
            this.headTotalQuote = rpta.montototalquotes;
        },
        error: (err) => {
          console.error('error : ', err)
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        }
      });
    this.$listSubcription.push($ObtenerMonto);
  }
}
