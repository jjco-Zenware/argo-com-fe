import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';
import { CatalogoHabitacionService } from '../../catalogo-habitacion/catalogo-habitacion.service';

@Component({
  selector: 'app-cm-agregar-habitacion',
  templateUrl: './cm-agregar-habitacion.component.html',
  styleUrls: ['./cm-agregar-habitacion.component.scss']
})
export class CmAgregarHabitacionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('descripcion') descripcion!: ElementRef<HTMLTextAreaElement>;
  @ViewChild(Table) dt1!: Table;

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstProducto: any;
  lstFamilia: any;
  lstSubFamilia: any;
  verAlm!: boolean;
  lstBotones: any[] = []
  lstTipoHabitacion: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly messageService: MessageService,
    private readonly almacenService: AlmacenService,
    private readonly serviceCatalogoHabitacion: CatalogoHabitacionService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.listarTipoHabitacion();
    this.getDataBotones();
    console.log('this.config.data 01', this.config.data);
    if (this.config.data > 0) {
      this.verAlm = true;
    } else {
      this.verAlm = false;
    }
    if (this.config.data.tipoProceso === 'H') {
      this.getListar(125);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.descripcion?.nativeElement) {
        this.descripcion.nativeElement.focus();
      }
    }, 300);
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      codproducto: [{ value: '', disabled: false }],
      idfamilia: [{ value: 0, disabled: false }],
      idsubfamilia: [{ value: 0, disabled: false }],
      desproducto: [{ value: '', disabled: false }],
      tipohab: [{ value: null, disabled: false }],
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

  getDataBotones() {
    let data: any[] = [
        {
          codigo: 125,
          descripcion: "Buscar"
        },
      ]
    
    this.lstBotones = data;
  }

  getListar(idfamilia: number) {
    //this.dt1.reset();
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    console.log('this.frmDatos...', this.frmDatos.value);
    const objeto = {
      ...this.frmDatos.value,
      idfamilia,
      idsubfamilia: this.frmDatos.value.idsubfamilia === null ? 0 : this.frmDatos.value.idsubfamilia,
      idalmacen: this.config.data.idalmacen
    }
    console.log('this.objeto...', objeto);

    const $buscarProducto06 = this.almacenService.buscarProducto06(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta buscarProducto06', rpta);
          //this.lstProducto = rpta
          const data = rpta.map((item: any) => ({
            ...item,
            cantidad: 1
          }));
          this.lstProducto = data;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($buscarProducto06)
  }

  seleccionarProducto(dato: any) {
    console.log("seleccionarProducto: ", dato);
    if (!dato.cantidad) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'info',
        summary: 'Aviso',
        detail: 'La cantidad debe ser mayor a cero.',
      });
      return;
    }
    dato.serialnumber = dato.serie == null ? '' : dato.serie;

    this.traerUnoProducto(dato.codproducto).then((producto: any) => {

      dato.idprod = producto.idprod;
      dato.nommarca = producto.nommarca;
      dato.despro = producto.despro;
      dato.idmarca = producto.idmarca;
      this.cerrar({ ...dato });
    });
  }

  traerUnoProducto(codigo: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const $traerUno = this.almacenService.traerProductoPorCodigo(codigo)
        .subscribe({
          next: (rpta: any) => {
            console.log('rpta.traerUnoProducto', rpta);
            resolve(rpta);
          },
          error: (err) => {
            this.serviceSharedApp.messageToast();
            reject(err);
          },
          complete: () => { }
        });
      this.$listSubcription.push($traerUno);
    });
  }

  listarTipoHabitacion() {
    const $traerUno = this.serviceCatalogoHabitacion.obtenerItemsTabla(201)
      .subscribe({
        next: (rpta: any) => {
          this.lstTipoHabitacion = rpta;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($traerUno)
  }

  cerrar(data: any) {
    // const objeto = {
    //   ...data,
    // }
    this.refDatoItem.close({ data });
  }
}
