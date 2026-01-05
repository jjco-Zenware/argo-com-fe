import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { dOperacion, Moneda } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import * as FileSaver from 'file-saver';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CModalTransacComponent } from 'src/app/pages/compras/modal-trans-registro/modal-transac.component';
import { CMotivoComponent } from '../../modalanular/c-modalanular.component';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-registro-venta',
  templateUrl: './c-registro-venta.component.html',
  styleUrls: ['./c-registro-venta.component.scss']
})
export class CRegistroVentaComponent implements OnInit, OnDestroy {

  $listSubcription: Subscription[] = [];


  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;

  lstCompras: any[] = [];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  cols: any[] = [];
  dataPrc: any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstProveedores: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  menuItemsSunat: MenuItem[] = [];
  @ViewChild('menuSunat') menuSunat!: Menu;
  ordenCompra: any;
  lstMonedas: Moneda[] = [];
  lstAccionesSunatMostrar: any[] = [];
  lstEstados: any[] = [
    { codestadofel: 0, nomestadofel: 'TODOS' },
    { codestadofel: 1, nomestadofel: 'ACEPTADO' },
    { codestadofel: 2, nomestadofel: 'ERROR' },
    { codestadofel: 3, nomestadofel: 'EN PROCESO' },
    { codestadofel: 4, nomestadofel: 'ANULADO' },
    { codestadofel: 4, nomestadofel: 'EN PROCESO ANULACIÓN' }
  ];
  visXperfil: boolean = true;
  lstAccionesSunat: any = [
    {
      operacion: 'consultar_comprobante',
      tipo_de_comprobante: '',
      serie: '',
      numero: '',
      label: 'Consultar'
    },
    {
      operacion: 'generar_anulacion',
      tipo_de_comprobante: '',
      serie: '',
      numero: '',
      label: 'Generar Anulación'
    },
    {
      operacion: 'consultar_anulacion',
      tipo_de_comprobante: '',
      serie: '',
      numero: '',
      label: 'Consultar Anulación'
    }


  ]
  lstCategoriaDoc: any;

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    public dialogService: DialogService,
    private proyectosService: ProyectosService,
    private serviceSharedApp: SharedAppService,
    private ordencompraService: OrdencompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private contabilidadService: ContabilidadService,
  ) {

  }

  ngOnInit(): void {
    this.createFrm();
    //this.listaClientes();
    this.getListar();
    this.listaMonedas();
    this.listarCategoriaDoc();
    this.cols = [
      { field: 'fecemision', header: 'ID' },
      { field: 'fecvencimiento', header: 'FECHA' },
      { field: 'nrofactura', header: 'DOCUMENTO' },
      { field: 'nomcomercial', header: 'PROVEEDOR' },
      { field: 'descentrocosto', header: 'CENTRO COSTO' },
      { field: 'codigoproyecto', header: 'PROYECTO ' },
      { field: 'simbmoneda', header: 'MONEDA' },
      { field: 's_monto', header: 'SUBTOTAL' },
      { field: 's_igv', header: 'IGV' },
      { field: 's_monto_total', header: 'TOTAL' },
      { field: 'nomestado', header: 'ESTADO' },
      { field: 'porc_detraccion', header: 'ESTADO' },
      { field: 's_monto_detraccion_mn_CTB', header: 'ESTADO' }
    ];
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
      idtipodocprc: 6
    }

    const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);
          this.lstCompras = rpta.ordenescompra
          if (this.frmDatos.value.idproveedor === 0) {
            this.listaClientes();
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

  listaClientes() {
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
  }

  onVer(data: any) {
    this.dataPrc = {
      idordencompra: data.idordencompra,
      paramReg: 'V'
    }
    this.tituloDetalle = "Ver Factura N° " + data.nrofactura;
    this.vistaLista = false;
    this.visDetalle = true;
    this.visQuote = false;
  }

  onVerDetalle(data: any) {
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
      codtipoprc: 6,
      idplantilla: 0
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);

        const mediaType = 'application/pdf';
        const blob = new Blob([rpta.body], { type: mediaType });
        const filename = 'DET_FACT_VENTA_' + data.nrofactura;

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

  verDocumento(data: any) {
    window.open(data.enlaceFEL);
  }

  onEditar(data: any) {
    this.dataPrc = {
      idordencompra: data.idordencompra,
      paramReg: 'E'
    }
    this.tituloDetalle = "Editar Factura N° " + data.nrofactura;
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
    this.tituloDetalle = "REGISTRAR VENTA";
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
    const ref = this.dialogService.open(CModalTransacComponent, {
      data: this.ordenCompra,
      header: item.nomtrx,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });

    ref.onClose.subscribe((rpta: any) => {
      console.log('onAccion', rpta);
      if (rpta != undefined) {
        this.getListar();
        // if (item.idtrx === 137) {
        //   this.generarAsiento();
        // }
      }

    });
  }

  getExportarExcel(data: any) {
    this.lstExportar = [];
    if (data.filteredValue !== undefined) {
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

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
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

  emitirDocumento(data: any) {

    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message: '¿Estás seguro de Enviar a SUNAT?...',
      accept: () => {
        this.setSpinner(true);
        this.mensajeSpinner = "Enviando...!"

        const objeto = {
          codproceso: 0,
          idusuario: constantesLocalStorage.idusuario,
          idordendocumento: data.idordencompra,
        }

        const $procesarTrx = this.proyectosService.emitirDocumento(objeto).subscribe({
          next: (rpta: any) => {
            console.log('emitirDocumento', rpta);
            this.setSpinner(false);
            if (rpta.aceptada_por_sunat) {
              this.messageService.add({ severity: 'info', summary: 'Aviso', detail: rpta.sunat_description });
              this.getListar();
              this.generarAsiento();
              return;
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: rpta.errors });
              this.getListar();
              return;
            }

          },
          error: (err) => {
            this.setSpinner(false);
            console.error('error : ', err);
            this.serviceSharedApp.messageToast();
          },
          complete: () => {
            this.setSpinner(false);
          },
        });
        this.$listSubcription.push($procesarTrx)
      }
    });


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

  toggleMenuSunat(event: Event, data: any) {
    console.log('toggleMenuSunat', data);
    switch (data.ind_estado_fel) {
      //APROBADO
      case 1:
        console.log('ENTRO 1');
        let lista = this.lstAccionesSunat.filter((item: any) => item.operacion !== 'consultar_comprobante' && item.operacion !== 'consultar_anulacion');
        this.lstAccionesSunatMostrar = lista;
        break;
      //PROCESO 
      case 3:
        console.log('ENTRO 3');
        let lista3 = this.lstAccionesSunat.filter((item: any) => item.operacion !== 'generar_anulacion' && item.operacion !== 'consultar_anulacion');
        this.lstAccionesSunatMostrar = lista3;
        break;
      //PROCESO  
      case 5:
        console.log('ENTRO 5');
        let lista5 = this.lstAccionesSunat.filter((item: any) => item.operacion === 'consultar_anulacion');
        this.lstAccionesSunatMostrar = lista5;
        break;
      default:
        break;
    }

    if (data.acciones) {
      this.cargarMenuSunat(this.lstAccionesSunatMostrar);
      this.ordenCompra = data;
      this.menuSunat.toggle(event);
    }
  }

  cargarMenuSunat(data: any) {
    this.menuItemsSunat = [];
    data.forEach((item: any) => {
      this.menuItemsSunat.push({
        label: item.label,
        icon: 'pi pi-cog',
        command: () => this.onAccionSunat(item)
      })
    });
  }

  onAccionSunat(item: any) {
    console.log('onAccionSunat', item);
    console.log('this.ordenCompra', this.ordenCompra);


    let tipo_de_comprobante = parseInt(this.ordenCompra.tipodoc_ctb);
    let serie = this.ordenCompra.nroserie_ctb;
    let numero = parseInt(this.ordenCompra.nrodocumento_ctb);


    this.setSpinner(true);
    this.mensajeSpinner = "Consultando...!"

    const objeto = {
      operacion: item.operacion,
      tipo_de_comprobante: tipo_de_comprobante,
      serie: serie,
      numero: numero,
      idusuario: constantesLocalStorage.idusuario,
      idordendocumento: this.ordenCompra.idordencompra
    }
    console.log('objeto', objeto);

    if (item.operacion === "generar_anulacion") {
      const ref = this.dialogService.open(CMotivoComponent, {
        data: this.ordenCompra,
        header: "Motivo de Anulación",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '30%'
      });

      ref.onClose.subscribe((rpta: any) => {
        this.setSpinner(false);
        console.log('onClose', rpta);
        const objeto2 = {
          operacion: item.operacion,
          tipo_de_comprobante: tipo_de_comprobante,
          serie: serie,
          numero: numero,
          idusuario: constantesLocalStorage.idusuario,
          idordendocumento: this.ordenCompra.idordencompra,
          motivo: rpta.data.descripcion
        }
        if (rpta != undefined) {
          const $operacionFel = this.proyectosService.operacionFel(objeto2)
            .subscribe({
              next: (rpta: any) => {
                console.log('operacionFel', rpta);
                if (rpta.estado === 2) {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: rpta.errors });
                } else {
                  this.messageService.add({ severity: 'info', summary: 'Info', detail: rpta.sunat_description });

                }
                this.getListar();
                this.setSpinner(false);
                return;
              },
              error: (err) => {
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
              },
              complete: () => {
                this.setSpinner(false);
              }
            });
          this.$listSubcription.push($operacionFel)
        }
      });
      return;
    }

    const $operacionFel = this.proyectosService.operacionFel(objeto)
      .subscribe({
        next: (rpta: any) => {
          console.log('operacionFel', rpta);
          this.messageService.add({ severity: 'info', summary: 'Info', detail: rpta.sunat_description });
          this.getListar();
          this.setSpinner(false);
          // this.getListar();
          //   this.setSpinner(false);
          let mensaje = "El Documento Electrónico " + rpta.serie + "-" + rpta.numero + " ya ha sido ACEPTADA, verifique en el enlace de descarga.";
          if (item.operacion === "consultar_comprobante" && rpta.estado === 1) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: mensaje });
          }

          //this.generarAsiento();

        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($operacionFel)
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
    let tipo = 6; // ventas
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
