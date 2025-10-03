import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService,  MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

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
    lstItem: any []= [];
    lstDocumentoPrc: any[]=[];
    lstCategoriaDoc: any[]=[];
    verRegistro: boolean = false;
    idAsientoDet: number = 0;

    lstCtaCtble: any;
    lstConcepto: any;
    lstPartida: any;

    constructor(
        private fb: FormBuilder,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private serviceSharedApp: SharedAppService,
        private serviceUtilitario: UtilitariosService,
        public dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private contabilidadService: ContabilidadService,
    ) {}

    ngOnInit(): void {

        console.log('this.IA_data', this.IA_data);
        this.idAsiento = this.IA_data;
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
            idasientocfgitem: [{ value: 0, disabled: false }],
      conceptoctble: [{ value: 0, disabled: false }],
      partidacfg: [{ value: 0, disabled: false }],
      ctactble: [{ value: '', disabled: false }],
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

        const $cargarOrdenC = this.contabilidadService
            .traerunoAsiento(this.idAsiento)
            .subscribe({
                next: (rpta: any) => {
                    console.log('traerUno', rpta.asientocfg[0]);
                    this.registerFormRegistro.patchValue(rpta.asientocfg[0]);

                    if (rpta.asientocfg[0].items !== undefined) {
                        this.lstItem = rpta.asientocfg[0].items;
                    }
                    this.listarCategoriaDoc();
                    this.registerFormRegistro.get('idcategoria')?.setValue(rpta.asientocfg[0].idcategoria);
                   
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

        if (this.lstItem.length === 0) {
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

        if (this.registerFormRegistro.value.idcategoria === null ||this.registerFormRegistro.value.idcategoria === ''  ) {
            this.messageService.add({
                severity: 'info',
                summary: 'Aviso',
                detail: 'Debe seleccionar un Motivo',
            });
            return;
        }

        this.registerFormRegistro.get('conceptoctble')?.setValue(null);
        this.registerFormRegistro.get('partidacfg')?.setValue(null);
        this.registerFormRegistro.get('ctactble')?.setValue(null);

        this.listarPlanContable();
        this.listarPartida();
        this.listarConcepto();

        this.verRegistro = true;
      
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

  guardarRegistro() {
  if (this.validarDatosAsiento())
    {
        console.log("errorMensaje : ", this.errorMensaje);
        this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
        return;
    }

    const concepto = this.lstConcepto.filter((x: { iditem: any; })=>x.iditem === this.registerFormRegistro.value.conceptoctble)[0].valoritem;
    const partida = this.lstPartida.filter((x: { iditem: any; })=>x.iditem === this.registerFormRegistro.value.partidacfg)[0].valoritem;
    const cuentactble = this.lstCtaCtble.filter((x: { codctactble: any; })=>x.codctactble === this.registerFormRegistro.value.ctactble)[0].s_desctactble;
       

    const objeto = {
        idasientocfg: this.idAsiento,
        idasientocfgitem: 0,
        conceptoctble: this.registerFormRegistro.value.conceptoctble,
        partidacfg: this.registerFormRegistro.value.partidacfg,
        ctactble: this.registerFormRegistro.value.ctactble,
        nomconceptoctble: concepto,
        nompartidacfg: partida,
        nomctactble: cuentactble,

    }

    console.log("guardarRegistro : ", objeto);

    this.lstItem.push(objeto);

    console.log("this.lstItem : ", this.lstItem);
    this.verRegistro = false;

  }

  validarDatosAsiento():boolean{
  let _error = false;
  this.errorMensaje="";
  console.log('validarDatosAsiento',this.registerFormRegistro.value)
    

     if ( this.registerFormRegistro.value.conceptoctble === null || this.registerFormRegistro.value.conceptoctble === '' || this.registerFormRegistro.value.conceptoctble === 0)
     {
          this.errorMensaje="Seleccionar Concepto Contable...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.partidacfg === null || this.registerFormRegistro.value.partidacfg === '' || this.registerFormRegistro.value.partidacfg === 0))
     {
          this.errorMensaje="Seleccionar Partida...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.ctactble === null || this.registerFormRegistro.value.ctactble === '' || this.registerFormRegistro.value.ctactble === 0))
     {
          this.errorMensaje="Seleccionar Cuenta Contable...!";
          _error = true;
     }

     
     
     return _error;
   }

  listarPlanContable() {
    const $listarPlanContable = this.contabilidadService
        .listarPlanContable()
        .subscribe({
            next: (rpta: any) => {
                console.log('listarPlanContable...', rpta);
                this.setSpinner(false);
                this.lstCtaCtble = rpta;
            },
            error: (err) => {
                this.setSpinner(false);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
    this.$listSubcription.push($listarPlanContable);
  }

  listarConcepto() {
    this.lstConcepto = [];
    this.contabilidadService.obtenerItemsTabla(130).subscribe({
        next: (rpta: any) => {
            let listafilter;
            if (this.registerFormRegistro.value.idtipodocprc === 6) {
                listafilter = rpta.filter((item: any) => item.coditem === '6');
            } else {
                listafilter = rpta.filter((item: any) => item.coditem === '7');
            }
            if (this.registerFormRegistro.value.idasientocfg > 0) {
              this.registerFormRegistro.get('conceptoctble')?.setValue(this.registerFormRegistro.value.conceptoctble);
            }
            this.lstConcepto = listafilter;
        },
            error: (err) => {
                console.info('error : ', err);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {
              this.setSpinner(false);
            },
        });
    }

    listarPartida() {
        this.contabilidadService.obtenerItemsTabla(131).subscribe({
            next: (rpta: any) => {
                console.info('listarItemsTabla : ', rpta);
                this.lstPartida = rpta;
            },
            error: (err) => {
                console.info('error : ', err);
                this.serviceSharedApp.messageToast();
            },
            complete: () => {},
        });
    }

    eliminarItem(data: any) {
        console.log('eliminarItem...!', data)
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message:
                '¿Desea Eliminar Item ' +
                '<b>' +
                data.nomconceptoctble +
                '</b>' +
                '?',
            accept: () => {
                if (this.idAsiento > 0) {
                    const _posAll: number = this.lstItem.findIndex(
                        (x) => x.idasientocfgitem === data.idasientocfgitem
                    );
                    if (_posAll != -1) {
                        this.lstItem.splice(_posAll, 1);
                    }
                } else {
                    const _posAll: number = this.lstItem.findIndex(
                        (x) => x.idnvoitem === data.idnvoitem
                    );
                    if (_posAll != -1) {
                        this.lstItem.splice(_posAll, 1);
                    }
                }              
            },
        });
    }

}
