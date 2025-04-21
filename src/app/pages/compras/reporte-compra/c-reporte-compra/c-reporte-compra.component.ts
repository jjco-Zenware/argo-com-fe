import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ModalCompraComponent } from '../c-modal-compra/c-modal-compra.component';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-reporte-compra',
  templateUrl: './c-reporte-compra.component.html',
  styleUrls: ['./c-reporte-compra.component.scss']
})
export class CReporteCompraComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];

  lstCompras: any[] =[];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  cols: any[] = [];
  dataPrc:any;
  blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    lstProveedores: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];

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
      this.getListar();
      
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
        periodo: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}], 
        idcliente: [{value: 0,disabled: false}],
    }) 
  }

  getListar(){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    
    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 7
    }

    const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta);
            this.lstCompras = rpta.ordenescompra
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

  onVer(data: any) {
      console.log('onVer...', data);
      this.dataPrc = {
        idordencompra: data.idordencompra,
        paramReg:'V'
      }
      this.tituloDetalle = "Factura N° " + data.nrofactura;

      const objeto = {
        idordencompra: data.idordencompra,
              }
              const ref = this.dialogService.open(ModalCompraComponent, {
                  data: objeto,
                  header: "Factura N° " + data.nrofactura,
                  styleClass: 'testDialog',
                  closeOnEscape: false,
                  closable: true,
                  width: '40%'
              });
              ref.onClose.subscribe(() => {
                  //this.getListar();
                });
  }      

  descargarReporte(){
      this.setSpinner(true);
      this.mensajeSpinner = 'Descargando...!';
  
      const objeto = {
        idusuario : constantesLocalStorage.idusuario,
        idtipodocprc: 7,
        fecini: this.frmDatos.value.fecini,
        fecfin: this.frmDatos.value.fecfin
      }
  
      const $cargarOrdenC = this.ordencompraService.prcReporte(objeto).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);      
  
          console.log('descargarReporte', rpta);
          
          const mediaType = 'application/pdf';
            const blob = new Blob([rpta.body], { type: mediaType });
            const filename = 'REG-COMPRA';
    
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

  changePeriodo(dato: any){
    console.log('changePeriodo', dato);
    console.log('Minimo', this.utilitariosService.obtenerFechaInicioMesPeriodo(dato));
    console.log('Maximo', this.utilitariosService.obtenerFechaFinMesPeriodo(dato));
    
    this.frmDatos.get('fecini')?.setValue(this.utilitariosService.obtenerFechaInicioMesPeriodo(dato));
    this.frmDatos.get('fecfin')?.setValue(this.utilitariosService.obtenerFechaFinMesPeriodo(dato));
    this.getListar();
    
  }
}
