import { ChangeDetectorRef, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage,  mensajesQuestion, mensajesSpinner } from '@constantes';
import { Cliente, ContactoOrdenCompra,  Moneda, OrdenCompraItem, TipoDocumento } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { CItemCotizacionComponent } from '../c-item-cotizacion/c-item-cotizacion.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectosService } from '../service/proyectos.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-c-dato-cotizacion',
  templateUrl: './c-dato-cotizacion.component.html'
})
export class CDatoCotizacionComponent implements OnInit, OnDestroy {


    $listSubcription: Subscription[] = [];
    param: any;
    frmDatosCot!: FormGroup;
    lstCotizacionItem: OrdenCompraItem[] = [];
    lstProveedores: Cliente[] = [];
    lstMonedas: Moneda[] = [];
    lstTipoDocumento: TipoDocumento[] = [];

    idproyecto: number = 0;
    idordencompra: number = 0;
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
    contactoVisible: boolean = false;
    registerFormContacto: any= FormGroup;
    submitted = false;
    IdContacto: number = 0;
    listaContacInicial: any = undefined;
    contacto: ContactoOrdenCompra = {idcontacto: 0, idcliente:0, nombrecontacto: '', cargo: '',image:'', telefono:'', idordencompra:0 };
    montoTotal: number = 0;
    lstTipoRol:any;

    dropdownItemsTipPer = [
        { name: 'Jurídica', code: 'J' },
        { name: 'Natural', code: 'N' }
    ];

    dropdownItemsNac = [
        { name: 'Extranjero', code: '0' },
        { name: 'Nacional', code: '1' }
    ];

