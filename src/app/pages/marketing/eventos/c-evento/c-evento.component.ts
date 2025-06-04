import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesQuestion,
    mensajesSpinner,
} from '@constantes';
import { Cliente, eventoList } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import * as FileSaver from 'file-saver';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MarketingService } from '../../service/marketingServices';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
    selector: 'app-c-evento',
    templateUrl: './c-evento.component.html',
    styleUrls: ['./c-evento.component.scss'],
})
export class CEventoComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];

    dataCT: any;
    vistaLista: boolean = true;
    visDetalle: boolean = false;

    listaClientes: Cliente[] = [];
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    lists: any[] = [];
    listIds: string[] = [];
    lstProveedores: any[] = [];
    existChange: boolean = false;
    existMsj: string = '';

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        private comprasService: ComprasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private marketingService: MarketingService,
        private serviceSharedApp: SharedAppService,
        private proyectosService: ProyectosService
    ) {}

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
    }

    ngOnInit(): void {
        this.createFrm();
        this.getKanbanList();
        this.listaProveedores();
    }

    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
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
        });
    }

    // getPersona() {
    //   this.setSpinner(true);
    //   this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    //   const objeto = {
    //       idrolpersona: 'ADM',
    //       idusuario: constantesLocalStorage.idusuario
    //   }

    //   const $getClientes =  this.comprasService.ListaProveedores(objeto).subscribe({
    //       next: (rpta: any) => {
    //           this.setSpinner(false);
    //           console.info('getClientes : ', rpta);
    //           this.listaClientes = rpta;
    //       },
    //       error: (err) => {
    //           this.setSpinner(false);
    //           console.info('error : ', err);
    //           this.messageService.clear();
    //           this.messageService.add({
    //               severity: 'error',
    //               summary: 'Error',
    //               detail: mensajesQuestion.msgErrorGenerico,
    //           });
    //       },
    //       complete: () => {},
    //       });
    //       this.$listSubcription.push($getClientes);

    // }

    onVer(data: any) {
        this.tituloDetalle =
            'VER EVENTO' + data.razonsocial + '  RAZÓN SOCIAL: ';
        this.vistaLista = false;
        this.visDetalle = true;
    }

    EditarCliente(data: any) {
        console.log('EditarCliente : ', data);
        this.tituloDetalle = data.title;
        this.vistaLista = false;
        this.visDetalle = true;

        this.dataCT = data;
    }

    onNuevo(data: any) {
        this.dataCT = data;
        this.tituloDetalle = 'REGISTRAR EVENTO';
        this.vistaLista = false;
        this.visDetalle = true;
    }

    getDetalle(dato: any) {
        console.log('getBack : ', dato);
        this.existMsj = dato.msj;
        this.existChange = dato.valor;
    }

    getBack() {
        if (this.existChange) {
            this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message:  this.existMsj ,
            accept: () => {
              this.existChange = false;
              this.vistaLista = true;
              this.visDetalle = false;
              this.getKanbanList();
            }
        });
        }else{
          this.vistaLista = true;
          this.visDetalle = false;
          this.getKanbanList();
        }

        
        
    }

    onVerDetalle(data: any) {
        this.setSpinner(true);
        this.mensajeSpinner = 'Descargando Detalle...!';

        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            idpersona: data.idcliente,
        };

        const $cargarOrdenC = this.comprasService
            .descargarInformeEmpleado(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);

                    const mediaType = 'application/pdf';
                    const blob = new Blob([rpta.body], { type: mediaType });
                    const filename = 'INFORME-' + data.razonsocial;

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

    actualizarEventos() {
        this.getKanbanList();
    }

    dropList(event: CdkDragDrop<eventoList[]>) {
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );
    }

    getKanbanList() {
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;
        const objeto = {
            ...this.frmDatos.value,
            // nombreUsuario: "",
            // clave: "",
            // idusuario: constantesLocalStorage.idusuario,
            // idproveedor: this.frmDatos.get('idproveedor')?.value
        };
        const $kanbanList = this.marketingService
            .kanbanEventoList(objeto)
            .subscribe({
                next: (rpta: any) => {
                    console.log('kanbanEventoList : ', rpta);
                    this.setSpinner(false);
                    this.lists = rpta.listas;
                    this.listIds = this.lists.map((l) => l.listId || '');
                    console.log('lists : ', this.lists);
                    console.log('listIds : ', this.listIds);
                },
                error: (err) => {
                    this.setSpinner(false);
                    console.error('error : ', err);
                    this.messageService.clear();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: mensajesQuestion.msgErrorGenerico,
                    });
                },
                complete: () => {},
            });
        this.$listSubcription.push($kanbanList);
    }

    listaProveedores() {
        const $getClientes = this.proyectosService
            .obtenerClientes('PRO')
            .subscribe({
                next: (rpta: any) => {
                    this.lstProveedores = rpta;
                    const objet = {
                        idcliente: 0,
                        nomcomercial: 'TODOS',
                    };
                    this.lstProveedores.unshift(objet);
                },
                error: (err) => {
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {},
            });
        this.$listSubcription.push($getClientes);
    }

    getExportarExcel() {
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

        const objeto = {
            ...this.frmDatos.value,
        };

        const $getListar = this.marketingService
            .exportarExcelEvento(objeto)
            .subscribe({
                next: (rpta: any) => {
                    this.setSpinner(false);
                    this.utilitariosService.descargarExcel(rpta, 'Eventos');
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
}
