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
  selector: 'app-c-aprobacion',
  templateUrl: './c-aprobacion.component.html',
  styleUrls: ['./c-aprobacion.component.scss']
})
export class CAprobacionComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstOrdenCompra: any;
    lstOrdenCompraPen: any;
    lstOrdenCompraApro: any;
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    dataOC:any;
    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    ordenCompra: any;
    cols: any[] = [];    
    lstExportar: any[] = [];
    lstOrdenCompraExportar: any;

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
        this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'ID OC' },
          { field: 'nomtipoorden', header: 'TIPO ORDEN' },
          { field: 'codigonroorden', header: 'N ORDEN' },
          { field: 'nomcomercial', header: 'PROVEEDOR' },
          { field: 'nommoneda', header: 'MONEDA' },
          { field: 'codigoproyecto', header: 'COD PROYECTO' },
          { field: 'nomproyecto', header: 'PROYECTO' },
          { field: 's_monto', header: 'SUBTOTAL' },
          { field: 's_monto', header: 'IGV' },
          { field: 's_monto', header: 'TOTAL' },
          { field: 'nomestado', header: 'ESTADO' }
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
        idproveedor: [{value: 0,disabled: false}],
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}],
        idcentrocosto: [{ value: 0, disabled: false }]
      })
    }

    
    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      //console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idtipodocprc: 0
      }

      const $getListar = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListar', rpta.ordenescompra);
              this.lstOrdenCompra = rpta.ordenescompra
              this.lstOrdenCompraPen = this.lstOrdenCompra.filter((x: { estado: string; }) => x.estado === 'PRC');
              this.lstOrdenCompraApro = this.lstOrdenCompra.filter((x: { estado: string; }) => x.estado === 'EMI');
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

    onVer(dato: any) {
      let codigo;
      if (dato.estado === 'EMI' || dato.estado === 'ANU') {
        codigo = dato.codigonroorden;
      }else{
        codigo = dato.idordencompra;
      }
        this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'V'
        }
        this.vistaLista = false;
    }


    verCotiza(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "Cotización de Orden de Compra/Servicio N° " + data.codigonroorden;
        this.vistaLista = false;
        this.visDetalle = false;
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
      this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS";
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
          header: item.nomtrx,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
      });
  
      ref.onClose.subscribe(() => {
          this.getListar();
        });
    }

    selectHeaders(tabNumber: any) {
      if (tabNumber.index === 0) {
        this.lstOrdenCompraExportar = this.lstOrdenCompraPen;
      }else{
        this.lstOrdenCompraExportar = this.lstOrdenCompraApro;
      }
    }

    getExportarExcel() {

      this.lstExportar = [];
      for (let i = 0; i < this.lstOrdenCompraExportar.length; i++) {       
          const objeto = {
              'N°': i + 1,
              'TIPO': this.lstOrdenCompraExportar[i].nomtipoorden,
              'N° ORDEN': this.lstOrdenCompraExportar[i].codigonroorden,
              'PROVEEDOR': this.lstOrdenCompraExportar[i].nomcomercial,
              'N° RUC': this.lstOrdenCompraExportar[i].nrodocumento,
              'MONEDA': this.lstOrdenCompraExportar[i].nommoneda,
              'BASE IMPONIBLE': 0,
              'IGV': 0,
              'TOTAL': this.lstOrdenCompraExportar[i].s_monto,
              'COD PROYECTO' : this.lstOrdenCompraExportar[i].codigoproyecto,
              'NOM PROYECTO' : this.lstOrdenCompraExportar[i].nomproyecto,
              'ESTADO' : this.lstOrdenCompraExportar[i].nomestado
              
          }
          this.lstExportar.push(objeto);
      }
  
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