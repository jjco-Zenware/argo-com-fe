
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';

@Component({
  selector: 'app-cm-agregar-producto',
  templateUrl: './cm-agregar-producto.component.html',
  styleUrls: ['./cm-agregar-producto.component.scss']
})
export class CMAgregarProductoComponent implements OnInit, AfterViewInit, OnDestroy {
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

  constructor(
    private fb: FormBuilder,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private almacenService: AlmacenService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.getDataBotones();
    //this.listarFamilia();
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
    let data: any[] = []
    if (this.config.data.tipoProceso === 'P') {
      data = [
        {
          codigo: 825,
          descripcion: "Bar"
        },
        {
          codigo: 725,
          descripcion: "Lavanderia"
        },
        {
          codigo: 225,
          descripcion: "Restaurant"
        },
        {
          codigo: 325,
          descripcion: "Tiendita"
        },
        {
          codigo: 126,
          descripcion: "Otros Serv."
        }
      ]
    } else {
      data = [
        {
          codigo: 125,
          descripcion: "Habitacion"
        },
      ]
    }
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

    const $getListarOrdenCompra = this.almacenService.buscarProducto03(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListarOrdenCompra', rpta);
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
    this.$listSubcription.push($getListarOrdenCompra)
  }

  /*listarFamilia() {
    const $listarFamilia = this.almacenService.listarFamilia().subscribe({
      next: (rpta: any) => {
        this.lstFamilia = rpta;
        const objet = {
          idfamilia: 0,
          nomfamilia: 'TODOS'
        }
        this.lstFamilia.unshift(objet);
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarFamilia);
  }
 
  getSubFamilia(dato: any) {
    const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.info('next : ', rpta);
        this.lstSubFamilia = rpta;
        const objet = {
          idsubfamilia: 0,
          nomsubfamilia: 'TODOS'
        }
        this.lstSubFamilia.unshift(objet);
      },
      error: (err) => {
        this.setSpinner(false);
        console.info('error : ', err);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesQuestion.msgErrorGenerico,
        });
      },
      complete: () => { },
    });
    this.$listSubcription.push($getSubFamilia);
  }*/

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

  cerrar(data: any) {
    // const objeto = {
    //   ...data,
    // }
    this.refDatoItem.close({ data });
  }
}
