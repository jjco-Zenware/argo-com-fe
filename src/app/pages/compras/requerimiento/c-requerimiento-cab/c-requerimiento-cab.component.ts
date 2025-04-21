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
import { CModalExcTransacComponent } from '../../orden-compra-servicio/modal-exc-transac/modal-exc-transac.component';
import * as FileSaver from 'file-saver';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';

@Component({
  selector: 'app-c-requerimiento-cab',
  templateUrl: './c-requerimiento-cab.component.html',
  styleUrls: ['./c-requerimiento-cab.component.scss']
})
export class CRequerimientoComponent implements OnInit, OnDestroy{

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
    lstExportExcel: any[] = [];
    lstPostores: any[] = [];
    errorMensaje!: string;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private ordencompraService: OrdencompraService,
        
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'idordencompra' },
          { field: 'servicionombre', header: 'servicionombre' },
          { field: 'nomusuario', header: 'nomusuario' },
          { field: 'fecentrega', header: 'fecentrega' },
          { field: 'descentrocosto', header: 'descentrocosto' },
          { field: 'codigoproyecto', header: 'codigoproyecto' },
          //{ field: 'observacion', header: 'observacion' },
          { field: 'simbmoneda', header: 'simbmoneda' },
          { field: 'nomestado', header: 'nomestado' }
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
      })
    }

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      //console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idtipodocprc: 2
      }

      const $getListar = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListar', rpta);
              this.lstCotizacion = rpta.ordenescompra
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
        this.tituloDetalle = "SOLICITUD DE PEDIDO/REQUERIMIENTO N° " +dato.idordencompra;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'V'
        }
        this.vistaLista = false;
    }


    verCotiza(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "SOLICITUD DE PEDIDO/REQUERIMIENTO N° " + data.idordencompra;
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
      this.tituloDetalle = "NUEVA SOLICITUD DE PEDIDO/REQUERIMIENTO";
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
      this.lstPostores = this.ordenCompra.postores;
      console.log('ordenCompra...', this.ordenCompra);
      console.log('this.lstPostores...', this.lstPostores);
      // if (item.idtrx === 140) {
      //       if (this.lstPostores.length < 3) {
      //         this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Deben existir como mínimo 3 Cotizaciones...!' });
      //         return;
      //       }
      //       const postor = this.lstPostores.filter(x=>x.indseleccion === true)
      //       if (postor.length === 0) {
      //         this.messageService.add({ severity: 'info', summary: 'Advrtencia...', detail: 'Debe Seleccionar una Cotización...!' });
      //         return;
      //       }

            
      // }
      
        console.log('onAccion', item);
      const ref = this.dialogService.open(CModalExcTransacComponent, {
          data: this.ordenCompra,
          header: item.nomtrx +' - '+  this.ordenCompra.labelnrodocumento,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
      });
  
      ref.onClose.subscribe(() => {
          this.getListar();
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
            'ID REQUERIMIENTO': this.lstExportExcel[i].idordencompra,
            'N° REQUERIMIENTO': this.lstExportExcel[i].codigonroorden,
            'DESCRIPCIÓN': this.lstExportExcel[i].nomcomercial,
            'MONEDA': this.lstExportExcel[i].nommoneda,
            'SUBTOTAL': this.lstExportExcel[i].s_monto,
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
        this.saveAsExcelFile(excelBuffer, 'Cotización');
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

      onEditar(dato: any) {
          this.tituloDetalle = "EDITAR SOLICITUD DE PEDIDO/REQUERIMIENTO N° " + dato.idordencompra;
          this.dataOC = {
            idordencompra: dato.idordencompra,
            paramReg:''
          }
          this.vistaLista = false;
      }

      onVerDetalle(data: any) {
          console.log('onVerDetalle...', data);
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
              codtipoprc: 2,
              idplantilla: 0
            }
        
            const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
              next: (rpta: any) => {
                this.setSpinner(false);      
                
                const mediaType = 'application/pdf';
                  const blob = new Blob([rpta.body], { type: mediaType });
                  const filename = 'COTI_' + data.nrofactura;
          
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
      
}