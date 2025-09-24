
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CBusquedaProductoComponent } from '../../busqueda-producto/c-busqueda-producto.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { AlmacenService } from '../../service/almacenServices';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';

@Component({
  selector: 'app-c-kardex',
  templateUrl: './c-kardex.component.html',
  styleUrls: ['./c-kardex.component.scss']
})
export class CKardexComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    lstAlmacen: any;
    lstAlmacenCB: any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstProducto:any;
    tituloKardex: string = 'KARDEX';
    idprod: any;
    lstOrigen: any;
    lstProyectos: any;
    lstOrdenC: any;
      lstProveedores: any[] = [];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,   
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private almacenService: AlmacenService,
        private ordencompraService: OrdencompraService,
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        this.ListarAlamcen(); 
        this.listaProyectoTipo();
        this.listaProveedores();
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
          fechaini: [{value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
          fechafin: [{value: this.utilitariosService.obtenerFechaFinMes(), disabled: false}],     
          idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
          codproducto: [{value: '',disabled: false}],         
          idalmacen: [{value: 0 ,disabled: false}]  ,
          idtipoproyecto : [{value: 0 ,disabled: false}]  ,   
          idproyecto : [{value: 0 ,disabled: false}]  ,   
          idordencompra : [{value: 0 ,disabled: false}]  ,    
          idproveedor : [{value: 0 ,disabled: false}]  ,      
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
      console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idprod : this.idprod
      }

      const $getListarOrdenCompra = this.proyectosService.kardexlistar(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta kardex', rpta);
              this.lstAlmacen = rpta
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
        this.tituloKardex = "CONSULTA DE MOVIMIENTO  -  CÓDIGO: " + rpta.data.codproducto + "  -  PRODUCTO: " + rpta.data.despro ;
        this.frmDatos.get('codproducto')?.setValue(rpta.data.codproducto);
        this.idprod = rpta.data.idprod
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

    listaProyectoTipo(){
          this.ordencompraService.tipoProyectoList().subscribe({
            next: (rpta: any) => {
            this.lstOrigen = rpta;
            const objet = {
              idtipoproyecto: 0,
              nomtipoproyecto: 'TODOS'
            }
            this.lstOrigen.unshift(objet);
            },
            error: (err) => {
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
      }
  
      getOrigen(data:any){
        console.log('getOrigen', data);
        this.cargarProyectos(data);   
    
      }

      cargarProyectos(dato:any){
        console.log('cargarProyectos', dato);
        this.ordencompraService.portipoProyectoList(dato).subscribe({
          next: (rpta: any) => {
          this.lstProyectos = rpta;
          const obj = {
            idproyecto:0,
            s_nomproyecto:'TODOS'
          }
          this.lstProyectos.unshift(obj);
          this.frmDatos.get('idproyecto')?.setValue(0);
    
          
    
          },
    
          error: (err) => {
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
      }

      getOcproveedor(valor:number, dato: any) {  
        this.lstOrdenC = []
        let _persona = this.frmDatos.get('idproveedor')?.value;
        let _proyecto = this.frmDatos.get('idproyecto')?.value;
        if (valor === 0) {
          _proyecto= dato
        }else{
          _persona = dato
        }
        const obj = {
          idproyecto: _proyecto,
          idpersona: _persona,
        }
        const $personaProveedorlist = this.ordencompraService.documentoPrcOrdenCompraxProyecto(obj).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                this.lstOrdenC = rpta;
                const obj = {
                  idordencompra:0,
                  label_resumen:'TODOS'
                }
                this.lstOrdenC.unshift(obj);
                
        this.frmDatos.get('idordencompra')?.setValue(0);
                
              
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
        this.$listSubcription.push($personaProveedorlist);
      }

      listaProveedores() {

        const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
          next: (rpta: any) => {
            this.lstProveedores = rpta;
            const obj = {
              idcliente : 0,
              razonsocial: 'TODOS'
            }
            this.lstProveedores.unshift(obj);
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => { },
        });
        this.$listSubcription.push($getClientes);
    
      }

       exportarExcel() {
              if(this.lstAlmacen === undefined || this.lstAlmacen.length === 0){
                  this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'No hay datos para exportar.' });
                  return;
                }
      
           this.setSpinner(true);
           this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;
        
           const $getListar = this.almacenService.exportarexcelstock(this.frmDatos.value)
           .subscribe({
             next: (rpta:any) => {
                 this.setSpinner(false);
                 this.utilitariosService.descargarExcel(rpta, 'Stock');
             },
             error:(err)=>{
                 this.setSpinner(false);
                 this.serviceSharedApp.messageToast()
             },
             complete:() => {
               this.setSpinner(false);
             }
           });
         this.$listSubcription.push($getListar)
         }
}

