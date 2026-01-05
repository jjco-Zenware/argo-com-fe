
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-c-registro-facturacion',
  templateUrl: './c-registro-facturacion.component.html',
  styleUrls: ['./c-registro-facturacion.component.scss']
})
export class CRegistroFacturacionComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];


  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;

  lstVentas: any[] =[];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  dataPrc:any;
  cols: any[] = [];


  blockedDocument: boolean = false;
    mensajeSpinner: string = "";

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    public dialogService: DialogService  ,
    private proyectosService: ProyectosService,     
    private serviceSharedApp: SharedAppService
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
          fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],       
          fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],     
          idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
      })
    }

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      
      const objeto = {
        ...this.frmDatos.value,
        idtipodocprc: 6
      }

      const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListar', rpta.ordenescompra);
              this.lstVentas = rpta.ordenescompra
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
      this.tituloDetalle = "Ver Orden de Factura N° " + data.idfacturacion;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
  }

  onEditar(data: any) {
      console.log('onVer...', data);
      this.tituloDetalle = "Editar Factura N° " + data.idfacturacion;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
  }

  verCotiza(data: any) {
      console.log('onVer...', data);
      this.tituloDetalle = "Cotización de Factura N° " + data.idfacturacion;
      this.vistaLista = false;
      this.visDetalle = false;
      this.visQuote = true;
  }

  getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.visQuote = false;
  }

  getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.visQuote = false;
    }

    onNuevo() {        
      this.tituloDetalle = "REGISTRAR FACTURA";
      this.dataPrc = {
        idordencompra: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
    }     
}