    dropdownItemsTipNro = [
        { name: 'RUC', code: 'RUC' },
        { name: 'DNI', code: 'DNI' }
    ];
    IdCliente: any;
    dataLegal: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public refCtz: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) { }


  get formContacto() { return this.registerFormContacto.controls; }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  ngOnInit(): void {
    this.param = this.config.data;
    console.log('ngOnInit', this.param);    

    this.createFrm();
    this.createFormContacto();
    this.getRegistro();
    this.listaMonedas();
    this.listaProveedores();
    this.createFormProveedor();
    this.listarItemsTabla();
    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  get formCot() { return this.frmDatosCot.controls; }
  get formProveedor() { return this.registerFormCliente.controls; }

  createFrm() {
    this.frmDatosCot = this.fb.group({
      idordencompra: [{ value: this.param.idordencompra, disabled: true }],
      idrequerimiento: [{ value: 0, disabled: false }],
      idproyecto: [{ value: null, disabled: false }],
      codtipodoc: [{ value: 'PRY', disabled: false }],
      fechaingreso: [{
        value: this.serviceUtilitario.obtenerFechaActual(),
        disabled: false,
      }],
      idproveedor: [{ value: 0, disabled: false }, [Validators.required]],
      idmoneda: [{ value: 0, disabled: false }, [Validators.required]],
      iduserreg: [{ value: 0, disabled: false }],
      fecreg: [{ value: new Date(), disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: '0', disabled: false }],
      validezoferta: [{ value: 0, disabled: false }],
      lugarentrega: [{ value: '0', disabled: false }],
      observacion: [{ value: '...', disabled: false }],
      garantia: [{ value: 0, disabled: false }],
      nrodocumentoadd: [{ value: null, disabled: false }],
      servicionombre: [{ value: '0', disabled: false }],
      condicionescomerciales:[{value: '', disabled: false }]
    })
  }

  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormContacto = this.formBuilder.group({
    nombrecontacto: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    cargo: ['', [Validators.required]],
    tiporol: ['', [Validators.required]],
    });
}

  createFormProveedor() {
    //Agregar validaciones de formulario
    this.registerFormCliente = this.fb.group({
    idrolpersona: [{ value: 'PRO', disabled: false }],
    tipopersona :  [{ value: 'J', disabled: false }],
    tipoalta : [{ value: 'NOR', disabled: false }],
    indnacionalidad: [{ value: null, disabled: false }, [Validators.required]],
    idpais: [{ value: '1', disabled: false }],
    idtipodoc: [{ value: null, disabled: false }, [Validators.required]],
    nrodocumento: [{ value: null, disabled: false }, [Validators.required]],
    appaterno: [{ value: null, disabled: false }, [Validators.required]],
    apmaterno: [{ value: null, disabled: false }, [Validators.required]],
    apcasada: [{ value: null, disabled: false }],
    nombres: [{ value: null, disabled: false }, [Validators.required]],
    razonsocial: [{ value: null, disabled: false }, [Validators.required]],
    nomcomercial: [{ value: null, disabled: false }],
    direcresumen: [{ value: null, disabled: false }, [Validators.required]],
    telefresumen: [{ value: null, disabled: false }],
    email: ['', [Validators.required, Validators.email]],
    paginaweb: [{ value: null, disabled: false }],
    facebook: [{ value: null, disabled: false }],
    youtube: [{ value: null, disabled: false }],
    indmigrado :  [{ value: false, disabled: false }],
    indestado:  [{ value: '1', disabled: false }],
    indvig :  [{ value: true, disabled: false }],
    fechareg: [{ value: new Date(), disabled: false }],
    iduserreg : [{ value: 1, disabled: false }],
    fechaact: [{ value: new Date(), disabled: false }],
    iduseract: [{ value: 1, disabled: false }],
    idpersona: [{ value: 0, disabled: false }],
    tipocambio: [{ value: 0, disabled: false }],
    });
}

  getRegistro() {
    console.log("params dato: ", this.param);
    this.frmDatosCot.patchValue(this.param);
    this.asignadosContacto = [];

    console.log("this.param.data.contactos: ", this.param.contactos);
    console.log("idindicador: ", this.param.idindicador);
    this.idproyecto = this.param.idproyecto;

    this.idordencompra = this.param.idordencompra;

    if (this.param.contactos !== null && this.param.contactos !== undefined) {
        console.log("ENTRO idindicador: ", );
        this.asignadosContacto = this.param.contactos;
        this.listaContacInicial= this.param.contactos;
    }

    this.dataLegal ={
      idCliente: this.idordencompra,
      codtipoproc: 7
    }

    console.log("getContactos: ", this.param.idproveedor);
    if (this.param.idproveedor !== undefined) {
      this.getContactos(this.param.idproveedor);
    }
    
    if (this.idordencompra > 0) {
        this.visibleDocument = false;
    }else{
        this.idordencompra = 0;
    }
    this.lstCotizacionItem = this.param['items'] && this.param['items'].length > 0 ? this.param.items : [];
    this.calcularTotales() ;
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

  changeIniFecha(dato: any){
    let fecha = this.datepipe.transform(dato, 'dd/MM/yyyy')
    console.log('changeFinFecha', this.datepipe.transform(dato, 'dd/MM/yyyy'));
    this.frmDatosCot.get('fechaingreso')?.setValue(fecha);
}

  grabarCotizacion() {
    console.log('frmDatosCot...', this.frmDatosCot.getRawValue());
    console.log('this.idordencompra...', this.idordencompra);
    console.log('fechaingreso...', this.frmDatosCot.get('fechaingreso')?.getRawValue());
    if (this.frmDatosCot.invalid) {
      console.log('formulario invalido...', this.frmDatosCot.invalid);
      this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Falta Ingresar Datos ..." });
      return;
    }

    if (this.lstCotizacionItem.length == 0) {
        this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Debe Ingresar Items..." });
        return;
    }
    // console.log('fecinicio.length...', this.frmDatosCot.get('fechaingreso')?.getRawValue().toString().length);
    // if (this.frmDatosCot.get('fechaingreso')?.getRawValue().toString().length > 13) {
    //     this.changeIniFecha(this.frmDatosCot.get('fechaingreso')?.getRawValue());
    // }


    let  fechaingreso_;
    if (this.idordencompra > 0) {
        fechaingreso_ = this.serviceUtilitario.formatFecha(this.frmDatosCot.get('fechaingreso')?.getRawValue())
    }else{
        fechaingreso_ =this.frmDatosCot.get('fechaingreso')?.getRawValue()
    }
    console.log('fechaingreso_...', fechaingreso_);

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjProcesando

    const ordenCompra = {
      ...this.frmDatosCot.getRawValue(),
      idproyecto: this.idproyecto,
      idordencompra: this.idordencompra,
      fechaingreso: fechaingreso_,
      items: this.lstCotizacionItem,
      contactos: this.asignadosContacto,
      iduserreg: constantesLocalStorage.idusuario
    }

    console.log('grabarCotizacion...', ordenCompra);

    const $procesarCotizacion = this.proyectosService.procesarOC(ordenCompra)
      .subscribe({
        next: (rpta: any) => {
            console.log('procesarCotizacion rpta...', rpta);
          this.setSpinner(false);
          if (rpta.procesoSwitch == 0) {
            if (this.idordencompra == 0) {
                this.idordencompra = rpta.resultProceso;
                //this.serviceOportunidad.emitirEvento(rpta.resultProceso);
                //this.mensajeEmit.emit(rpta.resultProceso);
                this.frmDatosCot.get('idordencompra')?.setValue(this.idordencompra);
                this.getRegistro2();
            }

          }


          this.serviceSharedApp.messageToast({
            severity: rpta.procesoSwitch == 0 ? 'success' : 'error',
            summary: rpta.procesoSwitch == 0 ? 'Exito' : 'Info',
            detail: rpta.mensaje
          });
        },
        error: (err) => {
          this.setSpinner(false);
          console.error('error : ', err)
          this.serviceSharedApp.messageToast()
        },
        complete: () => { }
      });
    this.$listSubcription.push($procesarCotizacion);
  }

  getRegistro2() {
    this.confirmationService.confirm({
        key: 'confirm2',
        header: 'Confirmación',
        message: '¿Desea Adjuntar Documentos?',
        accept: () => {
            this.visibleDocument = false;
            //this.listarCotizacionUno();
        }
    });
  }

  listarCotizacionUno() {
    this.lstCotizacionItem = [];
    const $listarCotizacionUno = this.proyectosService.listarCotizacionUno(this.idordencompra)
      .subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.log('listarCotizacionUno', rpta.quotes);
            this.lstCotizacionItem = rpta.quotes.items;
        },
        error: (err) => {
          console.error('error : ', err)
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        }
      });
    this.$listSubcription.push($listarCotizacionUno);
  }

  getItem(data: any,index: number) {
    data.idordencompra = this.param.idordencompra;
    data.nroindex = index;
    console.log("getItem : ", data);
    console.log("this.lstCotizacionItem : ", this.lstCotizacionItem);
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

          const _posAll: number = this.lstCotizacionItem.findIndex((x => x.nroindex == index))
          if (_posAll != -1) {
            this.lstCotizacionItem.splice(_posAll, 1)
          }
        this.lstCotizacionItem.push(rpta.data);
      }
      this.calcularTotales();
    });
  }

  async eliminarItem(data: any) {
    console.log("getItem : ", data);

    const rpta = await this.serviceSharedApp.confirmDialog({ message: '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' });
    if (!rpta) return;

    // if (data.idcotiza > 0) {
    //     const _posAll:number=this.lstCotizacionItem.findIndex((x=>x.idcotizaitem == data.idcotizaitem))
    //     if (_posAll != -1){
    //         this.lstCotizacionItem.splice(_posAll, 1)
    //       }
    // }
        if (data.idcotizaitem > 0) {
            const _posAll: number = this.lstCotizacionItem.findIndex((x => x.idordencompraitem == data.idordencompraitem))
            if (_posAll != -1) {
            this.lstCotizacionItem.splice(_posAll, 1)
            }
        }else{
            const _posAll: number = this.lstCotizacionItem.findIndex((x => x.idnvoitem == data.idnvoitem))
            if (_posAll != -1) {
            this.lstCotizacionItem.splice(_posAll, 1)
            }
        }
  }

  destroy() {
    this.refCtz.close();
  }

  /*INICIO PRC PROVEEDOR*/
