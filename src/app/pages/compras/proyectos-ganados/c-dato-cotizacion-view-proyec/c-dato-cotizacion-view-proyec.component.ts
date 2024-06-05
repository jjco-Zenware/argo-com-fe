

import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage,  mensajesQuestion } from '@constantes';
import { Cliente, ContactoOrdenCompra, Moneda, OrdenCompraItem, TipoDocumento } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectosService } from '../service/proyectos.service';

@Component({
  selector: 'app-c-dato-cotizacion-view-proyec',
  templateUrl: './c-dato-cotizacion-view-proyec.component.html',
  styleUrls: ['./c-dato-cotizacion-view-proyec.component.scss']
})
export class CDatoCotizacionViewProyecComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    frmDatosCot!: FormGroup;
    lstCotizacionItem: OrdenCompraItem[] = [];
    lstProveedores: Cliente[] = [];
    lstMonedas: Moneda[] = [];
    lstTipoDocumento: TipoDocumento[] = [];

    idProyecto: number = 0;
    idOrdencompra: number = 0;
    nrodocumentoadd: string = "";

    blockedDocument: boolean = false;
    mensajeSpinner: string = "";

    ExcelData: any;
    i_valor: number = 2;
    visibleDocument: boolean = true;
    registerFormCliente: any = FormGroup;
    proveedorVisible: boolean = false;
    personaNatural: boolean = false;
    headerTitle: string = '';

    asignadosContacto: ContactoOrdenCompra[] = [];
    filteredContac: ContactoOrdenCompra[] = [];
    lstTotalcontacs: ContactoOrdenCompra[] = [];
    registerFormContacto: any= FormGroup;
    submitted = false;
    IdContacto: number = 0;
    listaContacInicial: any = undefined;
    contacto: ContactoOrdenCompra = {idcontacto: 0, idcliente:0, nombrecontacto: '', cargo: '',image:'', telefono:'', idordencompra:0 };
    montoTotal: number = 0;
    dataproyec:any;

    IdCliente: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public refCtz: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private serviceProyecto: ProyectosService,
  ) { }


  get formContacto() { return this.registerFormContacto.controls; }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  ngOnInit(): void {
    this.param = this.config.data;
    this.createFrm();
    this.getRegistro();
    this.listaMonedas();
    this.listaProveedores();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  get formCot() { return this.frmDatosCot.controls; }

  createFrm() {
    this.frmDatosCot = this.fb.group({
      idordencompra: [{ value: this.param.idordencompra, disabled: true }],
      idrequerimiento: [{ value: 0, disabled: true }],
      idproyecto: [{ value: null, disabled: true }],
      codtipodoc: [{ value: 'QTE', disabled: true }],
      fechaingreso: [{
        value: this.serviceUtilitario.obtenerFechaActual(),
        disabled: true,
      }],
      idproveedor: [{ value: 0, disabled: true }, [Validators.required]],
      idmoneda: [{ value: 0, disabled: true }, [Validators.required]],
      iduserreg: [{ value: 0, disabled: true }],
      fecreg: [{ value: new Date(), disabled: true }],
      tiempoentrega: [{ value: 0, disabled: true }],
      codformapago: [{ value: '0', disabled: true }],
      validezoferta: [{ value: 0, disabled: true }],
      lugarentrega: [{ value: '0', disabled: true }],
      observacion: [{ value: '...', disabled: true }],
      garantia: [{ value: 0, disabled: true }],
      nrodocumentoadd: [{ value: null, disabled: true }],
      servicionombre: [{ value: '0', disabled: true }],
      condicionescomerciales:[{value: '', disabled: true }]
    })
  }

  getRegistro() {
    console.log('this.param.idproyecto', this.param.idproyecto);
    this.frmDatosCot.patchValue(this.param);
    this.idProyecto = this.param.idproyecto;
    this.idOrdencompra = this.param.idordencompra;
    this.asignadosContacto = this.param.contactos;
    this.listaContacInicial= this.param.contactos;
    this.lstCotizacionItem = this.param['items'] && this.param['items'].length > 0 ? this.param.items : [];
    this.dataproyec ={
      idCliente: this.idOrdencompra,
      codtipoproc: 7
    }

    this.calcularTotales() ;
  }

  listaProveedores() {
    // const objeto = {
    //   idrolpersona: 'PRO',
    //   idusuario: constantesLocalStorage.idusuario
    // }

    // console.log('listaProveedores', objeto);

    const $getClientes = this.serviceProyecto.obtenerClientes('PRO').subscribe({
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
    const $listaMonedas = this.serviceProyecto.obtenerMonedas().subscribe({
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

  destroy() {
    this.refCtz.close();
  }

filterContac(event: any) {
    let filtered: ContactoOrdenCompra[] = [];
    let query = event.query;

    for (let i = 0; i < this.lstTotalcontacs.length; i++) {
        let contac = this.lstTotalcontacs[i];
        if (
            contac.nombrecontacto &&
            contac.nombrecontacto.toLowerCase().indexOf(query.toLowerCase()) == 0
        ) {
            filtered.push(contac);
        }
    }
    this.filteredContac = filtered;
}

calcularTotales() {
    console.log('this.filteredProd...', this.lstCotizacionItem);
    let totalpreventot = 0;

    for (let lstCotiza of this.lstCotizacionItem) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }

    this.montoTotal = totalpreventot;
}

}
