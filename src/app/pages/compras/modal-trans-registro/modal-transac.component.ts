import { Component, OnInit } from '@angular/core';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'; import { KanbanCard } from '@interfaces';
import { constantesLocalStorage } from '@constantes';
import { Subscription } from 'rxjs';
import { OrdencompraService } from '../orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from '../Service/compraServices';

@Component({
    selector: 'app-modal-transac',
    templateUrl: './modal-transac.component.html',
    styleUrls: ['./modal-transac.component.scss']
})
export class CModalTransacComponent implements OnInit {
    $listSubcription: Subscription[] = [];
    _transaccion: any;
    ordencompra: any;
    headerTitleAccion!: string;
    btnTitleAccion!: string;
    btnIdAccion!: number;
    errorMensaje: string = "";
    descripcion: string = "";
    btnIconAccion!: string;
    btnColor!: string;
    lstCentroCosto: any;
    verReasignar: boolean = false;
    idcentrocosto: number = 0;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public refDatoItem: DynamicDialogRef,
        private serviceSharedApp: SharedAppService,
        private ordencompraService: OrdencompraService,
        private comprasService: ComprasService,
    ) { }

    ngOnInit(): void {
        this.ordencompra = this.config.data;
        console.log('ordencompra', this.ordencompra);
        this._transaccion = this.config.data.acciones.filter((x: { idtrx: any; }) => x.idtrx === this.config.data.idtrx);
        this.cargarData();
        this.listarCentroCosto();
    }

    cargarData() {
        this.headerTitleAccion = this._transaccion[0].nomtrx;
        this.btnTitleAccion = this._transaccion[0].nomtrxbtn;
        this.btnIdAccion = this._transaccion[0].idtrx;
        this.btnIconAccion = this._transaccion[0].icono;
        this.btnColor = this._transaccion[0].clasebtn;
        if (this.ordencompra.idtrx === 159) {
            this.verReasignar = true;
        }
    }

    procesarTRX(codigo: number) {
        if (this.validarDatos()) {
            console.log("errorMensaje : ", this.errorMensaje);
            this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: this.errorMensaje });
            return;
        }

        if (this.ordencompra.idtrx === 159 && this.verReasignar) {

            const objeto = {
                idordencompra: this.ordencompra.idordencompra,
                idcentrocosto: this.idcentrocosto
            }

            const $centroCostoUPD = this.ordencompraService.centroCostoUPD(objeto).subscribe({
                next: (rpta: any) => {
                    console.log('centroCostoUPD', rpta);
                    if (rpta.procesoSwitch === 0) {
                        this.cerrar(objeto)
                    }

                    this.serviceSharedApp.messageToast({
                        severity: rpta.procesoSwitch === "0" ? 'success' : 'info',
                        summary: rpta.procesoSwitch === "0" ? 'Exito' : 'Validación...!',
                        detail: rpta.mensaje
                    });
                },
                error: (err) => {
                    console.error('error : ', err);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => { },
            });
            this.$listSubcription.push($centroCostoUPD)
        } else {
            const objeto = {
                idtrx: codigo,
                idusuario: constantesLocalStorage.idusuario,
                descripcion: this.descripcion,
                iddocumentoprc: this.ordencompra.idordencompra,
            }

            const $procesarTrx = this.ordencompraService.procesarTrx(objeto).subscribe({
                next: (rpta: any) => {
                    console.log('prcReunion', rpta);
                    if (rpta.procesoSwitch === 0) {
                        this.cerrar(objeto)
                    }

                    this.serviceSharedApp.messageToast({
                        severity: rpta.procesoSwitch === "0" ? 'success' : 'info',
                        summary: rpta.procesoSwitch === "0" ? 'Exito' : 'Validación...!',
                        detail: rpta.mensaje
                    });
                },
                error: (err) => {
                    console.error('error : ', err);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => { },
            });
            this.$listSubcription.push($procesarTrx)
        }
    }

    validarDatos(): boolean {
        let _error = false;
        this.errorMensaje = "";
        if ((this.descripcion === " " || this.descripcion === "") && this.ordencompra.idtrx !== 159) {
            this.errorMensaje = "Debe Ingresar Descripción...!";
            _error = true;
        }

        if (!_error && this.verReasignar) {
            if (this.idcentrocosto === 0 || this.idcentrocosto === undefined || this.idcentrocosto === null) {
                this.errorMensaje = "Debe seleccionar un centro de costo...!";
                _error = true;
            }

        }
        return _error;
    }

    cerrar(data: any) {
        this.refDatoItem.close({ data });
    }

    listarCentroCosto() {
        const $getListarOrdenCompra = this.comprasService
            .listarCentroCosto()
            .subscribe({
                next: (rpta: any) => {
                    this.lstCentroCosto = rpta;
                    console.log('listarCentroCosto...', this.lstCentroCosto);
                },
                error: (err) => {
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                },
            });
        this.$listSubcription.push($getListarOrdenCompra);
    }

}
