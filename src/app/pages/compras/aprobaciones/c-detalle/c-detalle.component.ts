
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ComprasService } from '../../Service/compraServices';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { CModalExcTransacComponent } from '../../orden-compra-servicio/modal-exc-transac/modal-exc-transac.component';

@Component({
  selector: 'app-c-detalle',
  templateUrl: './c-detalle.component.html',
  styleUrls: ['./c-detalle.component.scss']
})
export class CDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  visibleDocument: boolean = true;
  dataAdjunto: any;
  idtipoproyecto: any;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  submitted = false;
  headerTitle: string = '';
  lstMonedas: Moneda[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  montoTotal: number = 0;
  lstContacto: any;
  lstOrigen: any;
  idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnPreliminar: boolean = false;
  verbtnOrden: boolean = false;
  verbtnAcciones: boolean = false;
  ordenCompra: any;
  dataCT:any = {id:0, razonsocial:'', description:'', nommoneda:'', startDate:'', nomcreador:'', tipocambio:'', idlista:'', quotes:[]};
  verCotizacion: boolean = true;
  lstTipo = [
    { name: 'COMPRA', code: 'OC' },
    { name: 'SERVICIO', code: 'OS' }
  ];
  lstTermino: any;
  lstQuotes: any[]=[];
  verAdjunto: boolean = false;
  contactoVisible: boolean = false;
  itemVisible: boolean = false;
  ExcelData: any;
  idtipoprod: any;
  idmarca: any;
  lstMarcas:any;
  lstTipoProducto:any;
  verImportar: boolean = true;
  //onlyRead: boolean = false;
  verReferencia: boolean = false;
  lstUnidades:any;
  registerFormRegistro: any= FormGroup;
  s_monto:number = 0;
  s_igv:number = 0;
  s_monto_total:number = 0;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    public dialogService: DialogService,
    private ordencompraService: OrdencompraService,
    private comprasService: ComprasService,
  ) { }

  ngOnInit(): void {
    this.idOrdenC = this.IA_data.idordencompra;
    this.dataAdjunto ={
        idCliente: this.idOrdenC,
        codtipoproc: 7,
        veracciones: 1
      }    
      this.verAdjunto = true; 
    this.createFormRegistro() ;
    this.listaProyectoTipo();
    this.listaProveedores();
    this.listaMonedas();  
    this.listarItemsTabla(); 

    this.traerUnoOrdenC();

   
      
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: true }],
      idtipoproyecto: [{ value: 0, disabled: true }],
      //idcliente: [{ value: '', disabled: false }],
      idoportunidad: [{ value: 0, disabled: true }],
      sustentodoc: [{ value: '', disabled: true }],
      idrequerimiento: [{ value: 0, disabled: true }],
      observacion: [{ value: '', disabled: true }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: true }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: true }],
      nrodocumentoadd:[{ value: '', disabled: true }],
      fechaingreso: [{
        value: '',
        disabled: true,
      }],
      idordencompra: [{ value: this.idOrdenC, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: true }],
      idproveedor: [{ value: 0, disabled: true }],
      idmoneda: [{ value: 0, disabled: true }],
      //idorigen: [{ value: this.IA_data, disabled: false }],
      idcontacto: [{ value: 0, disabled: true }],
      codtipodoc: [{ value: 'OPO', disabled: true }],
      tiempoentrega: [{ value: 0, disabled: true }],
      codformapago: [{ value: 0, disabled: true }],
      validezoferta: [{ value: 0, disabled: true }],
      lugarentrega: [{ value: '', disabled: true }],
      garantia: [{ value: 0, disabled: true }],
      servicionombre: [{ value: '', disabled: true }],
      ref01: [{ value: '', disabled: true }],
      ref02: [{ value: '', disabled: true }],
      ref03: [{ value: '', disabled: true }],
      codtipoorden:[{ value: 'OC', disabled: true }],
      codigonroorden:[{ value: '', disabled: true }],
      nomproyecto:[{ value: '', disabled: true }],
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

  mostrarBotones(data:any){
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'REG':
      case 'OBS':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        //this.onlyRead = true;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= false;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        //this.onlyRead = true;
      break;
      case 'PRC':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        //this.onlyRead = true;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = true;
        //this.onlyRead = true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = false;
        //this.onlyRead = true;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        //this.onlyRead = true;
      break;
      case 'REC':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        //this.onlyRead = true;
      break;
    
      default:
        break;
    }

    // if (this.IA_data.paramReg === 'V') {
    //   console.log('entro', this.IA_data.paramReg);
    //   this.verbtnGrabar = false;
    //   //this.verbtnPreliminar= this.idOrdenC === 0 ? true : false;
    //   //this.verbtnOrden = this.idOrdenC === 0 ? false : true;
    //   this.verbtnAcciones = true;
    //   //this.onlyRead = true;
    // }
    
  }

  traerUnoOrdenC(){
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
            //this.ordenCompra.codformapago = (rpta.ordencompra[0].codformapago).toString();
            this.getContactos(rpta.ordencompra[0].idproveedor);      
            if (rpta.ordencompra[0].items !== undefined) {
              this.lstItemOC = rpta.ordencompra[0].items;
              //this.calcularTotales();
            }  
            if (rpta.ordencompra[0].quotes !== undefined) {
              this.lstQuotes =  rpta.ordencompra[0].quotes; 
            }    
           
            this.getOrigen(rpta.ordencompra[0].codtipodoc);               
            this.visibleDocument = false;
            this.s_monto = rpta.ordencompra[0].s_monto;
          this.s_igv = rpta.ordencompra[0].s_igv;
          this.s_monto_total = rpta.ordencompra[0].s_monto_total;
            

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.cargarMenu(rpta.ordencompra[0].acciones);
          this.mostrarBotones(rpta.ordencompra[0].estado);
          const nomproyecto = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == this.registerFormRegistro.get('idproyecto').value)[0].nomproyecto;
          this.registerFormRegistro.get('nomproyecto').setValue(nomproyecto);  
          
          
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

  getOrigen(data:any){
    switch (data) {
      case 'OPO':
        this.cargarProyectos(1);
        this.verReferencia = false;
        break;
      case 'REQ':
        this.cargarProyectos(2);
        this.verReferencia = true;
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

  getContactos(dato: any) {  
    const $personaProveedorlist = this.comprasService.ListaContactos(dato).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.lstContacto = rpta;
        },
        error: (err) => {
            this.setSpinner(false);
            console.info('error : ', err);
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: mensajesQuestion.msgErrorGenerico,
            });
        },
        complete: () => {},
    });
    this.$listSubcription.push($personaProveedorlist);
  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
        console.log('lstProyectos', rpta);
      this.lstProyectos = rpta;

      if (this.idOrdenC > 0) {
        this.changeProyecto(this.registerFormRegistro.get('idproyecto').value);
      }

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

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
      this.lstOrigen = rpta;
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

  changeProyecto(idproyecto : any){
    if (this.registerFormRegistro.get('codtipodoc').value === 'OPO') {  
      const idoportunidad = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].idoportunidad;
      const nomproyecto = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].nomproyecto;
      this.registerFormRegistro.get('nomproyecto').setValue(nomproyecto);
      this.oportunidadTraerUno(idoportunidad);     
    }    else{
      const nomproyecto = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].nomproyecto;
      this.registerFormRegistro.get('nomproyecto').setValue(nomproyecto);
      this.verCotizacion = true;
    }
  }

  oportunidadTraerUno(idoportunidad: any){
    //this.setSpinner(true);
    this.mensajeSpinner = 'Cargando Cotizaciones...!';
    this.proyectosService.oportunidadTraeruno(idoportunidad).subscribe({
      next: (rpta: any) => {
        let quotes = this.lstQuotes;
          const {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista} = rpta;
              this.dataCT = {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista, quotes};
      },
          error: (err) => {
            //this.setSpinner(false);
          this.messageService.clear();
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: mensajesQuestion.msgErrorGenerico,
          });
      },
          complete: () => {
            this.verCotizacion = false;
            //this.setSpinner(false);
      },
    });
  }


  calcularTotales() {
    let totalpreventot = 0;    
    for (let lstCotiza of this.lstItemOC) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }    
    this.montoTotal = totalpreventot;
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
    const ref = this.dialogService.open(CModalExcTransacComponent, {
        data: this.ordenCompra,
        header: item.nomtrx +' - '+  this.ordenCompra.labelnrodocumento,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '40%'
    });
    ref.onClose.subscribe(() => {
        this.traerUnoOrdenC();
      });
  } 
  
  vistaPreliminar(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Vista Preliminar...!';

    const objeto = {
      idusuario : constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: 8
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumento(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = this.idOrdenC + '-OC';
  
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

  getQuotes(dato: any){
    let objeto = {
      idcotiza: dato.idcotiza,
      indseleccion: dato.indseleccion
    }
    if (dato.indseleccion) {
      this.lstQuotes.push(objeto);
    }else{
      const _posAll: number = this.lstQuotes.findIndex(((x: { idcotiza: any; }) => x.idcotiza == dato.idcotiza))
          if (_posAll != -1) {
          this.lstQuotes.splice(_posAll, 1)
        }
    }    
  }

}