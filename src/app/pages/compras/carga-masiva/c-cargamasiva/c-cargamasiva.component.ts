import { Component, OnDestroy, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { UtilitariosService } from '../../../../services/utilitarios.service';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { ContabilidadService } from '../../../contabilidad/service/contabilidad.services';
import { CargaSireService } from '../service/cargasire.service';

export type EstadoCarga = 'inicial' | 'cargado' | 'validado';

@Component({
    selector: 'app-c-cargamasiva',
    templateUrl: './c-cargamasiva.component.html',
    styleUrls: ['./c-cargamasiva.component.scss'],
})
export class CCargamasivaComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    frmDatos!: FormGroup;
    lstCargaCompras: any[] = [];
    blockedDocument = false;
    mensajeSpinner = '';
    estado: EstadoCarga = 'inicial';
    nombreArchivo = '';
    periodoLabel = '';
    proveedoresValidados = 0;
    proveedoresConError = 0;
    mostrarDialogConfirmar = false;
    eliminarDialog = false;
    comprasNuevas: any[] = [];
    comprasDuplicadas: any[] = [];
    lstHistorialCarga: any[] = [];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private proyectosService: ProyectosService,
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private ordencompraService: OrdencompraService,
        private cargaSireService: CargaSireService,
        //private contabilidadService: ContabilidadService,
    ) {}

    ngOnInit(): void {
        this.createFrm();
        //this.listarCargaSire();
    }

    ngOnDestroy(): void {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }

    get totalSoles(): number {
        return this.lstCargaCompras
            .filter((c) => c.idmoneda === 1)
            .reduce((acc, c) => acc + (c.s_monto_total || 0), 0);
    }

    get totalDolares(): number {
        return this.lstCargaCompras
            .filter((c) => c.idmoneda === 2)
            .reduce((acc, c) => acc + (c.s_monto_total || 0), 0);
    }

    get mostrarBotonesPost(): boolean {
        return this.estado === 'cargado' || this.estado === 'validado';
    }

    get mostrarConfirmar(): boolean {
        return this.estado === 'validado';
    }

    get mostrarResumenValidacion(): boolean {
        return this.estado === 'validado';
    }

    get todosSeleccionados(): boolean {
        return this.lstCargaCompras.length > 0 && this.lstCargaCompras.every(c => c.seleccionado);
    }

    get seleccionadosCount(): number {
        return this.lstCargaCompras.filter(c => c.seleccionado).length;
    }

    toggleAll(val: boolean): void {
        this.lstCargaCompras.forEach(c => c.seleccionado = val);
    }

    private setSpinner(valor: boolean, mensaje = ''): void {
        this.blockedDocument = valor;
        this.mensajeSpinner = mensaje;
    }

    private getPeriodoActual(): string {
        const now = new Date();
        return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    }

    createFrm(): void {
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
                    disabled: true,
                },
            ],
            idusuario: [
                { value: constantesLocalStorage.idusuario, disabled: false },
            ],
            idproveedor: [{ value: 0, disabled: false }],
            idmoneda: [{ value: 0, disabled: false }],
            idcliente: [{ value: 0, disabled: false }],
            idcentrocosto: [{ value: 0, disabled: false }],
            periodo: [{ value: this.getPeriodoActual(), disabled: true }],
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;
        const file = input.files[0];
        this.nombreArchivo = file.name;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['xls', 'xlsx', 'xlsm', 'xlsb'].includes(ext ?? '')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Archivo inválido',
                detail: 'Solo se permiten archivos Excel (.xls, .xlsx, .xlsm, .xlsb)',
            });
            input.value = '';
            return;
        }

        this.setSpinner(true, 'Leyendo archivo Excel...');

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target!.result as ArrayBuffer);
            const workbook = XLSX.read(data, {
                type: 'array',
                cellDates: true,
            });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
                raw: true,
                defval: '',
            });

            const normalized = rows
                .map((row) => {
                    const r: { [key: string]: any } = {};
                    Object.keys(row).forEach((k) => {
                        const v = row[k];
                        r[k.trim()] =
                            v instanceof Date ? v : String(v ?? '').trim();
                    });
                    return r;
                })
                .filter((r) => r['Numero'] || r['RUC'] || r['Fec.Doc']);

            const invalidRuc = normalized.filter(
                (r) => String(r['RUC'] ?? '').replace(/\s/g, '').length !== 11,
            );

            this.setSpinner(false);

            if (invalidRuc.length) {
                const detalle = invalidRuc
                    .map(
                        (r) =>
                            `${r['R.Social'] || 'Sin nombre'} (RUC: ${r['RUC']})`,
                    )
                    .join(', ');
                this.messageService.add({
                    severity: 'error',
                    summary: 'RUC inválido',
                    detail: `Los siguientes proveedores tienen un RUC incorrecto: ${detalle}`,
                    life: 8000,
                });
                input.value = '';
                return;
            }

            const firstRow = normalized[0];
            this.periodoLabel = firstRow ? this.extractPeriodo(firstRow['Vou.Fecha']) : '';

            this.lstCargaCompras = normalized.map((r) => {
                const s_monto = parseFloat(r['B.I.O.G y E. (A)'] ?? '0') || 0;
                const s_igv = parseFloat(r['IGV (A)'] ?? '0') || 0;
                const porcIgv = s_monto > 0 ? (s_igv / s_monto) * 100 : 18;
                const parm_igv = porcIgv > 15 ? 596 : 595;
                const idmoneda =
                    r['Moneda'] === 'S' ? 1 : r['Moneda'] === 'D' ? 2 : 0;
                return {
                    fechaingreso: this.fmtExcelDate(r['Vou.Fecha']),
                    fecemision: this.fmtExcelDate(r['Fec.Doc']),
                    fecvencimiento: this.fmtExcelDate(r['Fec.Venc.']),
                    tipodoc_ctb: r['Doc'] ?? '',
                    nroserie_ctb: r['serie'] ?? '',
                    nrodocumento_ctb: r['Numero'] ?? '',
                    nrodocumento: r['RUC'] ?? '',
                    nomempresa: r['R.Social'] ?? '',
                    tc: r['TC'] ?? '',
                    s_monto,
                    s_igv,
                    s_monto_total: parseFloat(r['TOTAL'] ?? '0') || 0,
                    s_glosa: r['Glosa'] ?? '',
                    estado: 'REG',
                    idmoneda,
                    nommoneda:
                        idmoneda === 1
                            ? 'SOLES'
                            : idmoneda === 2
                              ? 'DÓLARES'
                              : '',
                    rc_compra: 0,
                    codctactble: r['Cta Gastos'] ?? '',
                    idtipodocprc: 7,
                    idproyecto: 0,
                    fecdetraccion: this.fmtExcelDate(r['D.Fecha']),
                    numdetraccion: r['D.Numero'] ?? '',
                    idordencompra: 0,
                    idtipoproyecto: 0,
                    iduserreg: constantesLocalStorage.idusuario,
                    idusuario: constantesLocalStorage.idusuario,
                    parm_igv,
                    codtipoorden: 'OC',
                    idordencompra_origen_ctb: 0,
                    monto_pen_pago: 0,
                    idcentrocosto: 0,
                    s_monto_neto_CTB: 0,
                    idcontacto: 0,
                    codtipodoc: 'OTR',
                    tiempoentrega: 0,
                    codformapago: 118,
                    validezoferta: 0,
                    garantia: 0,
                    cuotas: [],
                    nrocuotas: 0,
                    idproveedor: 0,
                    lugarentrega: '',
                    seleccionado: false,
                    items: [
                        {
                            idordencompraitem: 0,
                            idordencompra: 0,
                            idtipoprod: 0,
                            idprod: 1325,
                            descripcion: 'carga masiva',
                            cantidad: 1,
                            codunidad: 'UNID',
                            preciocosto: s_monto,
                            descuento: 0,
                            margen: 0,
                            precioventa: s_monto,
                            indvig: true,
                            iduserreg: constantesLocalStorage.idusuario,
                            fecreg: this.utilitariosService.obtenerFechaActual(),
                            iduseract: constantesLocalStorage.idusuario,
                            fecact: this.utilitariosService.obtenerFechaActual(),
                            coditem: 0,
                            idmarca: 109,
                            nomprod: '',
                            nommarca: '',
                            preciocostototal: s_monto,
                            precioventatotal: s_monto,
                            preprofit: 0,
                            nomtipoprod: '',
                            nomproveedor: '',
                            serialnumber: '',
                            sku: '',
                            nrocontrato: '',
                            nromeses: 0,
                            fecini: null,
                            fecfin: null,
                            idunidad: 130,
                            nomunidad: '',
                            valor: '',
                            ref1: '',
                            codproducto: '',
                            despro: '',
                            tipoigv: 1,
                        },
                    ],
                };
            });

            this.estado = 'cargado';
            this.proveedoresValidados = 0;
            this.proveedoresConError = 0;
            this.messageService.add({
                severity: 'info',
                summary: 'Archivo cargado',
                detail: `Se cargaron ${this.lstCargaCompras.length} registro(s). Ahora valide los proveedores.`,
                life: 5000,
            });
            console.log('onFileSelected...', this.lstCargaCompras);
        };
        reader.readAsArrayBuffer(file);
        input.value = '';
    }

    validarProveedor(): void {
        if (!this.lstCargaCompras.length) return;

        this.setSpinner(
            true,
            `Validando ${this.lstCargaCompras.length} proveedor(es)...`,
        );

        const requests = this.lstCargaCompras.map((item) => {
            const objeto = {
                nrodocumento: item.nrodocumento,
                razonsocial: item.nomempresa,
                nomcomercial: item.nomempresa,
                idusuario: constantesLocalStorage.idusuario,
                idrolpersona: 'PRO',
            };
            return this.proyectosService.validarproveedor(objeto).pipe(
                map((rpta: any) => ({ item, rpta, ok: true })),
                catchError(() =>
                    of({
                        item,
                        rpta: {
                            procesoSwitch: 1,
                            mensaje: 'Error de conexión',
                            resultProceso: 0,
                        },
                        ok: false,
                    }),
                ),
            );
        });

        const sub = forkJoin(requests).subscribe({
            next: (results: any[]) => {
                let validados = 0;
                let agregados = 0;
                let errores = 0;
                results.forEach(({ item, rpta }) => {
                    if (rpta.procesoSwitch === 0) {
                        item.idproveedor = rpta.resultProceso;
                        const msg = (rpta.mensaje ?? '').toUpperCase();
                        if (msg.includes('INSERT') || msg.includes('AGREGO') || msg.includes('NUEVO')) {
                            agregados++;
                        } else {
                            validados++;
                        }
                    } else {
                        errores++;
                    }
                });
                this.proveedoresValidados = validados + agregados;
                this.proveedoresConError = errores;
                this.estado = 'validado';

                if (validados > 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Validación exitosa',
                        detail: `Se validaron ${validados} proveedor(es) correctamente.`,
                        life: 5000,
                    });
                }
                if (agregados > 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Proveedor(es) agregado(s)',
                        detail: `Se agregaron ${agregados} proveedor(es) correctamente.`,
                        life: 5000,
                    });
                }
                if (errores > 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Validación con observaciones',
                        detail: `${errores} proveedor(es) presentaron error.`,
                        life: 6000,
                    });
                }
            },
            error: () => {
                this.setSpinner(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {
                this.setSpinner(false);
            },
        });
        this.$listSubcription.push(sub);
    }

    confirmarCarga(): void {
        // if (this.comprasDuplicadas.length > 0) {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Registros duplicados',
        //         detail: `Existen ${this.comprasDuplicadas.length} registro(s) que ya existen en el sistema y no serán procesados. Puede revisar los detalles en la tabla de registros duplicados.`,
        //         life: 7000,
        //     });
        // }
        this.procesarCarga();
    }

    procesarCarga(): void {
        const lstSeleccionados = this.lstCargaCompras.filter(c => c.seleccionado);
        if (!lstSeleccionados.length) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sin selección',
                detail: 'Debe seleccionar al menos un registro para confirmar.',
                life: 4000,
            });
            return;
        }

        this.setSpinner(true, 'Verificando registros existentes...');

        const hoy = new Date();
        const fecIni = new Date(hoy.getFullYear(), 0, 1);

        const objeto = {
            fecini: fecIni,
            fecfin: this.utilitariosService.obtenerFechaActual(),
            idusuario: constantesLocalStorage.idusuario,
            idproveedor: 0,
            idmoneda: 0,
            idcliente: 0,
            idcentrocosto: 0,
            ind_estado_fel: 0,
            idtipodocprc: 7,
        };

        const sub = this.proyectosService.ordenCompraList(objeto).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                const existentes: any[] = rpta.ordenescompra ?? [];
                const clave = (x: any) =>
                    `${(x.nrodocumento ?? '').trim()}-${(x.nroserie_ctb ?? '').trim()}-${(x.nrodocumento_ctb ?? '').trim()}`.toUpperCase();
                const claves = new Set(existentes.map(clave));
                this.comprasNuevas = lstSeleccionados.filter(
                    (c) => !claves.has(clave(c)),
                );
                this.comprasDuplicadas = lstSeleccionados.filter((c) =>
                    claves.has(clave(c)),
                );
                this.mostrarDialogConfirmar = true;
            },
            error: () => {
                this.setSpinner(false);
                this.comprasNuevas = [...lstSeleccionados];
                this.comprasDuplicadas = [];
                this.mostrarDialogConfirmar = true;
            },
        });
        this.$listSubcription.push(sub);
    }

    ejecutarConfirmacion(): void {
        this.mostrarDialogConfirmar = false;
        if (this.comprasNuevas.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Sin registros nuevos',
                detail: 'Todos los registros del periodo ya existen en el sistema.',
                life: 5000,
            });
            return;
        }

        const erroresDuplicados = this.comprasDuplicadas.map((c, i) => ({
            nrodocumento: c.nrodocumento,
            nomempresa: c.nomempresa,
            fila: i + 1,
            campo: 'DUPLICADO',
            mensaje: `Documento ${c.nroserie_ctb}-${c.nrodocumento_ctb} ya existe en el sistema`,
        }));
        this.grabarCargaSire(this.comprasNuevas, erroresDuplicados);

        this.lstCargaCompras = this.comprasNuevas;
        //this.lstCargaCompras.forEach((c) => (c.fechaingreso = this.frmDatos.get('fecini')?.value));
        this.guardarCompras();
    }

    eliminarCarga(): void {
        this.eliminarDialog = true;
    }

    confirmarEliminar(): void {
        this.eliminarDialog = false;
        this.lstCargaCompras = [];
        this.estado = 'inicial';
        this.nombreArchivo = '';
        this.periodoLabel = '';
        this.proveedoresValidados = 0;
        this.proveedoresConError = 0;
    }

    private guardarCompras(): void {
        this.setSpinner(
            true,
            `Registrando ${this.lstCargaCompras.length} compra(s)...`,
        );

        const requests = this.lstCargaCompras.map((item) => {
            const objeto = {
                ...item,
                fechaingreso: new Date(
                    this.utilitariosService.formatFecha(item.fechaingreso),
                ),
                fecemision: new Date(
                    this.utilitariosService.formatFecha(item.fecemision),
                ),
                fecvencimiento: new Date(
                    this.utilitariosService.formatFecha(item.fecvencimiento),
                ),
            };

            console.log('Objeto a registrar', objeto);

            return this.ordencompraService.ordenCompraprccompleto(objeto).pipe(
                map((rpta: any) => ({ item, rpta })),
                catchError(() =>
                    of({
                        item,
                        rpta: {
                            procesoSwitch: 1,
                            mensaje: 'Error de conexión',
                            resultProceso: 0,
                        },
                    }),
                ),
            );
        });

        const sub = forkJoin(requests).subscribe({
            next: (results: any[]) => {
                //const idsExitosos: { id: number; idmoneda: number }[] = [];
                let errores = 0;
                results.forEach(({ item, rpta }) => {
                    this.setSpinner(false);
                    if (rpta.procesoSwitch === 0) {
                        //idsExitosos.push({ id: rpta.resultProceso, idmoneda: item.idmoneda });
                        this.eliminarDialog = false;
                        this.lstCargaCompras = [];
                        this.estado = 'inicial';
                        this.proveedoresValidados = 0;
                        this.proveedoresConError = 0;
                        
                    } else {
                        errores++;
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Registro fallido',
                            detail: rpta.mensaje,
                            life: 5000,
                        });
                    }
                });
                if (errores === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Proceso completado',
                        detail: `Se registraron ${results.length} compra(s) correctamente y se generaron los asientos contables.`,
                        life: 6000,
                    });
                }
            },
            error: () => {
                this.setSpinner(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
        });
        this.$listSubcription.push(sub);
    }

    private extractPeriodo(value: any): string {
        if (!value) return '';
        if (value instanceof Date) {
            return `${String(value.getMonth() + 1).padStart(2, '0')}/${value.getFullYear()}`;
        }
        const s = String(value).trim();
        const dmy = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (dmy) return `${dmy[2]}/${dmy[3]}`;
        const iso = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
        if (iso) return `${iso[2]}/${iso[1]}`;
        return s;
    }

    private fmtExcelDate(value: any): string {
        if (!value) return '';
        if (value instanceof Date) {
            const d = String(value.getDate()).padStart(2, '0');
            const m = String(value.getMonth() + 1).padStart(2, '0');
            return `${d}/${m}/${value.getFullYear()}`;
        }
        const s = String(value).trim();
        const iso = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
        if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
        return s;
    }

    getEstadoLabel(): string {
        const labels: Record<EstadoCarga, string> = {
            inicial: 'Sin carga',
            cargado: 'Archivo cargado',
            validado: 'Proveedores validados',
        };
        return labels[this.estado];
    }

    getEstadoSeverity(): string {
        const severities: Record<EstadoCarga, string> = {
            inicial: 'secondary',
            cargado: 'info',
            validado: 'success',
        };
        return severities[this.estado];
    }

    listarCargaSire(): void {
        const periodo = this.frmDatos?.get('periodo')?.value ?? this.getPeriodoActual();
        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            periodo,
        };
        const sub = this.cargaSireService.cargaSireList(objeto).subscribe({
            next: (rpta: any) => {
                console.log('listarCargaSire', rpta);
                this.lstHistorialCarga = rpta?.cargasire ?? [];
            },
            error: () => {
                this.lstHistorialCarga = [];
            },
        });
        this.$listSubcription.push(sub);
    }

    grabarCargaSire(detalle: any[], errores: any[]): void {
        const objeto = {
            idcargasire: 0,
            periodo: this.periodoLabel.replace('/', ''),
            nombrearchivo: this.nombreArchivo,
            totalregistros: detalle.length,
            totalerrors: errores.length,
            estado: 'PENDIENTE',
            detalle,
            errores,
            iduserreg: constantesLocalStorage.idusuario,
        };
        const sub = this.cargaSireService.cargaSirePrc(objeto).subscribe({
            next: (rpta: any) => {
                if (rpta?.ProcesoSwitch === 0) {
                    this.listarCargaSire();
                }
            },
            error: () => {},
        });
        this.$listSubcription.push(sub);
    }

    //  listarPlanContable(){

    //   const $listarPlanContable = this.contabilidadService.listarPlanContable()
    //     .subscribe({
    //       next: (rpta:any) => {
    //           console.log('listarPlanContable', rpta);
    //       },
    //       error:(err)=>{
    //           this.serviceSharedApp.messageToast()
    //       }
    //     });
    //   this.$listSubcription.push($listarPlanContable)
    // }
}
