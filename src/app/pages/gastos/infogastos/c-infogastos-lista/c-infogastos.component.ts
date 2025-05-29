import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesQuestion,
    mensajesSpinner,
} from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MarketingService } from 'src/app/pages/marketing/service/marketingServices';
import { CModalTransacComponent } from '../../modal-trans-gasto/modal-transac.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';

@Component({
    selector: 'app-c-infogastos',
    templateUrl: './c-infogastos.component.html',
    styleUrls: ['./c-infogastos.component.scss'],
})
export class CInformeGastosComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstInfoGastos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    frmDatos!: FormGroup;
    dataDet: any;
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    gasto: any;
    listadoArchivos: any[] = [];
    totaldolares: number = 0;
    totalsoles: number = 0;
    lstMonedas: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private marketingService: MarketingService,
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private proyectosService: ProyectosService,
        private ordencompraService: OrdencompraService
    ) {}

    ngOnInit(): void {
        this.createFrm();
        this.listaMonedas();
        this.getListar();
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
            idcliente: [{ value: 0, disabled: false }],
        });
    }

    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
    }

    getListar() {
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

        const objeto = {
            ...this.frmDatos.value,
            idtipodocprc: 21,
        };

        const $getListarOrdenCompra = this.proyectosService
            .ordenCompraList(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);
                    console.log('rpta getListar', rpta);
                    this.lstInfoGastos = rpta.ordenescompra;
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

    onVer(dato: any) {
        console.log('VER GASTO DE - ', dato);

        this.tituloDetalle = 'VER GASTO DE - ' + dato.nomusuario;
        this.dataDet = {
            idcodigo: dato.idordencompra,
            paramReg: 'V',
        };
        this.vistaLista = false;
    }

    onEditar(dato: any) {
        console.log('EDITAR GASTO DE - ', dato);
        this.tituloDetalle = 'EDITAR GASTO DE - ' + dato.nomusuario;
        this.dataDet = {
            idcodigo: dato.idordencompra,
            paramReg: 'E',
        };
        this.vistaLista = false;
    }

    getDetalle(dato: boolean) {
        this.vistaLista = true;
        this.visDetalle = false;
        this.getListar();
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.getListar();
    }

    onNuevo() {
        this.tituloDetalle = 'REGISTRAR LIQUIDACIÓN DE GASTOS';
        this.dataDet = {
            idcodigo: 0,
            paramReg: 'N',
        };
        this.vistaLista = false;
    }

    toggleMenu(event: Event, data: any) {
        if (data.acciones) {
            this.cargarMenu(data.acciones);
            this.gasto = data;
            this.menu.toggle(event);
        }
    }

    cargarMenu(data: any) {
        this.menuItems = [];
        data.forEach((item: any) => {
            this.menuItems.push({
                label: item.nomtrx,
                icon: 'pi pi-cog',
                command: () => this.onAccion(item),
            });
        });
    }

    onAccion(item: any) {
        console.log('onAccion', item);
        this.getListarGasto(item);
    }

    getExportarExcel() {
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

        const objeto = {
            ...this.frmDatos.value,
            //idtipodocprc: 18,
            // saldo_documento_sol:this.saldo_documento_sol,
            // saldo_documento_dol:this.saldo_documento_dol,
            // s_monto_recaudado_sol: this.s_monto_recaudado_sol,
            // s_monto_recaudado_dol: this.s_monto_recaudado_dol,
        };

        const $getListar = this.marketingService
            .exportarexcelgastos(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);
                    this.utilitariosService.descargarExcel(rpta, 'Gastos');
                },
                error: (err) => {
                    this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                    this.setSpinner(false);
                },
            });
        this.$listSubcription.push($getListar);
    }

    listaMonedas() {
        const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
            next: (rpta: any) => {
                console.log('listaMonedas', rpta);
                this.lstMonedas = rpta;
                const objet = {
                    idmoneda: 0,
                    desmoneda: 'TODOS',
                };
                this.lstMonedas.unshift(objet);
            },
            error: (err) => {
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
        this.$listSubcription.push($listaMonedas);
    }

    onVerDetalle(data: any) {
        console.log('onVerDetalle...', data);

        this.setSpinner(true);
        this.mensajeSpinner = 'Descargando Detalle...!';

        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            iddocumentoprc: data.idordencompra,
            codtipoprc: 21,
            idplantilla: 0,
            idproyecto: data.idproyecto,
        };

        const $cargarOrdenC = this.ordencompraService
            .prcDocumentoDet(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);

                    const mediaType = 'application/pdf';
                    const blob = new Blob([rpta.body], { type: mediaType });
                    const filename = 'Liquidación_' + data.idordencompra;

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
                complete: () => {},
            });
        this.$listSubcription.push($cargarOrdenC);
    }

    getListarGasto(valor: any) {
        const objeto = {
            idproyecto: this.gasto.idproyecto,
            idtipodocprc: 7,
            idusuario: constantesLocalStorage.idusuario,
            iddocumentoprc_origen: this.gasto.idordencompra,
        };

        const $getListarOrdenCompra = this.proyectosService
            .ordenCompraListGasto(objeto)
            .subscribe({
                next: (rpta: any) => {
                    console.log('rpta getListar', rpta);
                    if (rpta.length === 0) {
                      this.setSpinner(false);
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Aviso',
                            detail: 'No existen Gastos Registrados...!',
                        });
                    } else {
                      this.setSpinner(false);
                        this.gasto.idtrx = valor.idtrx;
                        console.log('onAccion', valor);
                        const ref = this.dialogService.open(
                            CModalTransacComponent,
                            {
                                data: this.gasto,
                                header: valor.nomtrx,
                                closeOnEscape: false,
                                styleClass: 'testDialog',
                                width: '40%',
                            }
                        );

                        ref.onClose.subscribe(() => {
                            this.getListar();
                        });
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
}
