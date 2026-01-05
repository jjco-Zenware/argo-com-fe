import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalTransacComponent } from '../../modal-trans-registro/modal-transac.component';
import * as FileSaver from 'file-saver';
import { Moneda } from '@interfaces';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-registro-compra',
  templateUrl: './c-registro-compra.component.html',
  styleUrls: ['./c-registro-compra.component.scss']
})
export class CRegistroCompraComponent implements OnInit, OnDestroy {

  $listSubcription: Subscription[] = [];


  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;

  lstCompras: any[] = [];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  dataPrc: any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstProveedores: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  ordenCompra: any;
  lstMonedas: Moneda[] = [];
  visXperfil: boolean = true;
  lstCategoriaDoc: any;

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    public dialogService: DialogService,
    private proyectosService: ProyectosService,
    private serviceSharedApp: SharedAppService,
    private ordencompraService: OrdencompraService,
    private messageService: MessageService,
    private contabilidadService: ContabilidadService,
  ) {

  }

  ngOnInit(): void {
    this.createFrm();
    //this.listaProveedores();
    this.getListar();
    this.listaMonedas();
    this.listarCategoriaDoc();

    if (constantesLocalStorage.idperfil === 11) {
      this.visXperfil = false;
    } else {
      this.visXperfil = true;
    }
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
      fecini: [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
      fecfin: [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      idcliente: [{ value: 0, disabled: false }],
      idcentrocosto: [{ value: 0, disabled: false }],
      ind_estado_fel: [{ value: 0, disabled: false }]
    })
  }

  getListar() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 7
    }

    const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);

          let lista = rpta.ordenescompra;
          if (lista.length > 0) {
            this.lstCompras = lista.filter((idproveedor: any) => { idproveedor !== 0 });
            this.lstCompras = lista.filter(
              (x: { idproveedor: any }) =>
                x.idproveedor !== 0
            );
          }


          if (this.frmDatos.value.idproveedor === 0) {
            this.listaProveedores();
          }


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


  listaProveedores() {

    this.lstProveedores = [];
    const objet = {
      idcliente: 0,
      nomcomercial: 'TODOS'
    }
    this.lstProveedores.unshift(objet);

    let lista = this.lstCompras.filter(
      (obj, index, self) => index === self.findIndex((t) => t.idproveedor === obj.idproveedor)
    );

    lista.forEach(element => {
      let objeto = {
        idcliente: element.idproveedor,
        nomcomercial: element.nomempresa
      }
      this.lstProveedores.unshift(objeto);
    });

    // const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
    //   next: (rpta: any) => {
    //     this.lstProveedores = rpta;
    //     const objet = {
    //       idcliente: 0,
    //       nomcomercial: 'TODOS'
    //     }
    //     this.lstProveedores.unshift(objet);
    //     console.log('this.lstProveedores', this.lstProveedores);
    //   },
    //   error: (err) => {
    //     this.serviceSharedApp.messageToast()
    //   },
    //   complete: () => { },
    // });
    // this.$listSubcription.push($getClientes);

  }

  onVer(data: any) {
    console.log('onVer...', data);
    this.dataPrc = {
      idordencompra: data.idordencompra,
      paramReg: 'V'
    }
    this.tituloDetalle = "VER FACTURA";
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  onVerDetalle(data: any) {
    console.log('onVerDetalle...', data);
    // const refItem = this.dialogService.open(CDetalleFacturaComponent, {
    //   data: data,
    //   header: "Detalle de la Factura N° " + data.nrofactura,
    //   closeOnEscape: false,
    //   styleClass: 'testDialog',
    //   width: '50%'
    // });  

    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Detalle...!';

    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      iddocumentoprc: data.idordencompra,
      codtipoprc: 7,
      idplantilla: 0
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);

        const mediaType = 'application/pdf';
        const blob = new Blob([rpta.body], { type: mediaType });
        const filename = 'DET_FACT_COMPRA_' + data.nrofactura;

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.target = '_blank';
        a.click();

        window.open(url);

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (err) => {
        this.setSpinner(false);
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesQuestion.msgErrorGenerico,
        });
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($cargarOrdenC)
  }

  onEditar(data: any) {
    console.log('onEditar...', data);
    this.dataPrc = {
      idordencompra: data.idordencompra,
      paramReg: 'E'
    }
    this.tituloDetalle = "EDITAR FACTURA ";
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  getDetalle(dato: boolean) {
    this.vistaLista = true;
    this.visDetalle = false;
    this.visQuote = false;
    this.listarCategoriaDoc();
  }

  getBack() {
    this.vistaLista = true;
    this.getListar();
    this.visDetalle = false;
    this.visQuote = false;
    this.listarCategoriaDoc();
  }

  onNuevo() {
    this.tituloDetalle = "REGISTRAR FACTURA";
    this.dataPrc = {
      idordencompra: 0,
      paramReg: 'N'
    }
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  toggleMenu(event: Event, data: any) {
    if (data.acciones) {
      this.cargarMenu(data.acciones);
      this.ordenCompra = data;
      this.menu.toggle(event);
    }
  }

  cargarMenu(data: any) {
    this.menuItems = [];
    data.forEach((item: any) => {
      this.menuItems.push({
        label: item.nomtrx,
        icon: 'pi pi-cog',
        command: () => this.onAccion(item)
      })
    });
  }

  onAccion(item: any) {
    this.ordenCompra.idtrx = item.idtrx;
    let ancho;
    if (item.idtrx === 159) {
      ancho = '20%';
    } else {
      ancho = '40%';
    }
    console.log('onAccion', item);
    console.log('this.ordenCompra', this.ordenCompra);



    const ref = this.dialogService.open(CModalTransacComponent, {
      data: this.ordenCompra,
      header: item.nomtrx,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: ancho
    });

    ref.onClose.subscribe((rpta: any) => {
      console.log('onAccion', rpta);
      if (rpta != undefined) {
        this.getListar();
        if (item.idtrx === 134) {
          this.generarAsiento();
        }
      }


    });
  }

  getExportarExcel(data: any) {
    console.log('filteredValue', data.filteredValue);
    console.log('_value', data._value);
    this.lstExportar = [];
    if (data.filteredValue !== null) {
      this.lstExportExcel = data.filteredValue;
    } else {
      this.lstExportExcel = data._value
    }

    for (let i = 0; i < this.lstExportExcel.length; i++) {
      const objeto = {
        'N°': i + 1,
        'FECHA EMISIÓN': this.lstExportExcel[i].fecemision,
        'FECHA VENCIMIENTO': this.lstExportExcel[i].fecvencimiento,
        'DOCUMENTO': this.lstExportExcel[i].nrofactura,
        'RUC': this.lstExportExcel[i].nrodocumento,
        'PROVEEDOR': this.lstExportExcel[i].nomempresa,
        'CENTRO COSTO': this.lstExportExcel[i].descentrocosto,
        'MONEDA': this.lstExportExcel[i].simbmoneda,
        'BASE IMPONIBLE': this.lstExportExcel[i].s_monto,
        'IGV': this.lstExportExcel[i].s_igv,
        'TOTAL': this.lstExportExcel[i].s_monto_total,
        'GLOSA': this.lstExportExcel[i].s_glosa,
        'ESTADO': this.lstExportExcel[i].nomestado,
        '% DETRACCIÓN': this.lstExportExcel[i].porc_detraccion,
        'S/ DETRACCIÓN': this.lstExportExcel[i].s_monto_detraccion_mn_CTB,

      }
      this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'REGISTRO_COMPRA');
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

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;
        const objet = {
          idmoneda: 0,
          desmoneda: 'TODOS'
        }
        this.lstMonedas.unshift(objet);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }

  generarAsiento() {

    this.setSpinner(true);
    this.mensajeSpinner = 'Generando Asientos...!';
    let s_categoria = this.lstCategoriaDoc.filter((x: { idcategoria: any; }) => x.idcategoria === this.ordenCompra.idcategoria);
    console.log('s_categoria...', s_categoria);

    const objeto = {
      idasiento: 0,
      idreferencia: this.ordenCompra.idordencompra,
      glosaasiento: 'ASIENTO GENERADO DESDE COMPRAS ' + s_categoria[0].nomcategoria,
      idusuario: constantesLocalStorage.idusuario
    }
    const $listaMonedas = this.contabilidadService.asientoPrc(objeto).subscribe({
      next: (rpta: any) => {
        if (rpta.procesoSwitch === 0) {
          this.setSpinner(false);
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: rpta.mensaje });
          //this.traerUno();   traerAsientos              
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: rpta.mensaje });
        }
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($listaMonedas);
  }

  listarCategoriaDoc() {
    let tipo = 7; // compras
    const $listarCategoriaDoc = this.contabilidadService
      .listarCategoriasDoc(tipo)
      .subscribe({
        next: (rpta: any) => {
          console.log('listarCategoriasDoc...', rpta);

          this.lstCategoriaDoc = rpta;
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => { },
      });
    this.$listSubcription.push($listarCategoriaDoc);
  }

}
