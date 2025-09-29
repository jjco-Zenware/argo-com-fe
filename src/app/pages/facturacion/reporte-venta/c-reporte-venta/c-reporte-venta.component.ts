import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesQuestion,
    mensajesSpinner,
} from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ProyectosService } from '../../../compras/proyectos-ganados/service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { OrdencompraService } from '../../../compras/orden-compra-servicio/service/ordencompra.service';
import { MessageService } from 'primeng/api';
import { ModalVentaComponent } from '../c-modal-venta/c-modal-venta.component';
import * as FileSaver from 'file-saver';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';

@Component({
    selector: 'app-c-reporte-venta',
    templateUrl: './c-reporte-venta.component.html',
    styleUrls: ['./c-reporte-venta.component.scss'],
})
export class CReporteVentaComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];

    lstCompras: any[] = [];
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    dataPrc: any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    lstProveedores: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    lstCentroCosto: any;
    lstMonedas: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private proyectosService: ProyectosService,
        private serviceSharedApp: SharedAppService,
        private ordencompraService: OrdencompraService,
        private messageService: MessageService,
        private comprasService: ComprasService
    ) { }

    ngOnInit(): void {
        this.createFrm();
        this.getListar();
        this.listaMonedas();
        this.listarCentroCosto();
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
                { value: constantesLocalStorage.idusuario, disabled: false },
            ],
            idproveedor: [{ value: 0, disabled: false }],
            idmoneda: [{ value: 0, disabled: false }],
            periodo: [
                {
                    value: this.utilitariosService.obtenerFechaInicioMes(),
                    disabled: false,
                },
            ],
            idcliente: [{ value: 0, disabled: false }],
            idcentrocosto: [{ value: 0, disabled: false }],
            ind_estado_fel: [{ value: 0, disabled: false }]
        });
    }

    getListar() {
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

        const objeto = {
            ...this.frmDatos.value,
            idtipodocprc: 6,
        };

        const $getListarOrdenCompra = this.proyectosService
            .ordenCompraList(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);
                    console.log('rpta getListar', rpta);
                    let lista = rpta.ordenescompra;
                    this.lstCompras = lista.filter(
                        (item: any) => item.ind_estado_fel === 1 || item.ind_estado_fel === 4
                    );

                    //poner en cero las anuladas
                    this.lstCompras.forEach(item => {
                        if (item.ind_estado_fel === 4) {
                            item.s_monto = 0;
                            item.s_igv = 0;
                            item.s_monto_total = 0;
                            item.s_monto_rep = 0;
                            item.s_igv_rep = 0;
                            item.s_monto_total_rep = 0;
                        }
                    });

                    if (this.frmDatos.value.idproveedor === 0) {
                        this.listaProveedores();
                    }
                },
                error: (err) => {
                    this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                    this.setSpinner(false);
                },
            });
        this.$listSubcription.push($getListarOrdenCompra);
    }

    onVer(data: any) {
        console.log('onVer...', data);
        this.dataPrc = {
            idordencompra: data.idordencompra,
            paramReg: 'V',
        };
        this.tituloDetalle = 'Factura N° ' + data.nrofactura;

        const objeto = {
            idordencompra: data.idordencompra,
        };
        const ref = this.dialogService.open(ModalVentaComponent, {
            data: objeto,
            header: 'Factura N° ' + data.nrofactura,
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '40%',
        });
        ref.onClose.subscribe(() => {
            //this.getListar();
        });
    }

    descargarReporte() {
        if (this.lstCompras.length === 0) {
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay registros para descargar',
            });
            return;
        }
        this.setSpinner(true);
        this.mensajeSpinner = 'Descargando...!';

        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            idtipodocprc: 6,
            fecini: this.frmDatos.value.fecini,
            fecfin: this.frmDatos.value.fecfin,
        };

        const $cargarOrdenC = this.ordencompraService
            .prcReporte(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);

                    console.log('descargarReporte', rpta);

                    const mediaType = 'application/pdf';
                    const blob = new Blob([rpta.body], { type: mediaType });
                    const filename = 'REG-VENTA';

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
                complete: () => { },
            });
        this.$listSubcription.push($cargarOrdenC);
    }

    changePeriodo(dato: any) {
        console.log('changePeriodo', dato);
        console.log(
            'Minimo',
            this.utilitariosService.obtenerFechaInicioMesPeriodo(dato)
        );
        console.log(
            'Maximo',
            this.utilitariosService.obtenerFechaFinMesPeriodo(dato)
        );

        this.frmDatos
            .get('fecini')
            ?.setValue(
                this.utilitariosService.obtenerFechaInicioMesPeriodo(dato)
            );
        this.frmDatos
            .get('fecfin')
            ?.setValue(this.utilitariosService.obtenerFechaFinMesPeriodo(dato));
        this.getListar();
    }

    getExportarExcel(data: any) {
        console.log('getExportarExcel...', data);
        if (this.lstCompras.length === 0) {
            this.messageService.clear();
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay registros para descargar',
            });
            return;
        }
        this.lstExportar = [];
        if (data.filteredValue !== undefined) {
            this.lstExportExcel = data.filteredValue;
        } else {
            this.lstExportExcel = data._value;
        }

        for (let i = 0; i < this.lstExportExcel.length; i++) {
            const objeto = {
                'FECHA EMISIÓN': this.lstExportExcel[i].fecemision,
                'FECHA VENCIMIENTO': this.lstExportExcel[i].fecvencimiento,
                'DOCUMENTO': this.lstExportExcel[i].nrofactura,
                'CLIENTE': this.lstExportExcel[i].nomempresa,
                'CENTRO COSTO': this.lstExportExcel[i].descentrocostoPRY,
                'MONEDA': this.lstExportExcel[i].simbmoneda,
                'BASE IMPONIBLE': this.lstExportExcel[i].s_monto_rep,
                'IGV': this.lstExportExcel[i].s_igv_rep,
                'TOTAL': this.lstExportExcel[i].s_monto_total_rep,
                'GLOSA': this.lstExportExcel[i].s_glosa,
                'ESTADO': this.lstExportExcel[i].nomestado,
                '% DETRACCIÓN': this.lstExportExcel[i].porc_detraccion,
                'S/ DETRACCIÓN': this.lstExportExcel[i].s_monto_detraccion_mn_CTB,
            };
            this.lstExportar.push(objeto);
        }

        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'REPORTE_VENTA');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
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
        // const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
        // next: (rpta: any) => {
        //     this.lstProveedores = rpta;
        //     const objet = {
        //     idcliente: 0,
        //     razonsocial: 'TODOS'
        //     }
        //     this.lstProveedores.unshift(objet);
        //     //console.log('this.lstProveedores', this.lstProveedores);
        // },
        // error: (err) => {
        //     this.serviceSharedApp.messageToast()
        // },
        // complete: () => { },
        // });
        // this.$listSubcription.push($getClientes);

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
                this.serviceSharedApp.messageToast();
            },
            complete: () => { },
        });
        this.$listSubcription.push($listaMonedas);
    }

    listarCentroCosto() {
        this.setSpinner(true);
        this.mensajeSpinner = 'Cargando...!';

        const $getListarOrdenCompra = this.comprasService
            .listarCentroCosto()
            .subscribe({
                next: (rpta: any) => {
                    this.lstCentroCosto = rpta;
                    const objet = {
                        idcentrocosto: 0,
                        descentrocosto: 'TODOS'
                    }
                    this.lstCentroCosto.unshift(objet);
                    console.log('listarCentroCosto...', this.lstCentroCosto);
                    this.setSpinner(false);
                },
                error: (err) => {
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                    this.setSpinner(false);
                },
            });
        this.$listSubcription.push($getListarOrdenCompra);
    }
}
