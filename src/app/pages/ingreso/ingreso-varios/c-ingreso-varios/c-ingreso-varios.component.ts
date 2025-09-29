import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';

@Component({
  selector: 'app-c-ingreso-varios',
  templateUrl: './c-ingreso-varios.component.html',
  styleUrls: ['./c-ingreso-varios.component.scss']
})
export class CIngresosVariosComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstMovimientos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    dataDet: any;
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    ordenCompra: any;
    listadoArchivos: any[]=[];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private comprasService: ComprasService, 
        
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'idordencompra' },
          { field: 'codigonroorden', header: 'codigonroorden ' },
          { field: 'fechaingreso', header: 'fechaingreso ' },
          { field: 'nomalmacen', header: 'nomalmacen ' },
          { field: 'nomestado', header: 'ESTADO' }
          
      ];
    }

    createFrm(){
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
            {
              value: constantesLocalStorage.idusuario,
              disabled: false,
            },
          ],
          idproveedor: [{value: 0,disabled: false}],
        idmoneda: [{value: 0,disabled: false}],idcliente: [{value: 0,disabled: false}],
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
        idtipodocprc: 3
      }

      const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta.ordenescompra);
              this.lstMovimientos = rpta.ordenescompra
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

    onVer(dato: any) {
     
        this.tituloDetalle =  'N° DOCUMENTO - '+ dato.idordencompra;
        this.dataDet = {
          idcodigo: dato.idordencompra,
          paramReg:'V',
          idtipodocprc: 3
        } 
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      
        this.tituloDetalle = 'N° DOCUMENTO - '+ dato.idordencompra;
        this.dataDet = {
          idcodigo: dato.idordencompra,
          paramReg:'E',
          idtipodocprc: 3
        } 
        this.vistaLista = false;
    }

  

    getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    onNuevo() {        
      this.tituloDetalle = "REGISTRAR INGRESO VARIOS";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N',
        idtipodocprc: 3
      } 
      this.vistaLista = false;
    }


    getExportarExcel(data :any) {
      this.lstExportar = [];
      if (data.filteredValue !== undefined) {
        this.lstExportExcel = data.filteredValue;
      }else{
        this.lstExportExcel = data._value
      }
      
      for (let i = 0; i < this.lstExportExcel.length; i++) {       
          const objeto = {
              'N°': i + 1,
              'CÓDIGO': this.lstExportExcel[i].idordencompra,
              'ALMACÉN': this.lstExportExcel[i].nomalmacen,
              'ESTADO' : this.lstExportExcel[i].nomestado,              
          }
          this.lstExportar.push(objeto);
      }
  
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'Ingresos Varios');
        });
      }
  
      saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_'+ EXCEL_EXTENSION);
      }

      toggleMenu(event: Event, data: any) {
        if (data.acciones) {
            this.cargarMenu(data.acciones);
            this.ordenCompra = data;
            this.menu.toggle(event);
        }
    }
  
      cargarMenu(data: any) {
        this.menuItems = [];
        data.forEach((item: any) => {
            this.menuItems.push({
                label: item.nomtrx,
                icon: 'pi pi-cog',
                command: () => this.onAccion(item)
            })
        });
      }
    
      onAccion(item: any) {
        console.log('onAccion',item);
        let lstItem = this.ordenCompra.items;
        const total = lstItem.filter((item: any) => item.indcompleto === true).length;
        if (total === 0) {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items sin Confirmar...!' });
            return;
        }
        
        for (let i = 0; i < lstItem.length; i++) {
            if (lstItem[i].indcompleto === true && lstItem[i].idubicacion === 0) {
              this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Ubicación...!' });
              return;
            }

            if (lstItem[i].codtipoexistencia === 0) {
              this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Tipo de Existencia...!' });
              return;
            }

            if (lstItem[i].servicetag === '' && lstItem[i].serialnumber === '') {
              this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Service Tag o Serial Number...!' });
              return;
            }
        }
        this.getListaArchivos(item);
          console.log('onAccion', item);
      }
  
      getListaArchivos(valor:any) {
      
        const objeto = {
          idoportunidad: 0,
          codtipoproc: 7 , 
          idnroproceso: this.ordenCompra.idordencompra, 
        }
        console.log('this.objeto ...', objeto );
      
      const $listarArchivos = this.comprasService.ListarAdjuntoProc(objeto)
        .subscribe({
          next: (rpta: any) => {
            this.listadoArchivos = rpta;
            console.log('this.listadoArchivos ...', this.listadoArchivos );
  
            if (this.listadoArchivos.length === 0) {
              this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Debe Ingresar Adjunto...!' });
                  return;
            }else{
              this.ordenCompra.idtrx = valor.idtrx;
        console.log('onAccion', valor);
        const ref = this.dialogService.open(CModalExcAlmacenComponent, {
            data: this.ordenCompra,
            header: valor.nomtrx ,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '40%'
        });
    
        ref.onClose.subscribe(() => {
            this.getListar();
          });
            }
          },
          error: (err) => {
            this.serviceSharedApp.messageToast();
          },
          complete: () => { }
        });
      this.$listSubcription.push($listarArchivos)
      }
}