NuevoProveedor()  {
    this.cambioTipoPer('J');
    this.submitted = false;
    this.headerTitle= 'Nuevo Proveedor' ;
    this.proveedorVisible = true;
}

cambioTipoPer(dato: any) {
  if (dato === 'J') {
    this.personaNatural = false;

    this.registerFormCliente.get('razonsocial')?.clearValidators();
    this.registerFormCliente.get('razonsocial')?.setValidators(Validators.required);
    this.registerFormCliente.get('razonsocial')?.updateValueAndValidity();

    this.registerFormCliente.get('nombres')?.clearValidators();
    this.registerFormCliente.get('nombres')?.updateValueAndValidity();

    this.registerFormCliente.get('appaterno')?.clearValidators();
    this.registerFormCliente.get('appaterno')?.updateValueAndValidity();

    this.registerFormCliente.get('apmaterno')?.clearValidators();
    this.registerFormCliente.get('apmaterno')?.updateValueAndValidity();
      }else{
    this.personaNatural = true;

    this.registerFormCliente.get('nombres')?.clearValidators();
    this.registerFormCliente.get('nombres')?.setValidators(Validators.required);
    this.registerFormCliente.get('nombres')?.updateValueAndValidity();

    this.registerFormCliente.get('appaterno')?.clearValidators();
    this.registerFormCliente.get('appaterno')?.setValidators(Validators.required);
    this.registerFormCliente.get('appaterno')?.updateValueAndValidity();

    this.registerFormCliente.get('apmaterno')?.clearValidators();
    this.registerFormCliente.get('apmaterno')?.setValidators(Validators.required);
    this.registerFormCliente.get('apmaterno')?.updateValueAndValidity();

    this.registerFormCliente.get('razonsocial')?.clearValidators();
    this.registerFormCliente.get('razonsocial')?.updateValueAndValidity();
}
}

cambioTipoDoc(dato: any) {
    if (dato == 'RUC') {
        //this.idtipodoc
    }else{
        //this.cliente.tipopersona == 'N';
    }
}

