import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesSpinner,
} from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'app-c-seguimiento',
    templateUrl: './c-seguimiento.component.html',
    styleUrls: ['./c-seguimiento.component.scss'],
})
export class CSeguimientosComponent implements OnInit, OnDestroy {
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

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.createFrm();
        //this.getListar();
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

    

    onVer(dato: any) {
        console.log('VER RENDICIÓN DE GASTO ', );

        this.tituloDetalle = 'VER RENDICIÓN DE GASTO';
        this.dataDet = {
            idcodigo: dato.idordencompra,
            paramReg: 'V',
        };
        this.vistaLista = false;
    }

    onEditar(dato: any) {
        console.log('EDITAR RENDICIÓN DE GASTO');
        this.tituloDetalle = 'EDITAR RENDICIÓN DE GASTO' ;
        this.dataDet = {
            idcodigo: dato.idordencompra,
            paramReg: 'E',
        };
        this.vistaLista = false;
    }

    getDetalle(dato: boolean) {
        this.vistaLista = true;
        this.visDetalle = false;
        //this.getListar();
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        //this.getListar();
    }

    onNuevo() {
        this.tituloDetalle = 'REGISTRAR RENDICIÓN DE GASTOS';
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
        this.gasto.idtrx = item.idtrx;
        // const ref = this.dialogService.open(
        //     CModalTransacComponent,
        //     {
        //         data: this.gasto,
        //         header: item.nomtrx,
        //         closeOnEscape: false,
        //         styleClass: 'testDialog',
        //         width: '40%',
        //     }
        // );

        // ref.onClose.subscribe(() => {
        //     this.getListar();
        // });
    }  
}
