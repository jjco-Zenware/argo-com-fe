import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { dOperacion } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-registro-compra',
  templateUrl: './c-registro-compra.component.html',
  styleUrls: ['./c-registro-compra.component.scss']
})
export class CRegistroCompraComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];


  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;

  lstCompras: any[] =[];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  cols: any[] = [];
  dataPrc:any;
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
        { field: 'idordencompra', header: 'REG COMPRA' },
        { field: 'nomtipoorden', header: 'PROVEEDOR' },
        { field: 'codigonroorden', header: 'N° FACTURA' },
        { field: 'nomcomercial', header: 'COD PROYECTO' },
        { field: 'nommoneda', header: 'PROYECTO' },
        { field: 'codigoproyecto', header: 'MONEDA' },
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
      idtipodocprc: 7
    }

    const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta.ordenescompra);
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

  onVer(data: dOperacion) {
      console.log('onVer...', data);
      this.tituloDetalle = "Ver Orden de Compra/Servicio N° " + data.idordencompra;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
  }

  onEditar(data: dOperacion) {
      console.log('onVer...', data);
      this.tituloDetalle = "Editar Compra/Servicio N° " + data.idordencompra;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
  }
  verCotiza(data: dOperacion) {
      console.log('onVer...', data);
      this.tituloDetalle = "Cotización de Compra/Servicio N° " + data.idordencompra;
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
      this.tituloDetalle = "REGISTRAR COMPRA";
      this.dataPrc = {
        idordencompra: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
    }
}
