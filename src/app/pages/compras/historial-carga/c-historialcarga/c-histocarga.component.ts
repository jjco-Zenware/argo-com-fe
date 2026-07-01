import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage } from '@constantes';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CargaSireService } from '../../carga-masiva/service/cargasire.service';

@Component({
    selector: 'app-c-histocarga',
    templateUrl: './c-histocarga.component.html',
    styleUrls: ['./c-histocarga.component.scss'],
})
export class CHistocargaComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    frmDatos!: FormGroup;
    lstHistorialCarga: any[] = [];
    detalleMap: Map<number, any[]> = new Map();
    cargaExpandida: number | null = null;
    loadingDetalle = false;
    blockedDocument = false;
    mensajeSpinner = '';

    constructor(
        private fb: FormBuilder,
        private cargaSireService: CargaSireService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.createFrm();
        this.buscar();
    }

    ngOnDestroy(): void {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }

    createFrm(): void {
        this.frmDatos = this.fb.group({
            periodo: [{ value: new Date(), disabled: false }],
        });
    }

    private formatPeriodo(value: any): string {
        if (value instanceof Date) {
            return `${String(value.getMonth() + 1).padStart(2, '0')}${value.getFullYear()}`;
        }
        const now = new Date();
        return `${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
    }

    private setSpinner(valor: boolean, mensaje = ''): void {
        this.blockedDocument = valor;
        this.mensajeSpinner = mensaje;
    }

    buscar(): void {
        const periodo = this.formatPeriodo(this.frmDatos.get('periodo')?.value);
        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            periodo,
        };
        this.cargaExpandida = null;
        this.detalleMap.clear();
        this.setSpinner(true, 'Consultando historial...');
        const sub = this.cargaSireService.cargaSireList(objeto).subscribe({
            next: (rpta: any) => {
                this.lstHistorialCarga = rpta?.cargasire ?? [];
                this.setSpinner(false);
            },
            error: () => {
                this.lstHistorialCarga = [];
                this.setSpinner(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener el historial de cargas.',
                });
            },
        });
        this.$listSubcription.push(sub);
    }

    toggleDetalle(idcargasire: number): void {
        if (this.cargaExpandida === idcargasire) {
            this.cargaExpandida = null;
            return;
        }
        this.cargaExpandida = idcargasire;
        if (this.detalleMap.has(idcargasire)) return;
        this.loadingDetalle = true;
        const sub = this.cargaSireService.cargaSireDetalleList(idcargasire).subscribe({
            next: (rpta: any) => {
                const data = Array.isArray(rpta)
                    ? rpta
                    : rpta?.detalle ?? rpta?.cargasiredetalle ?? rpta?.data ?? [];
                this.detalleMap.set(idcargasire, data);
                this.loadingDetalle = false;
            },
            error: () => {
                this.detalleMap.set(idcargasire, []);
                this.loadingDetalle = false;
            },
        });
        this.$listSubcription.push(sub);
    }

    getDetalle(idcargasire: number): any[] {
        return this.detalleMap.get(idcargasire) ?? [];
    }

    getEstadoSeverity(estado: string): string {
        const map: Record<string, string> = {
            PENDIENTE: 'warning',
            PROCESADO: 'success',
            ERROR: 'danger',
        };
        return map[estado?.toUpperCase()] ?? 'info';
    }
}
