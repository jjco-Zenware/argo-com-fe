import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, KanbanCard } from '@interfaces';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { TesoreriaService } from 'src/app/pages/tesoreria/service/tesoreriaServices';
import { ContabilidadService } from '../../service/contabilidad.services';
import { SharedAppService } from '@sharedAppService';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';

@Component({
  selector: 'app-modal-amarre',
  templateUrl: './modal-amarre.component.html',
  styleUrls: ['./modal-amarre.component.scss']
})
export class ModalAmarreComponent implements OnInit, OnDestroy {

  $listSubcription: Subscription[] = [];
  registerFormRegistro!: FormGroup;
  lstDocumentoPrc: any[]=[];
  annio: Date = new Date;
  errorMensaje!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "Cargando...!";
  lstCentroCosto:any;
  lstCtaCtble: any;
  lstConcepto: any;
  lstPartida: any;
  lstCategoriaDoc: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public refDatoItem: DynamicDialogRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    private contabilidadService: ContabilidadService,  
    private serviceSharedApp: SharedAppService,
    private comprasService: ComprasService,

) {}




ngOnInit(): void {  
  console.log('codigop ver...',this.config.data);
  this.createFormRegistro();
  this.listarDocumentoPrc();
  this.listarPlanContable();
  //this.listarConcepto();
  this.listarPartida();
  //this.listarCategoriaDoc();

  if (this.config.data.idasientocfg > 0) {
    this.setSpinner(true);
    this.listarCategoriaDoc();
    this.registerFormRegistro.patchValue(this.config.data);
  }
}

ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}

get formRegistro() { return this.registerFormRegistro.controls; }
  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idasientocfgitem: [{ value: this.config.data.idasientocfgitem, disabled: false }],
      idtipodocprc: [{ value: 0, disabled: false }],
      idcategoria: [{ value: 0, disabled: false }],
      conceptoctble: [{ value: 0, disabled: false }],
      partidacfg: [{ value: 0, disabled: false }],
      ctactble: [{ value: '', disabled: false }],
    });
}

guardarRegistro() {
  if (this.validarDatos())
    {
        console.log("errorMensaje : ", this.errorMensaje);
        this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
        return;
    }

    this.refDatoItem.close(null);


//   this.contabilidadService.amarrecontablePrc(this.registerFormRegistro.value).subscribe({
//     next: (rpta: any) => {
//     if (rpta.procesoSwitch === 0) {
//       console.info('lstProyecto : ', rpta );
//       this.refDatoItem.close();
//     }else{
//       this.messageService.add({severity: 'info', summary: 'Validación', detail: rpta.mensaje});
//     }
    
//     },
//     error: (err) => {
//     console.info('error : ', err);
//     this.messageService.clear();
//     this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: mensajesQuestion.msgErrorGenerico,
//     });
//     },
//     complete: () => {
//     },
// });

  
 //this.cerrar({...this.registerFormRegistro.value})

  }

  // cerrar(data:any) {
  //   const objeto = {
  //     ...data
  //   }
  //   this.refDatoItem.close({objeto});
  // }

validarDatos():boolean{
  let _error = false;
  this.errorMensaje="";
  console.log('validarDatos',this.registerFormRegistro.value)

     if (this.registerFormRegistro.value.idtipodocprc === '' || this.registerFormRegistro.value.idtipodocprc === null || this.registerFormRegistro.value.idtipodocprc === 0)
     {
          this.errorMensaje="Seleccionar Tipo de Documento...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.idcategoria === null || this.registerFormRegistro.value.idcategoria === '' || this.registerFormRegistro.value.idcategoria === 0))
     {
          this.errorMensaje="Seleccionar Categoría...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.conceptoctble === null || this.registerFormRegistro.value.conceptoctble === '' || this.registerFormRegistro.value.conceptoctble === 0))
     {
          this.errorMensaje="Seleccionar Concepto Contable...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.codctactble === null || this.registerFormRegistro.value.codctactble === '' || this.registerFormRegistro.value.codctactble === 0))
     {
          this.errorMensaje="Seleccionar Cuenta Contable...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.partidacfg === null || this.registerFormRegistro.value.partidacfg === '' || this.registerFormRegistro.value.partidacfg === 0))
     {
          this.errorMensaje="Seleccionar Partida...!";
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
    this.comprasService.obtenerItemsTabla(130).subscribe({
        next: (rpta: any) => {
            let listafilter;
            if (this.registerFormRegistro.value.idtipodocprc === 6) {
                listafilter = rpta.filter((item: any) => item.coditem === '6');
            } else {
                listafilter = rpta.filter((item: any) => item.coditem === '7');
            }
            if (this.registerFormRegistro.value.idasientocfg > 0) {
              this.registerFormRegistro.get('conceptoctble')?.setValue(this.config.data.conceptoctble);
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
        this.comprasService.obtenerItemsTabla(131).subscribe({
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
                this.lstCategoriaDoc = rpta;
                this.listarConcepto() // Actualizar conceptos según la categoría seleccionada
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
