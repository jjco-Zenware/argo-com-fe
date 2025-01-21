
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ComprasService } from '../../Service/compraServices';
import * as  XLSX  from 'xlsx';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { CItemOrdenesComponent } from 'src/app/pages/almacen/items-ordenes/c-items-ordenes.component';

@Component({
  selector: 'app-c-modal-venta',
  templateUrl: './c-modal-venta.component.html',
  styleUrls: ['./c-modal-venta.component.scss']
})
export class ModalVentaComponent implements OnInit, OnDestroy{
  
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  registerFormRegistro: any= FormGroup;
  idtipoproyecto: any;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  registerFormCliente: any = FormGroup;
  lstMonedas: Moneda[] = [];
  lstOrigen: any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  ordenCompra: any;
  lstTermino: any;
  idtipoprod: any;
  idmarca: any;
  lstMarcas:any;
  lstTipoProducto:any;
  onlyRead: boolean = true;
  verProyecto: boolean = true;
  lstUnidades:any;
  errorMensaje: string = "";
  lstComprobante:any;
  montoTotal: number = 0;
  idOrdenC: number = 0;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private ordencompraService: OrdencompraService,
    private comprasService: ComprasService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.idOrdenC = this.config.data.idordencompra;
    console.log('this.idOrdenC...', this.idOrdenC);
    this.createFormRegistro();
    this.listaProyectoTipo();
    this.listaClientes();
    this.listaProveedores();
    this.listaMonedas();  
    this.listarItemsTabla(); 
    this.listarItemsTablaUnidad() ;
    this.listarItemsTablaComprobante() ;    
   
