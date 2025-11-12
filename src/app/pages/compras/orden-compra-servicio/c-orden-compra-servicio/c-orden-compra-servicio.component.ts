import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalExcTransacComponent } from '../modal-exc-transac/modal-exc-transac.component';
import * as FileSaver from 'file-saver';
import { OrdencompraService } from '../service/ordencompra.service';

@Component({
  selector: 'app-c-orden-compra-servicio',
  templateUrl: './c-orden-compra-servicio.component.html',
  styleUrls: ['./c-orden-compra-servicio.component.scss']
})
export class COrdenCompraServicioComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstOrdenCompra: any;
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
    lstExportExcel: any[] = [];
    lstProveedores: any[] = [];
    lstCliente: any[] = [];
    visXperfil: boolean = true;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        private ordencompraService: OrdencompraService,
        private messageService: MessageService,
        
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListarOrdenCompra();
        this.cols = [
          { field: 'fechaingreso', header: 'FECHA INGRESO' },
          { field: 'nomtipoorden', header: 'TIPO ORDEN' },
          { field: 'codigonroorden', header: 'codigonroorden' },
          { field: 'nomcomercial', header: 'nomcomercial' },
          { field: 'codigoproyecto', header: 'COD PROYECTO' },
          { field: 'nomproyecto', header: 'PROYECTO' },
          { field: 'simbmoneda', header: 'MONEDA' },
          { field: 's_monto', header: 'SUBTOTAL' },
          { field: 's_igv', header: 'IGV' },
          { field: 's_monto_total', header: 'TOTAL' },
          { field: 'nomestado', header: 'ESTADO' }
          // { field: 'estadoentrada', header: 'ESTADO' },
          // { field: 'estadosalida', header: 'ESTADO' }
          
      ];
      this.listaProveedores();
      this.listaClientes();
      if (constantesLocalStorage.idperfil === 11) {
        this.visXperfil = false;
      }else{
        this.visXperfil = true;
        }
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
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idproveedor: [{value: 0,disabled: false}],
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}],
        idcentrocosto: [{ value: 0, disabled: false }]
      })
    }

    getListarOrdenCompra(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      //console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idtipodocprc: 8
      }

      const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta.ordenescompra);
              this.lstOrdenCompra = rpta.ordenescompra
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
        codigo = dato.labelnrodocumento;
      }else{
        codigo = dato.labelnrodocumento;
      }
        this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'V'
        }
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      console.log('onEditar', dato);
      let codigo;
      if (dato.estado === 'EMI' || dato.estado === 'ANU') {
        codigo = dato.labelnrodocumento;
      }else{
        codigo = dato.idordencompra;
      }
        this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          //labelnrodocumento: dato.idordencompra,
          paramReg:'N'
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
      this.getListarOrdenCompra();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListarOrdenCompra();
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
          this.getListarOrdenCompra();
        });
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
              'TIPO': this.lstExportExcel[i].nomtipoorden,
              'N° ORDEN': this.lstExportExcel[i].codigonroorden,
              'N° RUC': this.lstExportExcel[i].nrodocumento,
              'PROVEEDOR': this.lstExportExcel[i].nomcomercial,
              'COD PROYECTO' : this.lstExportExcel[i].codigoproyecto,
              'NOM PROYECTO' : this.lstExportExcel[i].nomproyecto,
              'MONEDA': this.lstExportExcel[i].nommoneda,
              'BASE IMPONIBLE': this.lstExportExcel[i].s_monto,
              'IGV': this.lstExportExcel[i].s_igv,
              'TOTAL': this.lstExportExcel[i].s_monto_total,
              'ESTADO' : this.lstExportExcel[i].nomestado
              
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

      onVerDetalle(data: any) {
          console.log('onVerDetalle...', data);
          console.log('data.items...', data.items);
          if (data.items != undefined ){
            if (data.items.length === 0) {
              this.messageService.add({ severity: 'info', summary: 'Validación...', detail: "Debe Agregar Items...!" });
              return;
            }
          }else{
            this.messageService.add({ severity: 'info', summary: 'Validación...', detail: "Debe Agregar Items...!" });
              return;
          }

          
              // const refItem = this.dialogService.open(CDetalleFacturaComponent, {
              //   data: data,
              //   header: "Detalle de la Factura N° " + data.nrofactura,
              //   closeOnEscape: false,
              //   styleClass: 'testDialog',
              //   width: '50%'
              // });  
              
              this.setSpinner(true);
            this.mensajeSpinner = 'Descargando Detalle...!';
        
            const objeto = {
              idusuario : constantesLocalStorage.idusuario,
              iddocumentoprc: data.idordencompra,
              codtipoprc: 8,
              idplantilla: 0
            }
        
            const $cargarOrdenC = this.ordencompraService.prcDocumento(objeto).subscribe({
              next: (rpta: any) => {
                this.setSpinner(false);      
                
                const mediaType = 'application/pdf';
                  const blob = new Blob([rpta.body], { type: mediaType });
                  const filename = data.codigonroorden !== undefined ? data.codigonroorden : data.idordencompra;
          
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
                  complete: () => {
              },
            });
            this.$listSubcription.push($cargarOrdenC)
      }

      listaProveedores() {

        const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
          next: (rpta: any) => {
            this.lstProveedores = rpta;
            const objet = {
              idcliente: 0,
              razonsocial: 'TODOS'
            }
            this.lstProveedores.unshift(objet);
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => { },
        });
        this.$listSubcription.push($getClientes);
    
      }

      listaClientes() {

        const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
          next: (rpta: any) => {
            this.lstCliente = rpta;
            const objet = {
              idcliente: 0,
              razonsocial: 'TODOS'
            }
            this.lstCliente.unshift(objet);
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => { },
        });
        this.$listSubcription.push($getClientes);
    
      }
}
