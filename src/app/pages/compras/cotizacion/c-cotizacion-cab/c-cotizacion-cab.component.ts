import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalExcTransacComponent } from '../../orden-compra-servicio/modal-exc-transac/modal-exc-transac.component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-c-cotizacion-cab',
  templateUrl: './c-cotizacion-cab.component.html',
  styleUrls: ['./c-cotizacion-cab.component.scss']
})
export class CCotizacionComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstCotizacion: any;
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    dataOC:any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    ordenCompra: any;
    cols: any[] = [];
    lstExportar: any[] = [];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListarOrdenCompra();
        this.cols = [
          { field: 'idordencompra', header: 'ID OC' },
          { field: 'codigonroorden', header: 'N COTIZACIÓN' },
          { field: 'nomcomercial', header: 'CLIENTE' },
          { field: 'nommoneda', header: 'MONEDA' },
          { field: 's_monto', header: 'MONTO' },
          { field: 'codigoproyecto', header: 'COD PROYECTO' },
          { field: 'nomproyecto', header: 'PROYECTO' },
          { field: 'nomestado', header: 'ESTADO' },
      ];
    }

    ngOnDestroy(): void {
      if (this.$listSubcription != undefined) {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
      }
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
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
      })
    }

    getListarOrdenCompra(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      //console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idtipodocprc: 1
      }

      const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta.ordenescompra);
              //this.lstCotizacion = rpta.ordenescompra
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
      let codigo;
      if (dato.estado === 'EMI' || dato.estado === 'ANU') {
        codigo = dato.codigonroorden;
      }else{
        codigo = dato.idordencompra;
      }
        this.tituloDetalle = "COTIZACIÓN N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'V'
        }
        this.vistaLista = false;
    }


    verCotiza(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "COTIZACIÓN N° " + data.codigonroorden;
        this.vistaLista = false;
        this.visDetalle = false;
    }

    getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListarOrdenCompra();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListarOrdenCompra();
    }

    onNuevo() {        
      this.tituloDetalle = "NUEVA COTIZACIÓN";
      this.dataOC = {
        idordencompra: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
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
      this.ordenCompra.idtrx = item.idtrx;
      console.log('onAccion', item);
      const ref = this.dialogService.open(CModalExcTransacComponent, {
          data: this.ordenCompra,
          header: item.nomtrx +' - '+  this.ordenCompra.labelnrodocumento,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
      });
  
      ref.onClose.subscribe(() => {
          this.getListarOrdenCompra();
        });
    }

    getExportarExcel() {

      this.lstExportar = [];
      // for (let i = 0; i < this.lstOrdenCompra.length; i++) {       
      //     const objeto = {
      //         'N°': i + 1,
      //         'TIPO': this.lstOrdenCompra[i].nomtipoorden,
      //         'N° ORDEN': this.lstOrdenCompra[i].codigonroorden,
      //         'PROVEEDOR': this.lstOrdenCompra[i].nomcomercial,
      //         'N° RUC': this.lstOrdenCompra[i].nrodocumento,
      //         'MONEDA': this.lstOrdenCompra[i].nommoneda,
      //         'BASE IMPONIBLE': 0,
      //         'IGV': 0,
      //         'TOTAL': this.lstOrdenCompra[i].s_monto,
      //         'COD PROYECTO' : this.lstOrdenCompra[i].codigoproyecto,
      //         'NOM PROYECTO' : this.lstOrdenCompra[i].nomproyecto,
      //         'ESTADO' : this.lstOrdenCompra[i].nomestado
              
      //     }
      //     this.lstExportar.push(objeto);
      // }
  
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'Orden Compra');
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
}