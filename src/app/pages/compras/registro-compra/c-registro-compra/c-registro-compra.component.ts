import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalTransacComponent } from '../../modal-trans-registro/modal-transac.component';
import * as FileSaver from 'file-saver';
import { Moneda } from '@interfaces';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UtilitariosService } from '../../../../services/utilitarios.service';
import { ContabilidadService } from '../../../contabilidad/service/contabilidad.services';

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
  //lstCategoriaDoc: any;

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
    //this.listarCategoriaDoc();

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
      periodo: [{ value: new Date(), disabled: false }],
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
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

    const periodo: Date = this.frmDatos.value.periodo ?? new Date();
    const fecini = new Date(periodo.getFullYear(), periodo.getMonth(), 1);
    const fecfin = new Date(periodo.getFullYear(), periodo.getMonth() + 1, 0);

    const objeto = {
      ...this.frmDatos.value,
      fecini,
      fecfin,
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
    //this.listarCategoriaDoc();
  }

  getBack() {
    this.vistaLista = true;
    this.getListar();
    this.visDetalle = false;
    this.visQuote = false;
    //this.listarCategoriaDoc();
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
          //this.generarAsiento();
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

      const headers = Object.keys(this.lstExportar[0] ?? {});
      const colWidths = headers.map(h => {
        const maxLen = Math.max(
          h.length,
          ...this.lstExportar.map(row => String(row[h] ?? '').length)
        );
        return { wch: Math.min(maxLen + 2, 60) };
      });
      worksheet['!cols'] = colWidths;

      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'REGISTRO_COMPRA');
    });
  }

  getExportarPDF(table: any) {
    const lista: any[] = table.filteredValue ?? table._value ?? [];

    const periodo: Date = this.frmDatos.value.periodo ?? new Date();
    const meses = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
    const mes = meses[periodo.getMonth()];
    const anio = periodo.getFullYear();
    const hoy = new Date();
    const fechaImpresion = `${String(hoy.getDate()).padStart(2,'0')}/${String(hoy.getMonth()+1).padStart(2,'0')}/${hoy.getFullYear()}`;

    fetch('assets/layout/images/logo-zenware.png')
      .then(r => r.blob())
      .then(blob => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }))
      .catch(() => '')
      .then((logo: any) => this.renderPDF(lista, mes, anio, fechaImpresion, logo));
  }

  private renderPDF(lista: any[], mes: string, anio: number, fechaImpresion: string, logo: string) {
    // A3 landscape: 420mm wide, 10mm margins → 410mm usable (fits all 28 columns)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
    const pageW = doc.internal.pageSize.getWidth();

    // Logo (top-left)
    if (logo) doc.addImage(logo, 'PNG', 5, 3, 26, 20);

    // Empresa (derecha del logo)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ZENWARE E.I.R.L', 35, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('AV. IGNACIO MERINO 2134 LINCE', 35, 16);

    // Título centrado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`*** REGISTRO DE COMPRAS DEL MES DE ${mes} ${anio} ***`, pageW / 2, 12, { align: 'center' });

    // RUC y fecha
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('R.U.C.: 20602861130', 35, 22);
    doc.text(fechaImpresion, pageW - 5, 22, { align: 'right' });

    const head: any[][] = [
      [
        { content: 'N°\nVou.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'F. Emisión', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'F. Venc.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'T/D', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Serie', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'N° Comprobante\nde Pago', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Doc.\nIdent.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'RUC', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Apellidos y Nombres o Razón Social', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Adq. Grav. dest. a Oper. Grav. y/o Exp.', colSpan: 2, styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Adq. Grav. dest. a Oper. Grav. y/o Exp. y a Oper.', colSpan: 2, styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Adq. Grav. dest. a Oper. No Gravadas', colSpan: 2, styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Valor de\nAdq no\nGravadas', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'I.S.C.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Imp. al\nConsumo\nBolsas', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Otros\nTributos', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Importe\nTotal', rowSpan: 2, styles: { halign: 'right', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'N° Comp.\npago sujeto\nno domiciliado', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Constancia de Depósito\nde Detracción', colSpan: 2, styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'T.C.', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Referencia del Documento', colSpan: 4, styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
      ],
      [
        { content: 'Base Imp.', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'I.G.V', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Base Imp.', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'I.G.V', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Base Imp.', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'I.G.V', styles: { halign: 'right', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Número', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Fecha Emi.', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Fecha', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'T/D', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'Serie', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
        { content: 'N° Comp. pago', styles: { halign: 'center', fontSize: 6, fontStyle: 'bold' } },
      ]
    ];

    const fmt = (v: any) => v != null && v !== 0 ? Number(v).toFixed(2) : '0.00';

    const body: any[] = lista.map((item: any, idx: number) => [
      idx + 1,
      item.fecemision ?? '',
      item.fecvencimiento ?? '',
      item.nomtipodoc_ctb ?? '',
      item.nroserie_ctb ?? '',
      item.nrodocumento_ctb ?? '',
      '6',
      item.nrodocumento ?? '',
      (item.nomempresa ?? '').toUpperCase(),
      { content: fmt(item.s_monto), styles: { halign: 'right' } },
      { content: fmt(item.s_igv), styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: '0.00', styles: { halign: 'right' } },
      { content: fmt(item.s_monto_total), styles: { halign: 'right' } },
      '',
      item.s_monto_detraccion_mn_CTB ? String(Math.round(item.s_monto_detraccion_mn_CTB)) : '',
      '',
      item.tc ?? '',
      '',
      '',
      '',
      '',
    ]);

    const sumBase  = lista.reduce((a: number, x: any) => a + Number(x.s_monto ?? 0), 0);
    const sumIgv   = lista.reduce((a: number, x: any) => a + Number(x.s_igv ?? 0), 0);
    const sumTotal = lista.reduce((a: number, x: any) => a + Number(x.s_monto_total ?? 0), 0);

    body.push([
      { content: 'TOTALES', colSpan: 9, styles: { halign: 'right', fontStyle: 'bold', fontSize: 6 } },
      { content: fmt(sumBase),  styles: { halign: 'right', fontStyle: 'bold' } },
      { content: fmt(sumIgv),   styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '0.00', styles: { halign: 'right', fontStyle: 'bold' } },
      { content: fmt(sumTotal), styles: { halign: 'right', fontStyle: 'bold' } },
      '', '', '', '', '', '', '', '',   // cols 20-27
    ]);

    // Anchos suman 375mm ≤ 410mm usables en A3 landscape (420mm - 10mm márgenes)
    autoTable(doc, {
      head,
      body,
      startY: 27,
      styles: { fontSize: 6, cellPadding: 1, lineWidth: 0.1, lineColor: [0, 0, 0] },
      headStyles: { fillColor: [220, 237, 244], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0:  { cellWidth: 6 },
        1:  { cellWidth: 16 },
        2:  { cellWidth: 16 },
        3:  { cellWidth: 9 },
        4:  { cellWidth: 10 },
        5:  { cellWidth: 22 },
        6:  { cellWidth: 6 },
        7:  { cellWidth: 22 },
        8:  { cellWidth: 35 },
        9:  { cellWidth: 14 },
        10: { cellWidth: 12 },
        11: { cellWidth: 13 },
        12: { cellWidth: 11 },
        13: { cellWidth: 13 },
        14: { cellWidth: 11 },
        15: { cellWidth: 11 },
        16: { cellWidth: 10 },
        17: { cellWidth: 10 },
        18: { cellWidth: 12 },
        19: { cellWidth: 16 },
        20: { cellWidth: 14 },
        21: { cellWidth: 12 },
        22: { cellWidth: 14 },
        23: { cellWidth: 8 },
        24: { cellWidth: 14 },
        25: { cellWidth: 8 },
        26: { cellWidth: 10 },
        27: { cellWidth: 20 },
      },
      margin: { left: 5, right: 5 },
      didDrawPage: (pageData: any) => {
        doc.setFontSize(7);
        doc.text(`Página ${pageData.pageNumber}`, pageW - 10, doc.internal.pageSize.getHeight() - 5, { align: 'right' });
      }
    });

    doc.save(`REGISTRO_COMPRAS_${mes}_${anio}.pdf`);
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

  // generarAsiento() {

  //   this.setSpinner(true);
  //   this.mensajeSpinner = 'Generando Asientos...!';
  //   // let s_categoria = this.lstCategoriaDoc.filter((x: { idcategoria: any; }) => x.idcategoria === this.ordenCompra.idcategoria);
  //   // console.log('s_categoria...', s_categoria);

  //   const objeto = {
  //     idasiento: 0,
  //     idreferencia: this.ordenCompra.idordencompra,
  //     glosaasiento: 'ASIENTO GENERADO DESDE COMPRAS ',
  //     idusuario: constantesLocalStorage.idusuario,
  //     idmoneda: this.ordenCompra.idmoneda
  //   }
  //   const $listaMonedas = this.contabilidadService.asientoPrc(objeto).subscribe({
  //     next: (rpta: any) => {
  //       if (rpta.procesoSwitch === 0) {
  //         this.setSpinner(false);
  //         this.messageService.add({ severity: 'success', summary: 'Exito', detail: rpta.mensaje });
  //         //this.traerUno();   traerAsientos              
  //       } else {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: rpta.mensaje });
  //       }
  //     },
  //     error: (err) => {
  //       this.setSpinner(false);
  //       this.serviceSharedApp.messageToast();
  //     },
  //     complete: () => { },
  //   });
  //   this.$listSubcription.push($listaMonedas);
  // }

  // listarCategoriaDoc() {
  //   let tipo = 7; // compras
  //   const $listarCategoriaDoc = this.contabilidadService
  //     .listarCategoriasDoc(tipo)
  //     .subscribe({
  //       next: (rpta: any) => {
  //         console.log('listarCategoriasDoc...', rpta);

  //         this.lstCategoriaDoc = rpta;
  //       },
  //       error: (err) => {
  //         this.setSpinner(false);
  //         this.serviceSharedApp.messageToast();
  //       },
  //       complete: () => { },
  //     });
  //   this.$listSubcription.push($listarCategoriaDoc);
  // }

}
