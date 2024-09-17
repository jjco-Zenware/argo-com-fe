
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmacenService } from '../service/almacenServices';

@Component({
  selector: 'app-c-busqueda-producto',
  templateUrl: './c-busqueda-producto.component.html',
  styleUrls: ['./c-busqueda-producto.component.scss']
})
export class CBusquedaProductoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstProducto:any;
    lstFamilia:any;
    lstSubFamilia:any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,   
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private almacenService: AlmacenService, 
        public refDatoItem: DynamicDialogRef,
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        this.listarFamilia();
    }

    createFrm(){
        this.frmDatos = this.fb.group({          
          idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
          codproducto: [{ value: '', disabled: false }],
          idfamilia:[{ value: 0, disabled: false }],
          idsubfamilia: [{ value: 0, disabled: false }],
          desproducto:[{ value: '', disabled: false }],
        })
      }

    ngOnDestroy(): void {
      if (this.$listSubcription != undefined) {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
      }
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
    }

    // getListar(){
    //     this.setSpinner(true);
    //     this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      
    //     const $getListarProducto = this.almacenService.listarProducto()
    //       .subscribe({
    //         next: (rpta:any) => {
    //             this.setSpinner(false);
    //             console.log('rpta getListarProducto', rpta);
    //             this.lstProducto = rpta
    //         },
    //         error:(err)=>{
    //             this.setSpinner(false);
    //             this.serviceSharedApp.messageToast()
    //         },
    //         complete:() => {
    //           this.setSpinner(false);
    //         }
    //       });
    //     this.$listSubcription.push($getListarProducto)
    //   }

      getListar(){
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
        console.log('this.frmDatos...', this.frmDatos.value);
        const objeto = {
          ...this.frmDatos.value,
          idfamilia: this.frmDatos.value.idfamilia === null ? 0 : this.frmDatos.value.idfamilia,
          idsubfamilia: this.frmDatos.value.idsubfamilia === null ? 0 : this.frmDatos.value.idsubfamilia
        }
        console.log('this.objeto...', objeto);
  
        const $getListarOrdenCompra = this.almacenService.buscarProducto(objeto)
          .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log('rpta getListarOrdenCompra', rpta);
                this.lstProducto = rpta
            },
            error:(err)=>{
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($getListarOrdenCompra)
      }
    
    listarFamilia() {
        const $listarFamilia = this.almacenService.listarFamilia().subscribe({
          next: (rpta: any) => {
            this.lstFamilia = rpta;
            const objet = {
              idfamilia: 0,
              nomfamilia: 'TODOS'
            }
            this.lstFamilia.unshift(objet);
          },
          error: (err) => {
            console.info('error : ', err);
            this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
        });
        this.$listSubcription.push($listarFamilia);
      }
  
      getSubFamilia(dato: any) {  
        const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                console.info('next : ', rpta);
                this.lstSubFamilia = rpta;
                const objet = {
                  idsubfamilia: 0,
                  nomsubfamilia: 'TODOS'
                }
                this.lstSubFamilia.unshift(objet);
            },
            error: (err) => {
                this.setSpinner(false);
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
        this.$listSubcription.push($getSubFamilia);
      }

      seleccionarProducto(dato: any){
        this.cerrar({...dato})
      }

      cerrar(data:any) {
        // const objeto = {
        //   ...data,
        // }
        this.refDatoItem.close({data});
      }
}
