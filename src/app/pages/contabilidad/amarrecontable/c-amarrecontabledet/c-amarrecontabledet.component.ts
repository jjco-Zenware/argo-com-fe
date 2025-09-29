import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';
import { ModalAmarreComponent } from '../modal-plan/modal-amarre.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
    selector: 'app-c-amarrecontabledet',
    templateUrl: './c-amarrecontabledet.component.html',
    styleUrls: ['./c-amarrecontabledet.component.scss'],
})
export class CAmarreContableDetComponent implements OnInit, OnDestroy {
    @Input() IA_data: any;
    $listSubcription: Subscription[] = [];
    dataAdjunto: any;
    dataAsiento: any;
    registerFormRegistro!: FormGroup;
    annio: Date = new Date();
    headerTitle: string = '';
    idAsiento: number = 0;
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    verbtnGrabar: boolean = true;   
    verItems: boolean = true; 
    onlyRead: boolean = false;
    errorMensaje: string = '';
    lstAmarreContable: any = [];
    lstItem: any []= [];
    lstDocumentoPrc: any[]=[];
    lstCategoriaDoc: any[]=[];

    constructor(
        private fb: FormBuilder,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private serviceSharedApp: SharedAppService,
        private serviceUtilitario: UtilitariosService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private contabilidadService: ContabilidadService,
        private proyectosService: ProyectosService
    ) {}

    ngOnInit(): void {
        this.idAsiento = this.IA_data.idasientocfg;
        this.createFormRegistro();
        this.listarDocumentoPrc();

        if (this.idAsiento > 0) {
            this.traerUno();
        } 
    }

  

    createFormRegistro() {
        //Agregar validaciones de formulario
        this.registerFormRegistro = this.formBuilder.group({
            idasientocfg: [{ value: 0, disabled: false }],
            idtipodocprc: [{ value: null, disabled: false }],
            desasiento: [{ value: null, disabled: false }],
            codigoasiento: [{ value: null, disabled: false }],
            idcategoria:[{ value: null, disabled: false }],
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

    traerUno() {
        this.setSpinner(true);
        this.mensajeSpinner = 'Cargando...!';
        const objeto = {
            idordencompra: this.idAsiento,
            idusuario: constantesLocalStorage.idusuario,
        };

        const $cargarOrdenC = this.contabilidadService
            .traerunoProducto(objeto)
            .subscribe({
                next: (rpta: any) => {
                    console.log('traerUno', rpta.ordencompra[0]);
                   
                },
                error: (err) => {
                    this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                },
                complete: () => {
                },
            });
        this.$listSubcription.push($cargarOrdenC);
    }

    guardarOC() {
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
        fechaingreso = this.registerFormRegistro.value.fechaingreso;

        //if (this.idAsiento > 0) {
        if (fechaingreso.toString().length === 10) {
            fechaingreso = new Date(
                this.serviceUtilitario.formatFecha(fechaingreso)
            );
        }
        

        const objeto = {
            ...this.registerFormRegistro.getRawValue(),
            items: this.lstItem
        };

        console.log('guardarOC...', objeto);

        this.contabilidadService.amarrecontablePrc(objeto).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                if (rpta.procesoSwitch === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'OK...',
                        detail: rpta.mensaje,
                    });

                    if (this.idAsiento === 0) {
                        this.idAsiento = rpta.resultProceso;
                        
                    }
                    

                    this.traerUno();
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
   

    validarDatos(): boolean {
        let _error = false;
        this.errorMensaje = '';
        console.log('this.formValue...', this.registerFormRegistro.value);

        if (this.lstAmarreContable.length === 0) {
            this.errorMensaje = 'Debe Agregar Items al Asiento...!';
            _error = true;
        }

        if (
            !_error &&
            (this.registerFormRegistro.value.desasiento === null ||
                this.registerFormRegistro.value.desasiento === '')
        ) {
            this.errorMensaje = 'Ingresar Nombre del Asiento...!';
            _error = true;
        }
       
        return _error;
    }

    AgregarAsiento(data:any, index:number) {
      data.nroindex = index;
      data.idasientocfg = this.idAsiento
      
      const refItem = this.dialogService.open(ModalAmarreComponent, {
          data: data,
          header: "Agregar Asiento ",
          styleClass: 'testDialog',
          closeOnEscape: false,
          closable: true,
          width: '40%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        console.log('AgregarAsiento', rpta);
        //this.getListar()
        if (rpta != undefined) {
                const _posAll: number = this.lstItem.findIndex(
                    (x: any) => x.nroindex == index
                );
                if (_posAll != -1) {
                    this.lstItem.splice(_posAll, 1);
                }
                console.log('getItem', rpta.objeto);
                this.lstItem.push(rpta.objeto);
                console.log('this.lstItemOC', this.lstItem);
            }
      });
    }

     listarDocumentoPrc() {
    const $listarDocumentoPrc = this.contabilidadService
        .listarDocumentoPrc()
        .subscribe({
            next: (rpta: any) => {
                console.log('listarDocumentoPrc...', rpta);
                this.setSpinner(false);
                this.lstDocumentoPrc = rpta;
            },
            error: (err) => {
                this.setSpinner(false);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
    this.$listSubcription.push($listarDocumentoPrc);
  }

  listarCategoriaDoc() {
    let tipo = this.registerFormRegistro.value.idtipodocprc;
    const $listarCategoriaDoc = this.contabilidadService
        .listarCategoriasDoc(tipo)
        .subscribe({
            next: (rpta: any) => {
                console.log('listarCategoriasDoc...', rpta);
                this.setSpinner(false);
                this.lstCategoriaDoc = rpta;// Actualizar conceptos según la categoría seleccionada
            },
            error: (err) => {
                this.setSpinner(false);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
    this.$listSubcription.push($listarCategoriaDoc);
  }
}
