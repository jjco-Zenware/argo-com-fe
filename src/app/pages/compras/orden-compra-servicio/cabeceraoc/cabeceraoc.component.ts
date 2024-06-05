import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, KanbanCard, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CItemCotizacionComponent } from '../../proyectos-ganados/c-item-cotizacion/c-item-cotizacion.component';
import { OrdencompraService } from '../service/ordencompra.service';

@Component({
  selector: 'app-c-cabeceraoc',
  templateUrl: './cabeceraoc.component.html',
  styleUrls: ['./cabeceraoc.component.scss']
})
export class CabeceraocComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any= FormGroup;
  verOpor: boolean = false;
  verInter: boolean = false;
  verVent: boolean = false;
  verOtro: boolean = false;
  idtipoproyecto: any;
  lstOportunidad: KanbanCard[]=[];
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  submitted = false;
  headerTitle: string = '';
  //proveedorVisible: boolean = false;
  registerFormCliente: any = FormGroup;
  lstMonedas: Moneda[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  montoTotal: number = 0;
  lstContacto: any;
  lstOrigen = [
    { name: 'Oportunidad', code: 1 },
    { name: 'Interno', code: 2 },
    { name: 'Venta Pura', code: 3 },
    { name: 'Otro', code: 4 }
  ];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private ordencompraService: OrdencompraService
  ) { }

  ngOnInit(): void {
    this.createFrm();
    this.createFormRegistro();
    this.listaClientes();
    this.verControles();
    this.listaProveedores();
    this.listaMonedas();
    this.dataAdjunto ={
      //idCliente: this.idCliente,
      codtipoproc: 7
    }
    console.log('tipoorigen...', this.IA_data);
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idcliente: [{ value: '', disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      nomproyecto: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      descripcion: [{ value: '', disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{
        value: this.serviceUtilitario.obtenerFechaActual(),
        disabled: false,
      }],
      idordencompra: [{ value: '', disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      idorigen: [{ value: this.IA_data, disabled: false }],
      idcontacto: [{ value: 0, disabled: false }],
    });
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatosCab = this.fb.group({
      idcotiza: [{ value: 0, disabled: true }],
      fechaingreso: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: false }],
    })
  }

  guardarOC(){}

  verControles(){
    switch (this.IA_data) {
      case 1:
        this.verOpor = true;
        this.verInter = false;
        this.verVent = false;
        this.verOtro = false;
      break;
      case 2:
        this.verOpor = false;
        this.verInter = true;
        this.verVent = false;
        this.verOtro = false;
      break;
      case 3:
        this.verOpor = false;
        this.verInter = false;
        this.verVent = true;  
        this.verOtro = false;        
      break;
      case 4:
        this.verOpor = false;
        this.verInter = false;
        this.verVent = true;
        this.verOtro = true;          
      break;
    }
  }

  listaProveedores() {

    const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
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
        //console.info('next : ', rpta);
        this.lstCliente = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
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
  
  cargarOportunidades(data: any){
  
    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      idvendedor: 0,
      idpreventa: 0,
      idtipoprod: 0,
      idcliente: data,
      idlista: 0,
      annio: this.annio.getFullYear(),
      q: 0,
      idproveedor: 0
  
  }
  
      const $listarOportunidad = this.proyectosService.obtenerOportunidadXCliente(objeto)
        .subscribe({
            next: (rpta:any) => {
              console.log('cargarOportunidades...', rpta);
              this.lstOportunidad = rpta;
            },
            error:(err)=>{
                console.error('error : ',err)
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico
                })
            },
            complete:() => {
              }
        });
        this.$listSubcription.push($listarOportunidad);
  
  } 
  
  getOrigen(data:any){
    console.log('getOrigen', data);
    this.IA_data = data;
    this.verControles();
  }

  getItem(data: any,index: number) {
      //data.idordencompra = this.param.idordencompra;
    data.nroindex = index;
    console.log("getItem : ", data);
    console.log("this.lstItemOC : ", this.lstItemOC);
    console.log("index : ", index);
    const refItem = this.dialogService.open(CItemCotizacionComponent, {
      data: data,
      header: data.length == 0 ? "Nuevo Item" : "Editar Item - " + data.idordencompraitem,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%',
      //height: '55%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      if (rpta != undefined) {
        console.log("getItem modal 01 : ", rpta.data);
        console.log("index modal 01 : ", index);

          const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
          if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
          }
        this.lstItemOC.push(rpta.data);
      }
      this.calcularTotales();
    });
  }

  calcularTotales() {
    console.log('this.lstItemOC...', this.lstItemOC);
    let totalpreventot = 0;    
    for (let lstCotiza of this.lstItemOC) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }    
    this.montoTotal = totalpreventot;
  }

  eliminarItem(data: any) {
    console.log("eliminarItem : ", data);  
    //const rpta = await this.serviceSharedApp.confirmDialog({ message: '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' });
    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message:  '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' ,
      accept: () => {
        if (data.idcotizaitem > 0) {
          const _posAll: number = this.lstItemOC.findIndex((x => x.idordencompraitem == data.idordencompraitem))
          if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
          }
      }else{
          const _posAll: number = this.lstItemOC.findIndex((x => x.idnvoitem == data.idnvoitem))
          if (_posAll != -1) {
          this.lstItemOC.splice(_posAll, 1)
          }
      }
      this.calcularTotales();
      }
  });
  }

  getContactos(idcliente: any) {
    this.ordencompraService.obtenerContactos(idcliente).subscribe({
        next: (rpta: any) => {
          console.log('getContactos', rpta);
        this.lstContacto = rpta;
        },

        error: (err) => {
        console.info('error : ', err);
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
}