    this.traerUno();
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 7, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      idordencompra: [{ value: 0, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: '', disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      //idorigen: [{ value: this.IA_data, disabled: false }],
      idcontacto: [{ value: 0, disabled: false }],
      codtipodoc: [{ value: 'REQ', disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: 118, disabled: false }],
      validezoferta: [{ value: 0, disabled: false }],
      lugarentrega: [{ value: '', disabled: false }],
      garantia: [{ value: 0, disabled: false }],
      servicionombre: [{ value: '', disabled: false }],
      ref01: [{ value: '', disabled: false }],
      ref02: [{ value: '', disabled: false }],
      ref03: [{ value: '', disabled: false }],
      codtipoorden:[{ value: 'OC', disabled: false }],
      codigonroorden:[{ value: '', disabled: true }],
      nomproyecto:[{ value: '', disabled: false }],
      nrodocumento:[{ value: '', disabled: false }],
      fecemision: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      tc:[{ value: '', disabled: false }],
      tipodoc_ctb:[{ value: '', disabled: false }],
      nroserie_ctb:[{ value: '', disabled: false }],
      nrodocumento_ctb:[{ value: '', disabled: false }],
      fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      nrocuotas:[{ value: 1, disabled: false }],
      porc_detraccion:[{ value: null, disabled: false }],
      s_monto_detraccion_mn_CTB:[{ value: 0, disabled: false }],
      s_monto_valor_venta_CTB:[{ value: 0, disabled: false }],
      s_monto_igv_CTB:[{ value: 0, disabled: false }],
      s_monto_total_CTB:[{ value: 0, disabled: false }],
      montoTotal:[{ value: 0, disabled: false }],
      nrocontrato_ctb:[{ value: null, disabled: false }],
      nroexpediente_ctb:[{ value: null, disabled: false }],
      codunidadejecutora_ctb:[{ value: null, disabled: false }],
      nroprocesoseleccion_ctb:[{ value: null, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      nrodias:[{ value: 0, disabled: false }],
      idordencompra_origen_ctb:[{ value: 0, disabled: false }],
      monto_pen_pago:[{ value: 0, disabled: false }],
    });

    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

   traerUno(){
      this.setSpinner(true);
      this.mensajeSpinner = 'Cargando...!';
      const objeto ={
        idordencompra: this.idOrdenC,
        idusuario: constantesLocalStorage.idusuario
      }
  
      const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
        .subscribe({
          next: (rpta:any) => {
            console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
              this.setSpinner(false);
              this.ordenCompra = rpta.ordencompra[0]; 
  
            this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
            this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
            //this._alm_idordencompra = rpta.ordencompra[0].alm_idordencompra;
            this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
            this.montoTotal = rpta.ordencompra[0].s_monto_total;
            this.setearDias(rpta.ordencompra[0].fecvencimiento, rpta.ordencompra[0].fecemision);      
            this.registerFormRegistro.get('monto_pen_pago')?.setValue(rpta.ordencompra[0].s_monto_total_CTB - rpta.ordencompra[0].s_monto_detraccion_mn_CTB);
            this.registerFormRegistro.get('fecvencimiento')?.setValue(rpta.ordencompra[0].fecvencimiento);
            this.registerFormRegistro.get('fecemision')?.setValue(rpta.ordencompra[0].fecemision );   
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
            
          }
        });
      this.$listSubcription.push($cargarOrdenC)
    }

  servicioGenerico(){
    //this.registerFormRegistro.get('condicionescomerciales').setValue(''); 
    
    this.comprasService.obtenerItemsTabla(109).subscribe({
      next: (rpta: any) => {

        let _condicionescomerciales = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
        this.registerFormRegistro.get('condicionescomerciales').setValue(_condicionescomerciales[0].valoritem);
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });
  }

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(104).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstTermino = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

    listarItemsTablaUnidad() {
      this.comprasService.obtenerItemsTabla(107).subscribe({
          next: (rpta: any) => {
            console.info('listarItemsTabla : ', rpta);
              this.lstUnidades = rpta;
          },
          error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
      });    
    }

  listaProveedores() {

    const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
        console.log('this.lstProveedores', this.lstProveedores);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);

  }

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }

  listaClientes() {
    let tiporol ="CLI";
    this.proyectosService.obtenerClientes(tiporol).subscribe({
        next: (rpta: any) => {
        this.lstCliente = rpta;
        },
        error: (err) => {
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
  }

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
      this.lstOrigen = rpta;
      const objeto = {
        idtipoproyecto: 4,
        nomtipoproyecto: 'Otros',
        codproceso:'OTR'
      }
      this.lstOrigen.unshift(objeto);
      },
      error: (err) => {
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
  }
   
  getOrigen(data:any){
    console.log('getOrigen...', data);
    switch (data) {
      case 'OPO':
        this.cargarProyectos(1);
        //this.verReferencia = false;
        this.verProyecto = true;
        break;
      case 'REQ':
        this.cargarProyectos(4);
        //this.verReferencia = true;
        this.verProyecto = true;
        break;        
      case 'OTR':
        this.cargarProyectos(4);
        //this.verReferencia = false;
        this.verProyecto = true;
        break;
      // case 'VED':
      //   this.cargarProyectos(3);
      //   break;
      // case 'NOA':
      //   this.registerFormRegistro.get('idproyecto').setValue(0);
      //   break;
    }    
    //this.registerFormRegistro.get('sustentodoc').setValue('');  
    
    //this.verControles(data);

  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
      this.lstProyectos = rpta;

          },

      error: (err) => {
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
  }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        console.log('listarTipoProducto', rpta);
        const lstTipoProductoTot = rpta;
        this.lstTipoProducto = lstTipoProductoTot.filter((x: { idtipoprod: number; }) => x.idtipoprod !== 0 && x.idtipoprod !== 8);
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarTipoProducto);

  }

  listarMarcas() {
    const $listarMarcas = this.proyectosService.obtenerMarcas().subscribe({
      next: (rpta: any) => {
        this.lstMarcas = rpta;
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarMarcas);

  }

  listarItemsTablaComprobante() {
    this.comprasService.obtenerItemsTabla(112).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTablaComprobante : ', rpta);
            this.lstComprobante = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });    
  }

  setearDias(ven:any, emi:any){
    let  vencimiento = new Date(this.serviceUtilitario.formatFecha(ven));
    let  emision = new Date(this.serviceUtilitario.formatFecha(emi));
    let diff= 0;
    if (emision.getTime() > vencimiento.getTime()) {
      diff = emision.getTime() - vencimiento.getTime()
    }else{
      diff = vencimiento.getTime() - emision.getTime()
    }
    this.registerFormRegistro.get('nrodias')?.setValue( diff/(1000*60*60*24) );
  }
}
