import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { CMotivoComponent } from 'src/app/pages/facturacion/modalanular/c-modalanular.component';

@Component({
  selector: 'app-c-salida-por-traslado',
  templateUrl: './c-salida-por-traslado.component.html',
  styleUrls: ['./c-salida-por-traslado.component.scss']
})
export class CSalidaTrasladoComponent implements OnInit, OnDestroy{

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
    menuItemsSunat: MenuItem[] = [];
    @ViewChild('menuSunat') menuSunat!: Menu;
    lstAccionesSunat: any = [        
      {
        operacion : 'consultar_guia',
        tipo_de_comprobante :'',
        serie :'',
        numero: '',
        label:'Consultar Guia'
      } 
  ]

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,        
        private comprasService: ComprasService, 
        private messageService: MessageService,   
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'ID ALMACÉN' },
          { field: 'codigonroorden', header: 'codigonroorden ' },
          { field: 'fechaingreso', header: 'fechaingreso ' },
          { field: 'nomalmacen', header: 'nomalmacen ' },
          { field: 'nom_alm_idalmacen_destino', header: 'nom_alm_idalmacen_destino ' },
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
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}],
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
        idtipodocprc: 12
      }

      const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta);
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
     
        this.tituloDetalle =  'N° SALIDA - '+ dato.idordencompra;
        this.dataDet = {
          idcodigo: dato.idordencompra,
          paramReg:'V',
          idtipodocprc: 12
        } 
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      
        this.tituloDetalle = 'N° SALIDA - '+ dato.idordencompra;
        this.dataDet = {
          idcodigo: dato.idordencompra,
          paramReg:'E',
          idtipodocprc: 12
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
      this.tituloDetalle = "REGISTRAR SALIDA POR TRANSFERENCIA";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N',
        idtipodocprc: 12
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
        this.saveAsExcelFile(excelBuffer, 'Salida por Traslado');
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
        this.ordenCompra.idtrx = item.idtrx;
        console.log('onAccion', item);
        const ref = this.dialogService.open(CModalExcAlmacenComponent, {
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

       onVerDetalle(data: any) {
                console.log('onVerDetalle...', data);
                    
                    this.setSpinner(true);
                  this.mensajeSpinner = 'Descargando Detalle...!';
              
                  const objeto = {
                    idusuario : constantesLocalStorage.idusuario,
                    iddocumentoprc: data.idordencompra,
                    codtipoprc: 12,
                    idplantilla: 0
                  }
              
                  const $cargarOrdenC = this.comprasService.prcDocumentoDet(objeto).subscribe({
                    next: (rpta: any) => {
                      this.setSpinner(false);      
                      
                      const mediaType = 'application/pdf';
                        const blob = new Blob([rpta.body], { type: mediaType });
                        const filename = 'PECOSA-' + data.codigonroorden;
                
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

     


            verDocumento(data: any){
              window.open(data.enlaceFEL);
            }
}
