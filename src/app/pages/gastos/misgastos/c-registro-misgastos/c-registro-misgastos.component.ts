import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Moneda } from '@interfaces';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CModalTransacComponent } from '../../modal-trans-gasto/modal-transac.component';

@Component({
  selector: 'app-c-registro-misgastos',
  templateUrl: './c-registro-misgastos.component.html',
  styleUrls: ['./c-registro-misgastos.component.scss']
})
export class CRegistroMisGastosComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];


  vistaLista: boolean = true;
  visDetalle: boolean = false;
  visQuote: boolean = false;

  lstCompras: any[] =[];
  tituloDetalle!: string;
  frmDatos!: FormGroup;
  dataPrc:any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstProveedores: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  ordenCompra: any;
    lstMonedas: Moneda[] = [];

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
      this.listaProveedores();
      this.getListar();
      this.listaMonedas();
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
  

  listaProveedores() {

    const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
        const objet = {
          idcliente: 0,
          nomcomercial: 'TODOS'
        }
        this.lstProveedores.unshift(objet);
        console.log('this.lstProveedores', this.lstProveedores);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);

  }

  onVer(data: any) {
      console.log('onVer...', data);
      this.dataPrc = {
        idordencompra: data.idordencompra,
        paramReg:'V'
      }
      this.tituloDetalle = "Ver Factura N° " + data.nrofactura;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
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
        codtipoprc: 7,
        idplantilla: 0
      }
  
      const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);      
          
          const mediaType = 'application/pdf';
            const blob = new Blob([rpta.body], { type: mediaType });
            const filename = 'DET_FACT_COMPRA_' + data.nrofactura;
    
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

  onEditar(data: any) {
      console.log('onEditar...', data);
      this.dataPrc = {
        idordencompra: data.idordencompra,
        paramReg:'E'
      }
      this.tituloDetalle = "Editar Factura N° " + data.nrofactura;
      this.vistaLista = false;
      this.visDetalle = true;
      this.visQuote = false;
  }

  getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.visQuote = false;
  }

  getBack() {
      this.vistaLista = true;
      this.getListar();
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
      console.log('this.ordenCompra', this.ordenCompra);
      const ref = this.dialogService.open(CModalTransacComponent, {
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

    listaMonedas() {
      const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
        next: (rpta: any) => {
          console.log('listaMonedas', rpta);
          this.lstMonedas = rpta;       
          const objet = {
            idmoneda: 0,
            desmoneda: 'TODOS'
          }
          this.lstMonedas.unshift(objet);
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
      });
      this.$listSubcription.push($listaMonedas);
  
    }
    
}
