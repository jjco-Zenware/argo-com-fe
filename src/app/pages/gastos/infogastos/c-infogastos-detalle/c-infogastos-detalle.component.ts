import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesQuestion,
    mensajesSpinner,
} from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MarketingService } from 'src/app/pages/marketing/service/marketingServices';
import { CModalGastosComponent } from 'src/app/pages/marketing/eventos/modal-gastos/c-modalgastos.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CAdjuntosComponent } from 'src/app/pages/compras/registro-proveedor/c-adjuntos/c-adjuntos.component';
import { CModalTransacComponent } from '../../modal-trans-gasto/modal-transac.component';

@Component({
    selector: 'app-c-infogastos-detalle',
    templateUrl: './c-infogastos-detalle.component.html',
    styleUrls: ['./c-infogastos-detalle.component.scss'],
})
export class CInformeGastosDetComponent implements OnInit, OnDestroy {
    @Input() IA_data: any;
    $listSubcription: Subscription[] = [];
    visibleDocument: boolean = true;
    // dataAdjunto: any;
    registerFormRegistro!: FormGroup;
    headerTitle: string = '';
    lstMonedas: any[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    menuItems: MenuItem[] = [];
    verbtnGrabar: boolean = false;
    verbtnAcciones: boolean = false;
    verCotizacion: boolean = true;
    onlyRead: boolean = false;
    verReferencia: boolean = false;
    errorMensaje: string = '';
    activeIndex: number = 0;
    lstcategoria: any[] = [];
    lstTransacciones: any[] = [];
    lstCtaCtble: any[] = [];
    filteredCtaCtble!: any[];
    codctactble: string = '';
    lstGastos: any[] = [];
    idOrdenC: number = 0;
    lstResponsable: any[] = [];
    lstOrigen: any;
    verbtnPreliminar: boolean = false;
    stateOptions: any[] = [
        { label: 'Empleado', value: true },
        { label: 'Compañia', value: false },
    ];
    lstCentroCosto: any[] = [];
    lstProyectos: any;
    ordenCompra: any;
    //verAdjunto: boolean = true;
    lstCliente: any;
    s_monto: number = 0;
    s_igv: number = 0;
    s_montoTotal: number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private serviceSharedApp: SharedAppService,
        private serviceUtilitario: UtilitariosService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private marketingService: MarketingService,
        private proyectosService: ProyectosService,
        private ordencompraService: OrdencompraService
    ) {}

    ngOnInit(): void {
        console.log('ngOnInit', this.IA_data);
        this.idOrdenC = this.IA_data.idcodigo;
        this.listaProyectoTipo();
        this.createFormRegistro();
        this.listaMonedas();
        this.listarItemsTabla();
        this.listaUsuarios();
        this.listarCentroCosto();
        this.listaClientes();

        if (this.idOrdenC > 0) {
            this.traerUno();
        } else {
            this.getOrigen('OTR');
            this.gettipocambiodia();
            this.mostrarBotones('NVO');
        }
    }

    get formRegistro() {
        return this.registerFormRegistro.controls;
    }

