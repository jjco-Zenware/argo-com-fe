import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { dOperacion, Moneda } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CModalTransacComponent } from 'src/app/pages/compras/modal-trans-registro/modal-transac.component';
import { CMotivoComponent } from '../../modalanular/c-modalanular.component';

@Component({
  selector: 'app-c-notacredito-lista',
  templateUrl: './c-notacredito-lista.component.html',
  styleUrls: ['./c-notacredito-lista.component.scss']
})
export class CNotaCreditoComponent implements OnInit, OnDestroy{

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
  lstProveedores: any[] = [];
  menuItems: MenuItem[] = [];
  @ViewChild('menu') menu!: Menu;
  ordenCompra: any;
  lstMonedas: Moneda[] = [];
  lstAccionesSunat: any = [
    {
      operacion : 'consultar_comprobante',
      tipo_de_comprobante :'',
      serie :'',
      numero: '',
      label:'Consultar'
    },
    {
      operacion : 'generar_anulacion',
      tipo_de_comprobante :'',
      serie :'',
      numero: '',
      label:'Generar Anulación'
    },    
    {
      operacion : 'consultar_anulacion',
      tipo_de_comprobante :'',
      serie :'',
      numero: '',
      label:'Consultar Anulación'
    }]
    menuItemsSunat: MenuItem[] = [];
  @ViewChild('menuSunat') menuSunat!: Menu;

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    public dialogService: DialogService  ,
    private proyectosService: ProyectosService,     
    private serviceSharedApp: SharedAppService,
    private ordencompraService: OrdencompraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    ){

  }

  ngOnInit(): void{
      this.createFrm();
      this.listaClientes();
      this.getListar();
      this.listaMonedas();
      this.cols = [
        { field: 'fecemision', header: 'ID' },
        { field: 'nrofactura', header: 'DOCUMENTO' },
        { field: 'nomcomercial', header: 'PROVEEDOR' },
        { field: 'simbmoneda', header: 'MONEDA' },
        { field: 's_monto', header: 'SUBTOTAL' },
        { field: 's_igv', header: 'IGV' },
        { field: 's_monto_total', header: 'TOTAL' },
        { field: 'nomestado', header: 'ESTADO' },
        { field: 'porc_detraccion', header: 'ESTADO' },
        { field: 's_monto_detraccion_mn_CTB', header: 'ESTADO' }
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
        idproveedor: [{value: 0,disabled: false}],
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}]
    }) 
  }

  getListar(){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    
    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 19
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

  listaClientes() {

    const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
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
      this.tituloDetalle = "Ver Nota de Crédito N° " + data.nrofactura;
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
          codtipoprc: 19,
          idplantilla: 0
        }
    
        const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
          next: (rpta: any) => {
            this.setSpinner(false);      
            
            const mediaType = 'application/pdf';
              const blob = new Blob([rpta.body], { type: mediaType });
              const filename = 'DET_FACT_VENTA_'+ data.nrofactura;
      
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
      this.tituloDetalle = "Editar Nota de Crédito N° " + data.nrofactura;
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
      this.tituloDetalle = "REGISTRAR NOTA DE CRÉDITO";
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

    emitirDocumento(data:any){

      this.confirmationService.confirm({
                 key: 'confirm1',
                 header: 'Confirmación',
                 message: '¿Estás seguro de Enviar a SUNAT?...',
                 accept: () => {
                   this.setSpinner(true);
                   this.mensajeSpinner = "Enviando...!"
           
                   const objeto = {
                     codproceso: 0,
                     idusuario: constantesLocalStorage.idusuario,
                     idordendocumento: data.idordencompra,
                   }
                 
                 const $procesarTrx = this.proyectosService.emitirDocumento(objeto).subscribe({
                     next: (rpta: any) => {
                         console.log('emitirDocumento', rpta);
                         this.setSpinner(false);
                         if (rpta.aceptada_por_sunat) {
                           this.messageService.add({severity: 'info', summary: 'Aviso', detail: rpta.sunat_description });
                           this.getListar();
                           return;
                         }else{
                           this.messageService.add({severity: 'error', summary: 'Error', detail: rpta.errors });
                           this.getListar();
                           return;
                         }
                        
                     },
                     error: (err) => {
                       this.setSpinner(false);
                         console.error('error : ', err);
                         this.serviceSharedApp.messageToast();
                     },
                     complete: () => {
                       this.setSpinner(false);
                     },
                 });
                 this.$listSubcription.push($procesarTrx)
                 }
             });

    
   }


    getSeverity(data:any) {
      console.log()
      let color;
      switch (data) {
        case 0:
          color = 'primary'
        break;      
        case 1:
          color = 'success'
          break;
        case 2:
          color = 'danger'
        break;
        case 3:
          color = 'warning'
        break;
      }
      return color;
    }

    toggleMenuSunat(event: Event, data: any) {
      if (data.acciones) {
          this.cargarMenuSunat(this.lstAccionesSunat);
          this.ordenCompra = data;
          this.menuSunat.toggle(event);
      }
  }

    cargarMenuSunat(data: any) {
      this.menuItemsSunat = [];
      data.forEach((item: any) => {
          this.menuItemsSunat.push({
              label: item.label,
              icon: 'pi pi-cog',
              command: () => this.onAccionSunat(item)
          })
      });
    }
  
    onAccionSunat(item: any) {
      console.log('onAccionSunat', item);
      console.log('this.ordenCompra', this.ordenCompra);
     
     let tipo_de_comprobante = parseInt(this.ordenCompra.tipodoc_ctb);
     let serie = this.ordenCompra.nroserie_ctb;
     let numero = parseInt(this.ordenCompra.nrodocumento_ctb);

     this.setSpinner(true);
  this.mensajeSpinner = "Consultando...!"
  
  const objeto = {
    operacion: item.operacion,
    tipo_de_comprobante: tipo_de_comprobante,
    serie : serie,
    numero : numero,
    idusuario: constantesLocalStorage.idusuario,
    idordendocumento: this.ordenCompra.idordencompra
  }
  console.log('objeto', objeto);

  if (item.operacion === "generar_anulacion") {
    const ref = this.dialogService.open(CMotivoComponent, {
      data: this.ordenCompra,
      header: "Motivo de Anulación",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '30%'
    });

    ref.onClose.subscribe((rpta: any) => {
      this.setSpinner(false);
        console.log('onClose',rpta);
        const objeto2 = {
          operacion: item.operacion,
          tipo_de_comprobante: tipo_de_comprobante,
          serie : serie,
          numero : numero,
          idusuario: constantesLocalStorage.idusuario,
          idordendocumento: this.ordenCompra.idordencompra,
          motivo: rpta.data.descripcion
        }
        if (rpta != undefined) {
          const $operacionFel = this.proyectosService.operacionFel(objeto2)
          .subscribe({
            next: (rpta:any) => {
              console.log('operacionFel', rpta);
              this.getListar();
                this.setSpinner(false);
            },
            error:(err)=>{
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($operacionFel)
        }
      });
    return;
 }

  const $operacionFel = this.proyectosService.operacionFel(objeto)
    .subscribe({
      next: (rpta:any) => {
        console.log('operacionFel', rpta);
        this.getListar();
          this.setSpinner(false);
          let mensaje = "El Documento Electrónico " + rpta.serie + "-" + rpta.numero + " ya ha sido ACEPTADA, verifique en el enlace de descarga.";
                if (item.operacion === "consultar_comprobante" && rpta.estado === 1) {
                  this.messageService.add({severity: 'info', summary: 'Info', detail: mensaje });
                }
      },
      error:(err)=>{
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
      },
      complete:() => {
        this.setSpinner(false);
      }
    });
  this.$listSubcription.push($operacionFel)
    }

    verDocumento(data: any){
      window.open(data.enlaceFEL);
    }
}