guardarProveedor() {
    this.submitted = true;
    console.log('guardarProveedor...', this.registerFormCliente.getRawValue());

    // deténgase aquí si el formulario no es válido
    if (this.registerFormCliente.invalid) {
        console.log('deténgase aquí si el formulario no es válido');
        this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Falta Ingresar Datos ..." });
        return;
    }

    //Verdadero si todos los campos están llenos
    if(this.submitted)
    {
        this.proyectosService.prcClientes(this.registerFormCliente.getRawValue())
            .subscribe({
            next: (rpta:any) => {
                console.log("rpta prcClientes : ", rpta);
                if (rpta.procesoSwitch == 0){
                    this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                    this.listaProveedores();
                    this.proveedorVisible = false;
                    }
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
            complete:() => {}
            });
    }
}

/*FIN PRC PROVEEDOR */

// listaAsignados() {
//     this.kanbanService.obtenerUsuarios().subscribe({
//         next: (rpta: any) => {
//             this.lstTotalcontacs = rpta;
//         },
//         error: (err) => {
//         console.info('error : ', err);
//         this.messageService.clear();
//         this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: mensajesQuestion.msgErrorGenerico,
//         });
//         },
//         complete: () => {
//         },
//     });
// }

getContactos(codigo: any) {
    //this.IdCliente= idcliente;
    this.proyectosService.ListaContactos(codigo).subscribe({
        next: (rpta: any) => {
            console.log('getContactos',rpta);
        this.lstTotalcontacs = rpta;
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

getContactos2(codigo: any) {
  //this.IdCliente= idcliente;
    this.asignadosContacto = [];
  this.proyectosService.ListaContactos(codigo).subscribe({
      next: (rpta: any) => {
      this.lstTotalcontacs = rpta;
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

changeHeaderTitle(arg: number, contac: any) {
    this.listaContacInicial=[];
    this.submitted = false;
    this.registerFormContacto.reset();

    this.listaContacInicial = this.asignadosContacto;
    console.log('lista contactos', this.listaContacInicial);

    if (arg == 1) {
        this.headerTitle = "Nuevo Contacto";
        this.IdContacto = 0;
    }
    if (arg == 2) {
        this.headerTitle = "Editar Contacto";
        this.IdContacto = contac.idcontacto;
        this.registerFormContacto.get('nombrecontacto').setValue(contac.nombrecontacto);
        this.registerFormContacto.get('email').setValue(contac.email);
        this.registerFormContacto.get('telefono').setValue(contac.telefono);
        this.registerFormContacto.get('cargo').setValue(contac.cargo);

    }
    this.contactoVisible=true;
}

guardarContacto() {
    this.submitted = true;
    // deténgase aquí si el formulario no es válido
    if (this.registerFormContacto.invalid) {
        return;
    }
    //Verdadero si todos los campos están llenos
    if(this.submitted)
    {
      const _nomtiporol =this.lstTipoRol.filter((x: { iditem: any; })=>x.iditem === this.registerFormContacto.value.tiporol)[0].valoritem;


        console.log('Id Contacto',this.IdContacto);
        console.log('this.registerFormContacto',this.registerFormContacto.value);
        console.log('this.param.data.',this.param.idordencompra);
        console.log('this.frmDatosCot',this.frmDatosCot.value);

        if (this.IdContacto !== 0) {
            for (let i = 0; i < this.listaContacInicial.length; i++) {
                //console.log('en el for', this.listaContacInicial[i].idcontacto);
                if (this.IdContacto === this.listaContacInicial[i].idcontacto) {
                    console.log('en el if del for',this.listaContacInicial[i]);
                    this.asignadosContacto.splice(i, 1);
                }
            }
        }
        //console.log('lista despues de eliminar', this.listaContacInicial);
        this.asignadosContacto.unshift(this.contacto ={
            idcontacto: this.IdContacto,
            idcliente: this.frmDatosCot.get('idproveedor')?.getRawValue(),// this.registerFormCliente.idproveedor,
            nombrecontacto : this.registerFormContacto.value.nombrecontacto,
            email : this.registerFormContacto.value.email,
            telefono: this.registerFormContacto.value.telefono,
            cargo:this.registerFormContacto.value.cargo,
            tiporol:this.registerFormContacto.value.tiporol,
            nomtiporol: _nomtiporol,
            image: "ivanmagalhaes.png",
            idordencompra: this.frmDatosCot.get('idordencompra')?.getRawValue(),
        });

        console.log('this.contacto.',this.contacto);
        //this.contactos.emit(this.asignadosContacto);
        this.contactoVisible=false;
    }
}

listarItemsTabla() {
  this.proyectosService.obtenerItemsTabla(103).subscribe({
      next: (rpta: any) => {
          console.log('listarItemsTabla', rpta);
      this.lstTipoRol = rpta;
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });

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
