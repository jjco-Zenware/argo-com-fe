
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CBusquedaProductoComponent } from '../../busqueda-producto/c-busqueda-producto.component';
import { AlmacenService } from '../../service/almacenServices';

@Component({
  selector: 'app-c-stock',
  templateUrl: './c-stock.component.html',
  styleUrls: ['./c-stock.component.scss']
})
export class CStockComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstCatalogo:any;
    tituloKardex: string = 'STOCK';
    lstProducto:any;
    lstFamilia:any;
    lstSubFamilia:any;
    lstAlmacenCB: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        //private proyectosService: ProyectosService,   
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private almacenService: AlmacenService,         
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        this.listarFamilia();
        this.ListarAlamcen();
        //this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'ID ALMACÉN' },
          { field: 'nomtipoorden', header: 'OFICINA ' },
          { field: 'codigonroorden', header: 'NOMBRE' },
          { field: 'nomcomercial', header: 'DIRECCIÓN' },
          { field: 'nomestado', header: 'ESTADO' }
          
      ];

        // this.confirmationService.confirm({
        //     key: 'confirm1',
        //     header: 'Aviso',
        //     message:  'Existen Nuevas Funcionalidades...',
        //     accept: () => {
        //       this.acceptfuncionalidad();
        //     }
        // });
    }

    createFrm(){
        this.frmDatos = this.fb.group({
          fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
          fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(), disabled: false}],     
          idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
          codproducto: [{value: '',disabled: false}],
          idfamilia: [{value: 0,disabled: false}],
          idsubfamilia: [{value: 0,disabled: false}]     ,
          idalmacen: [{value: 0,disabled: false}]  ,
          idtipodocprc : [{value: 0 ,disabled: false}]       
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

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      // console.log('this.frmDatos...', this.frmDatos.value);
      // const objeto = {
      //   ...this.frmDatos.value,
      //   idfamilia: 0,
      //   idsubfamilia:0
      // }
      // console.log('this.objeto...', objeto);

      const $getListarOrdenCompra = this.almacenService.buscarProducto(this.frmDatos.value)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta);
              this.lstCatalogo = rpta
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


    

    acceptfuncionalidad() {
        this.confirmationService.confirm({
            message: 'Se agrego este nuevo filtro para la busqueda de Productos...',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    getBusquedaAvanzada(data: any) {
      console.log('CBusquedaProductoComponent', data);
      let idalmacen = 0;
      const refItem = this.dialogService.open(CBusquedaProductoComponent, {
        data: idalmacen,
        header: "Busqueda Avanzada por Productos",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '60%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta.data);
        this.tituloKardex = "STOCK  -  CÓDIGO: " + rpta.data.codproducto + "  -  PRODUCTO: " + rpta.data.despro ;
        this.frmDatos.get('codproducto')?.setValue(rpta.data.codproducto);

        this.getListar();
        // if (rpta != undefined) {
        //     const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
        //     if (_posAll != -1) {
        //       this.lstItemOC.splice(_posAll, 1)
        //     }
        //     console.log('getItem',rpta.objeto);
        //   this.lstItemOC.push(rpta.objeto);
        //   console.log('this.lstItemOC',this.lstItemOC);
        // }
      });
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
              this.frmDatos.get('idsubfamilia')?.setValue(0);
          },
          error: (err) => {
              this.setSpinner(false);
              console.info('error : ', err);
              this.serviceSharedApp.messageToast()
          },
          complete: () => {},
      });
      this.$listSubcription.push($getSubFamilia);
    }

    ListarAlamcen(){
      const objeto = {
        idalmacen:0,
        idofi: 0
      }
      const $getListar = this.almacenService.ListarAlamcen(objeto)
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta lstAlmacenCB', rpta);
              
              this.lstAlmacenCB = rpta
              const objet = {
                idalmacen: 0,
                nomalmacen: 'TODOS'
              }
              this.lstAlmacenCB.unshift(objet);
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }
}