    createFormRegistro() {
        //Agregar validaciones de formulario
        this.registerFormRegistro = this.formBuilder.group({
            idproyecto: [{ value: 100, disabled: false }],
            idtipoproyecto: [{ value: 0, disabled: false }],
            idtipodocprc: [{ value: 21, disabled: false }],
            idoportunidad: [{ value: 0, disabled: false }],
            sustentodoc: [{ value: '', disabled: false }],
            idrequerimiento: [{ value: 0, disabled: false }],
            iduserreg: [
                { value: constantesLocalStorage.idusuario, disabled: false },
            ],
            idusuario: [
                { value: constantesLocalStorage.idusuario, disabled: false },
            ],
            nrodocumentoadd: [{ value: '', disabled: false }],
            fechaingreso: [
                {
                    value: this.serviceUtilitario.obtenerFechaFormateadoDMA(),
                    disabled: false,
                },
            ],
            idordencompra: [{ value: this.idOrdenC, disabled: true }],
            condicionescomerciales: [{ value: '', disabled: false }],
            idproveedor: [{ value: 0, disabled: false }],
            idmoneda: [{ value: 0, disabled: false }],
            idcontacto: [{ value: 0, disabled: false }],
            codtipodoc: [{ value: 'OTR', disabled: false }],
            tiempoentrega: [{ value: 0, disabled: false }],
            codformapago: [{ value: 118, disabled: false }],
            validezoferta: [{ value: 0, disabled: false }],
            lugarentrega: [{ value: '', disabled: false }],
            garantia: [{ value: 0, disabled: false }],
            servicionombre: [{ value: '', disabled: false }],
            ref01: [{ value: '', disabled: false }],
            ref02: [{ value: '', disabled: false }],
            ref03: [{ value: '', disabled: false }],
            codtipoorden: [{ value: 'OC', disabled: false }],
            codigonroorden: [{ value: '', disabled: true }],
            nomproyecto: [{ value: '', disabled: false }],
            nrodocumento: [{ value: '', disabled: false }],
            fecemision: [
                {
                    value: this.serviceUtilitario.obtenerFechaActual(),
                    disabled: false,
                },
            ],
            tc: [{ value: '', disabled: false }],
            tipodoc_ctb: [{ value: '', disabled: false }],
            nroserie_ctb: [{ value: '', disabled: false }],
            nrodocumento_ctb: [{ value: '', disabled: false }],
            fecvencimiento: [
                {
                    value: this.serviceUtilitario.obtenerFechaActual(),
                    disabled: false,
                },
            ],
            nrocuotas: [{ value: 0, disabled: false }],
            porc_detraccion: [{ value: 0, disabled: false }],
            monto_detraccion_mn_CTB: [{ value: 0, disabled: false }],
            s_monto_detraccion_CTB: [{ value: 0, disabled: false }],
            s_monto_valor_venta_CTB: [{ value: 0, disabled: false }],
            s_monto_igv_CTB: [{ value: 0, disabled: false }],
            s_monto_total_CTB: [{ value: 0, disabled: false }],
            montoTotal: [{ value: 0, disabled: false }],
            nrocontrato_ctb: [{ value: null, disabled: false }],
            nroexpediente_ctb: [{ value: null, disabled: false }],
            codunidadejecutora_ctb: [{ value: null, disabled: false }],
            nroprocesoseleccion_ctb: [{ value: null, disabled: false }],
            observacion: [{ value: '', disabled: false }],
            nrodias: [{ value: 1, disabled: false }],
            idordencompra_origen_ctb: [{ value: 0, disabled: false }],
            monto_pen_pago: [{ value: 0, disabled: false }],
            idcentrocosto: [{ value: 0, disabled: false }],
            s_monto_neto_CTB: [{ value: 0, disabled: false }],
            direccion: [{ value: null, disabled: false }],
            indmanualdetraccion: [{ value: false, disabled: false }],
            codctactble: [{ value: null, disabled: false }],
            monto: [{ value: 0, disabled: false }],
            idcategoria: [{ value: null, disabled: false }],
            idusersolicita: [{ value: constantesLocalStorage.idusuario, disabled: false }],
            idtrack: [{ value: 51, disabled: false }],
            montoalcambio: [{ value: 0, disabled: false }],
            mtoutilizado: [{ value: 0, disabled: false }],
            mtodiferencia: [{ value: 0, disabled: false }],
        });
    }

    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
    }

    mostrarBotones(data: any) {
        console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
        switch (data) {
            case 'REG':
                case 'OBS':
                this.verbtnGrabar = true;
                this.verbtnAcciones = true;
                this.onlyRead = false;
                break;
            case 'NVO':
                this.verbtnGrabar = true;
                this.verbtnAcciones = false;
                this.onlyRead = false;
                break;
            case 'EMI':
                this.verbtnGrabar = false;
                this.verbtnAcciones = true;
                this.onlyRead = true;
                break;
            case 'ANU':
                this.verbtnGrabar = false;
                this.verbtnAcciones = false;
                this.onlyRead = true;
                break;

            default:
                break;
        }

        if (this.IA_data.paramReg === 'V') {
            console.log('entro', this.IA_data.paramReg);
            this.verbtnGrabar = false;
            this.verbtnAcciones = false;
            this.onlyRead = true;
        }
    }

    traerUno() {
        this.setSpinner(true);
        this.mensajeSpinner = 'Cargando...!';
        const objeto = {
            idordencompra: this.idOrdenC,
            idusuario: constantesLocalStorage.idusuario,
        };

        const $cargarOrdenC = this.proyectosService
            .ordenCompraTraeruno(objeto)
            .subscribe({
                next: (rpta: any) => {
                    console.log('traerUno', rpta.ordencompra[0]);
                    this.ordenCompra = rpta.ordencompra[0];

                    //this.changeCC(rpta.ordencompra[0].idcentrocosto);
                    this.visibleDocument = false;
                    this.verbtnPreliminar = true;

                    this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
                    this.codctactble = rpta.ordencompra[0].codctactble;
                    this.registerFormRegistro
                        .get('tipodoc_ctb')
                        ?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
                    this.mostrarBotones(rpta.ordencompra[0].estado);
                    this.registerFormRegistro
                        .get('monto_pen_pago')
                        ?.setValue(rpta.ordencompra[0].s_monto_neto_CTB);
                    this.registerFormRegistro
                        .get('fecvencimiento')
                        ?.setValue(rpta.ordencompra[0].fecvencimiento);
                    this.registerFormRegistro
                        .get('fecemision')
                        ?.setValue(rpta.ordencompra[0].fecemision);
                    //this.getBusquedaRUC();
                    this.setSpinner(false);

                    this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);
                    this.getOrigen(rpta.ordencompra[0].codtipodoc);
                    this.getListarGasto();
                    this.listarTransacciones();
                    this.cargarMenu(rpta.ordencompra[0].acciones);
                    this.changeMoneda(rpta.ordencompra[0].idmoneda);
                },
                error: (err) => {
                    this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {},
            });
        this.$listSubcription.push($cargarOrdenC);
    }

    guardar() {
        if (this.validarDatos()) {
            this.setSpinner(false);
            this.messageService.add({
                severity: 'info',
                summary: 'Aviso',
                detail: this.errorMensaje,
            });
            return;
        }

        this.setSpinner(true);
        this.mensajeSpinner = 'Guardando...!';
        let fechaingreso;
        let fecemision;
        let fecvencimiento;
        fechaingreso = this.registerFormRegistro.value.fechaingreso;
        fecemision = this.registerFormRegistro.value.fecemision;
        fecvencimiento = this.registerFormRegistro.value.fecvencimiento;

        //if (this.idOrdenC > 0) {
        if (fechaingreso.toString().length === 10) {
            fechaingreso = new Date(
                this.serviceUtilitario.formatFecha(fechaingreso)
            );
        }
        if (fecemision.toString().length === 10) {
            fecemision = new Date(
                this.serviceUtilitario.formatFecha(fecemision)
            );
        }
        if (fecvencimiento.toString().length === 10) {
            fecvencimiento = new Date(
                this.serviceUtilitario.formatFecha(fecvencimiento)
            );
        }
        //}

        const objeto = {
            ...this.registerFormRegistro.getRawValue(),
            items: [],
            fechaingreso,
            fecemision,
            fecvencimiento,
            tipodoc_ctb: this.registerFormRegistro.value.tipodoc_ctb.toString(),
            cuotas: [],
            nrocuotas: 0,
            codctactble: this.codctactble,
        };

        console.log('guardarOC...', objeto);

        this.ordencompraService.ordenCompraprc(objeto).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                if (rpta.procesoSwitch === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'OK...',
                        detail: rpta.mensaje,
                    });

                    if (this.idOrdenC === 0) {
                        this.idOrdenC = rpta.resultProceso;
                        this.registerFormRegistro
                            .get('idordencompra')
                            ?.setValue(rpta.resultProceso);
                        this.registerFormRegistro
                            .get('codigonroorden')
                            ?.setValue(rpta.resultProceso);
                        //this.verAdjunto = true;
                    this.verbtnPreliminar = true;
                    this.verbtnAcciones = true;
                    } else {
                        this.traerUno();
                    }

                    this.visibleDocument = false;
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error...',
                        detail: rpta.mensaje,
                    });
                }
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
    }

    listarTransacciones() {
        const $lstTransacciones = this.marketingService
            .listarTrasacciones(this.idOrdenC)
            .subscribe({
                next: (rpta: any) => {
                    console.log('lstTransacciones', rpta);
                    this.lstTransacciones = rpta;
                },
                error: (err) => {
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {},
            });
        this.$listSubcription.push($lstTransacciones);
    }

    listarItemsTabla() {
        this.marketingService.listarItemsTabla(128).subscribe({
            next: (rpta: any) => {
                console.info('listarItemsTabla : ', rpta);
                //this.lstcategoria = rpta.filter({x:any});
                this.lstcategoria = rpta.filter(
                    (x: { coditem: any }) =>
                        x.coditem !== '2'
                );
            },
            error: (err) => {
                console.info('error : ', err);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
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
        this.ordenCompra.idtrx = item.idtrx;
        console.log('onAccion', item);
        const ref = this.dialogService.open(CModalTransacComponent, {
            data: this.ordenCompra,
            header: item.nomtrx,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '40%',
        });

        ref.onClose.subscribe(() => {
            this.traerUno();
        });
    }

    validarDatos(): boolean {
        let _error = false;
        this.errorMensaje = '';
        console.log('this.formValue...', this.registerFormRegistro.value);

        if (
            this.registerFormRegistro.value.idusersolicita === null ||
            this.registerFormRegistro.value.idusersolicita === ''
        ) {
            this.errorMensaje = 'Seleccionar Usuario...!';
            _error = true;
        }

        // if (!_error && (this.registerFormRegistro.value.sustentodoc === null || this.registerFormRegistro.value.sustentodoc === ''))
        //   {
        //       this.errorMensaje="Ingresar Guia...!";
        //       _error = true;
        //   }

        if (
            !_error &&
            (this.registerFormRegistro.value.idcategoria === 0 ||
                this.registerFormRegistro.value.idcategoria === null)
        ) {
            this.errorMensaje = 'Seleccionar Categoría...!';
            _error = true;
        }

        if (
            !_error &&
            (this.registerFormRegistro.value.monto === 0 ||
                this.registerFormRegistro.value.monto === '')
        ) {
            this.errorMensaje = 'Ingresar Monto...!';
            _error = true;
        }

        if (!_error && this.registerFormRegistro.value.idmoneda === null) {
            this.errorMensaje = 'Seleccionar Moneda...!';
            _error = true;
        }
        return _error;
    }

    listaMonedas() {
        const $listaMonedas = this.marketingService.obtenerMonedas().subscribe({
            next: (rpta: any) => {
                this.lstMonedas = rpta;
            },
            error: (err) => {
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
        this.$listSubcription.push($listaMonedas);
    }

    listarCentroCosto() {
        this.setSpinner(true);
        this.mensajeSpinner = 'Cargando...!';

        const $getListarOrdenCompra = this.marketingService
            .listarCentroCosto()
            .subscribe({
                next: (rpta: any) => {
                    this.lstCentroCosto = rpta;
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

    agregarGastos(data: any, index: number) {
        data.nroindex = index;
        data.idproyecto = this.registerFormRegistro.get('idproyecto')?.value;
        data.codtipodoc = this.registerFormRegistro.get('codtipodoc')?.value;
        const refMensaje = this.dialogService.open(CModalGastosComponent, {
            data: data,
            header: data.length == 0 ? 'Agregar Gasto' : 'Editar Gasto',
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '40%',
        });
        refMensaje.onClose.subscribe((rpta: any) => {
            console.log('onClose index', index);
            if (rpta != undefined) {
                this.guardarGasto(rpta.objeto);
            }
        });
    }

    eliminarGastos(data: any) {
        console.log('onClose data', data);
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message:
                '¿Desea Eliminar ' + '<b>' + data.nomempresa + '</b>' + '?',
            accept: () => {
                this.estadoGasto(data);
            },
        });
    }

    guardarGasto(objeto: any) {
        this.setSpinner(true);
        this.mensajeSpinner = 'Guardando...!';

        const obj = {
            ...objeto,
            idproyecto: this.registerFormRegistro.get('idproyecto')?.value,
            idtipodocprc: 7,
            iddocumentoprc_origen: this.idOrdenC,
        };

        console.log('guardarOC...', obj);

        this.ordencompraService.ordenDocumentoprc(obj).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                if (rpta.procesoSwitch === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'OK...',
                        detail: rpta.mensaje,
                    });

                    this.getListarGasto();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error...',
                        detail: rpta.mensaje,
                    });
                }
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
    }

    getListarGasto() {
        const objeto = {
            idproyecto: this.registerFormRegistro.get('idproyecto')?.value,
            idtipodocprc: 7,
            idusuario: constantesLocalStorage.idusuario,
            iddocumentoprc_origen: this.idOrdenC,
        };

        const $getListarOrdenCompra = this.proyectosService
            .ordenCompraListGasto(objeto)
            .subscribe({
                next: (rpta: any) => {
                    console.log('rpta getListar', rpta);
                    this.lstGastos = rpta.ordenescompra;

                    this.s_monto = this.lstGastos.reduce((acc:any, item:any) => acc + item.mtobaseimpo, 0);
                    this.s_igv = this.lstGastos.reduce((acc:any, item:any) => acc + item.mtoigv, 0);
                    this.s_montoTotal = this.lstGastos.reduce((acc:any, item:any) => acc + item.mtototal, 0);

                    let asigando = this.registerFormRegistro.get('montoalcambio')?.value;

                    this.registerFormRegistro.get('mtoutilizado')?.setValue(this.s_montoTotal);
                    this.registerFormRegistro.get('mtodiferencia')?.setValue(asigando - this.s_montoTotal);
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

    estadoGasto(data: any) {
        const objeto = {
            idordencompra: data.idordencompra,
            estado: 'ANU',
        };

        const $cargarOrdenC = this.proyectosService
            .ordenCompraUpdEstado(objeto)
            .subscribe({
                next: (rpta: any) => {
                    if (rpta.procesoSwitch === 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'OK...',
                            detail: rpta.mensaje,
                        });
                        this.getListarGasto();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error...',
                            detail: rpta.mensaje,
                        });
                    }
                },
                error: (err) => {
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {},
            });
        this.$listSubcription.push($cargarOrdenC);
    }

    listaUsuarios() {
        const $listaUsuarios = this.marketingService
            .listarUsuarios([])
            .subscribe({
                next: (rpta: any) => {
                    console.info('listaUsuarios : ', rpta);
                    this.lstResponsable = rpta;
                },
                error: (err) => {
                    console.info('error : ', err);
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: mensajesQuestion.msgErrorGenerico,
                    });
                },
                complete: () => {},
            });
        this.$listSubcription.push($listaUsuarios);
    }

    gettipocambiodia() {
        let fecha = new Date();
        const objeto = {
            anio: fecha.getFullYear(),
            mes: fecha.getMonth() + 1,
            dia: fecha.getDate(),
        };

        const $gettipocambio = this.proyectosService
            .gettipocambiodia(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);
                    console.log('rpta gettipocambiodia', rpta);
                    console.log('rpta valTipo', rpta.valTipo);
                    this.registerFormRegistro
                        .get('tc')
                        ?.setValue(parseFloat(rpta.valTipo));
                },
                error: (err) => {
                    this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                    this.setSpinner(false);
                },
            });
        this.$listSubcription.push($gettipocambio);
    }

    getOrigen(data: any) {
        console.log('getOrigen...', data);
        //this.registerFormRegistro.get('idcentrocosto')?.setValue(0);
        //this.registerFormRegistro.get('codctactble')?.setValue('');
        switch (data) {
            case 'OPO':
                this.cargarProyectos(1);
                break;
            case 'REQ':
                this.cargarProyectos(4);
                break;
            case 'OTR':
                this.cargarProyectos(0);
                break;
            case 'MKT':
                this.cargarProyectos(6);
                break;
        }
    }

    cargarProyectos(dato: any) {
        this.ordencompraService.portipoProyectoList(dato).subscribe({
            next: (rpta: any) => {
                this.lstProyectos = rpta;
                console.log('cargarProyectos...', this.lstProyectos);
                //this.changeProyecto(this.registerFormRegistro.value.idproyecto)
            },

            error: (err) => {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {},
        });
    }

    listaClientes() {
        let tiporol = 'CLI';
        this.proyectosService.obtenerClientes(tiporol).subscribe({
            next: (rpta: any) => {
                this.lstCliente = rpta;
            },
            error: (err) => {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {},
        });
    }

    listaProyectoTipo() {
        this.ordencompraService.tipoProyectoList().subscribe({
            next: (rpta: any) => {
                this.lstOrigen = rpta;
                const objeto = {
                    idtipoproyecto: 4,
                    nomtipoproyecto: 'Otros',
                    codproceso: 'OTR',
                };
                this.lstOrigen.unshift(objeto);
            },
            error: (err) => {
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {},
        });
    }

    anexos(dato: any, param: string) {
            console.log("anexos : ", dato);
            const refMensaje = this.dialogService.open(CAdjuntosComponent, {
                data: { idoportunidad: 0 , 
                  codtipoproc: 2, 
                  idnroproceso: 0, 
                  parametro: param, 
                  idCliente: dato.idordencompra
                },
                header: 'Adjuntos de ' + dato.nomempresa,
                styleClass: 'testDialog',
                closeOnEscape: false,
                closable: true,
                width: '50%'
            });
            refMensaje.onClose.subscribe((rpta: any) => {
              
              });
        }
    
    vistaPreliminar(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Vista Preliminar...!';

    const objeto = {
      idusuario : constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: 21,
      idplantilla: 0
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = 'Liquidación_' + this.registerFormRegistro.value.idordencompra;
  
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

   onValueChange(event:any){
      console.log('changeMoneda...', event);
     
        if (this.registerFormRegistro.get('idmoneda')?.value === 2) {
          this.registerFormRegistro.get('montoalcambio')?.setValue(this.registerFormRegistro.value.tc * event);
        }else{
          this.registerFormRegistro.get('montoalcambio')?.setValue(event );
        }        
      
    }

    changeMoneda(event:any){
      console.log('changeMoneda...', event);
        if (event === 2) {
          this.registerFormRegistro.get('montoalcambio')?.setValue(Math.round(this.registerFormRegistro.value.monto * this.registerFormRegistro.value.tc));
        }else{
          this.registerFormRegistro.get('montoalcambio')?.setValue(this.registerFormRegistro.value.monto);
        }        
     
    }
}
