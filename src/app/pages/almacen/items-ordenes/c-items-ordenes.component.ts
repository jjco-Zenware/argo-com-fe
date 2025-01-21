import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Marca, Tag, TipoProducto } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ProyectosService } from '../../compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from '../../compras/Service/compraServices';
import { AlmacenService } from '../service/almacenServices';
import { CModalProductoComponent } from '../../compras/proyectos-ganados/modal-producto/c-modal-producto.component';
import { CBusquedaProductoComponent } from '../busqueda-producto/c-busqueda-producto.component';

@Component({
  selector: 'app-c-items-ordenes',
  templateUrl: './c-items-ordenes.component.html'
})
export class CItemOrdenesComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  frmDatosItem!: FormGroup;
  lstTipoProducto: TipoProducto[] = [];
  lstTipoProductoTot: TipoProducto[] = [];
  lstMarcas: Marca[] = [];
  marcaVisible?: boolean;
  headerTitle?: string;
  submitted?: boolean;
  registerFormMarca: any = FormGroup;
  verporTipo: boolean = false;
  verMarca: boolean = true;
  lstUnidades: any[]=[];
  lstTag: any[]=[];
  listaTag: any = [];
  tagVisible: boolean = false;
  registerFormTag!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    private proyectosService: ProyectosService,
    private comprasService: ComprasService,
    public datepipe: DatePipe,
    private almacenService: AlmacenService
  ) { }

  get formContacto() { return this.registerFormMarca.controls; }
  get formTag() { return this.registerFormTag.controls; }

  ngOnInit(): void {
    this.param = this.config.data;
    this.createFrm();
    this.createFormContacto(); 
    this.createFormTag();   
    this.listarTipoProducto();
    //this.listarMarcas();
    this.listarItemsTabla();
    this.listarItemsTag();
    

    // if (this.param.idordencompra === 0) {
    // }else{
    //   this.verControles(this.param.idtipoprod);
    // }    
    this.getRegistro();
    this.verControles(this.param.origenreg);
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatosItem = this.fb.group({
      idordencompraitem: [{ value: 0, disabled: false }],
      idordencompra: [{ value: 0, disabled: false }],
      idtipoprod: [{ value: 0, disabled: false }, [Validators.required]],
      idprod: [{ value: '', disabled: false }],
      descripcion: [{ value: '', disabled: false }, [Validators.required]],
      cantidad: [{ value: 1, disabled: false }, [Validators.required]],
      codunidad: [{ value: 'UNID', disabled: false }],
      preciocosto: [{ value: 0, disabled: false }, [Validators.required]],
      descuento: [{ value: 0, disabled: false }],
      margen: [{ value: 0, disabled: false }],
      precioventa: [{ value: 0, disabled: true }],
      indvig: [{ value: true, disabled: true }],
      iduserreg: [{ value: 0, disabled: false }],
      fecreg :[{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      iduseract: [{ value: 0, disabled: false }],
      fecact: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      coditem: [{ value: '0', disabled: false }],
      idmarca: [{ value: '', disabled: false }, [Validators.required]],
      nomprod: [{ value: '', disabled: false }],
      nommarca: [{ value: '', disabled: false }],
      preciocostototal: [{ value: 0, disabled: true }],
      precioventatotal: [{ value: 0, disabled: true }],
      preprofit: [{ value: 0, disabled: true }],
      nomtipoprod: [{ value: '', disabled: false }],
      nomproveedor: [{ value: '', disabled: false }],
      serialnumber: [{ value: '', disabled: false }],
      sku: [{ value: '', disabled: false }],
      nrocontrato: [{ value: '', disabled: false }],
      nromeses: [{ value: 0, disabled: false }],
      fecini: [{ value: null, disabled: false }], //this.serviceUtilitario.obtenerFechaInicioMes()
      fecfin: [{ value: null, disabled: false }], //this.serviceUtilitario.obtenerFechaFinMes()
      idunidad: [{ value: 130, disabled: false }, [Validators.required]],
      nomunidad: [{ value: '', disabled: false }],
      valor: [{ value: '', disabled: false }],
      ref1: [{ value: '', disabled: false }],
      codproducto: [{ value: '', disabled: false }],
      despro: [{ value: '', disabled: false }],
    })
  }

  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormMarca = this.fb.group({
    nommarca: ['', [Validators.required]],
    });
}

createFormTag() {
  //Agregar validaciones de formulario
  this.registerFormTag = this.fb.group({
  nomtag: ['', [Validators.required]],
  });
}

  getRegistro(){
    this.frmDatosItem.patchValue(this.param);
    console.log('getRegistro... : ', this.param);
    // if (this.param.idordencompra > 0) {
       this.listaTag = this.param.tags;
    // }
    if (this.param.idtipoprod === 3) {
      this.verMarca = false;
    }
  }

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(107).subscribe({
        next: (rpta: any) => {
            this.lstUnidades = rpta;
            console.log('lstUnidades : ', rpta);
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

    listarItemsTag() {
      this.comprasService.obtenerItemsTabla(108).subscribe({
          next: (rpta: any) => {
              this.lstTag = rpta;
          },
          error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
      });
    
      }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        this.lstTipoProductoTot = rpta;
        this.lstTipoProducto = this.lstTipoProductoTot.filter(x => x.idtipoprod !== 0 && x.idtipoprod !== 8);
        //this.frmDatosItem.get('idtipoprod')?.setValue(1);
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

  // listarMarcas() {
  //   const $listarMarcas = this.proyectosService.obtenerMarcas().subscribe({
  //     next: (rpta: any) => {
  //       this.lstMarcas = rpta;
  //     },
  //     error: (err) => {
  //       console.info('error : ', err);
  //       this.serviceSharedApp.messageToast()
  //     },
  //     complete: () => {
  //     },
  //   });
  //   this.$listSubcription.push($listarMarcas);

  // }

  calcularBCQ(event: any) {
    if (event.value > 0) {
      const total = event.value * this.frmDatosItem.get('preciocosto')?.value;
      this.frmDatosItem.get('preciocostototal')?.setValue(total);
    }
  }

  calcularBCPu(event: any) {
    if (event.value > 0) {
      const total = event.value * this.frmDatosItem.get('cantidad')?.value;
      this.frmDatosItem.get('preciocostototal')?.setValue(total);
    }
  }

  guardarItem() {
    if (this.frmDatosItem.get('idprod')?.value === 0 || this.frmDatosItem.get('idprod')?.value === null) {
      this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Ingresar Código'});
      return;
    }

    if (this.frmDatosItem.get('nommarca')?.value === '' || 
      this.frmDatosItem.get('nommarca')?.value === null|| 
      this.frmDatosItem.get('descripcion')?.value === ''|| 
      this.frmDatosItem.get('descripcion')?.value === null) {
        this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Debe buscar el Producto...'});
        return;
    }

   if (this.param.origenreg === 'RC' && this.frmDatosItem.get('preciocosto')?.value === 0 ) {
      this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Ingresar Precio Unitario...'});
      return;
   }

    // if (this.frmDatosItem.get('idtipoprod')?.value  === 6 || this.frmDatosItem.get('idtipoprod')?.value  === 7) {
    //   if (this.frmDatosItem.get('fecini')?.value === null) {
    //     this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Agregar Fecha Inicio'});
    //     return;
    //   }
    //   if (this.frmDatosItem.get('fecfin')?.value === null) {
    //     this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Agregar Fecha Final'});
    //     return;
    //   }
    //   const _fecini = this.serviceUtilitario.obtenerFechaFormateadoDMA(this.frmDatosItem.get('fecini')?.value);
    //   this.frmDatosItem.get('fecini')?.setValue(_fecini);
    //   const _fecfin = this.serviceUtilitario.obtenerFechaFormateadoDMA(this.frmDatosItem.get('fecfin')?.value);
    //   this.frmDatosItem.get('fecfin')?.setValue(_fecfin);
    // }   
    
    const _nomunidad:string=this.lstUnidades.filter(x=>x.iditem == this.frmDatosItem.get('idunidad')?.value)[0].valoritem;
    this.frmDatosItem.get('nomunidad')?.setValue(_nomunidad)

    this.cerrar({...this.frmDatosItem.getRawValue()})
  }

  cerrar(data:any) {
    const objeto = {
      ...data,
      tags: this.listaTag
    }
    this.refDatoItem.close({objeto});
  }


  

  verControles(dato: any){
    console.log('verControles', dato);
    switch (dato) {
      case 'RC':  
        this.verporTipo = true;
      break;
      case 'OC':
        this.verporTipo = false;
      break;
    }
  }

  changeDatePicker(data:any): any {
    let fecha = this.datepipe.transform(data, 'dd/MM/yyyy');
    return fecha;
  }

  NuevoTag(){
    this.submitted = false;
    this.registerFormTag.get('nomtag')?.setValue('');
    this.tagVisible = true;
  }

  guardarTag() {
    this.submitted = true;
    if (this.registerFormTag.invalid) {
        this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Ingresar Descripción ..." });
        return;
    }
    if(this.submitted)
    {
        const objeto = {
            iditem: 0,
            idtabla: 108,
            valor: this.registerFormTag.value.nomtag,
            coditem: ''
          }
          const $prcMarcas = this.proyectosService.prcItem(objeto).subscribe({
            next: (rpta: any) => {
              if (rpta.procesoSwitch === 0){
                this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
                this.tagVisible=false;
                this.listarItemsTag();
              }else{
              this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
              }
                
                
              
            },
            error: (err) => {
              console.info('error : ', err);
              this.serviceSharedApp.messageToast()
            },
            complete: () => {
            },
          });
          this.$listSubcription.push($prcMarcas);

        
    }
}

  eliminarTag(data:any){
    const _posAll: number = this.listaTag.findIndex(((x: { idtag: any; }) => x.idtag == data.idtag))
      if (_posAll != -1) {
      this.listaTag.splice(_posAll, 1)
      }
  }

  addTag(data:any){
    if (this.listaTag === undefined) { this.listaTag =[]}

    //if (this.listaTag !== undefined) {
      if (this.listaTag.length > 0) {
        let _idtagtabla = this.listaTag.filter((x: { idtag: any; }) => x.idtag === data);
        
        if (_idtagtabla.length > 0) {
          if (_idtagtabla[0].idtag === data) {
            this.messageService.add({ severity: 'info', summary: 'OK...', detail: 'El TAG ya fue registrado...' });
          return;
          }
        }            
      }
    //}    

    let _objeto = this.lstTag.filter(x => x.iditem === data);
    
    const objeto = {
      idtag: data,
      nomtag: _objeto[0].valoritem,
      valor: '',
      iditemdocumento: this.frmDatosItem.value.idordencompraitem
    }
    this.listaTag.unshift(objeto);
  }

  buscarProducto(){
    const valor = this.frmDatosItem.get('codproducto')?.value;
    console.log('buscarProducto...', valor);

    if (valor === '' || valor === null) {
      this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Ingresar Código Producto...'});
      return;
    }

    this.traerUnoProducto(valor);
  }

  traerUnoProducto(codigo: any){   
    const $traerUno = this.almacenService.traerProductoPorCodigo(codigo)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.traerUnoProducto', rpta);  
          this.frmDatosItem.get('idprod')?.setValue(rpta.idprod);
          this.frmDatosItem.get('nommarca')?.setValue(rpta.nommarca);
          this.frmDatosItem.get('despro')?.setValue(rpta.despro); 
          this.frmDatosItem.get('idmarca')?.setValue(rpta.idmarca);     
          
          if (rpta.idtipoprod === 3) {
            this.verMarca = false;
          }
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {        
        }
      });
    this.$listSubcription.push($traerUno)
  }

  getBusquedaAvanzada(data: any) {
      console.log('CBusquedaProductoComponent', data);
      const refItem = this.dialogService.open(CBusquedaProductoComponent, {
        data: data,
        header: "Busqueda Avanzada por Productos",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '60%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta);
        if (rpta !== undefined) {
          this.frmDatosItem.get('idprod')?.setValue(rpta.data.idprod);
          this.frmDatosItem.get('codproducto')?.setValue(rpta.data.codproducto); 
          this.frmDatosItem.get('idmarca')?.setValue(rpta.data.idmarca);
          this.frmDatosItem.get('despro')?.setValue(rpta.data.despro);
          this.frmDatosItem.get('idtipoprod')?.setValue(rpta.data.idtipoprod);    
          this.frmDatosItem.get('nommarca')?.setValue(rpta.data.nommarca);
  
          this.verControles(rpta.data.idtipoprod);
          if (rpta.data.idtipoprod === 3) {
            this.verMarca = false;
          }
          
        }
      });
    }
  
    altaRapida() {
      const refItem = this.dialogService.open(CModalProductoComponent, {
        //data: data,
        header: "Alta Rapida de Producto",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '30%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta);
        if (rpta !== undefined) {
          console.log('altaRapida',rpta.objeto.codigo);
          this.traerUno(rpta.objeto.codigo);        
        }
      });
    }

    traerUno(data:any){   
      console.log('traerUno', data);
      const $traerUno = this.almacenService.traerunoProducto(data)
        .subscribe({
          next: (rpta:any) => {
            console.log('rpta.traerUno', rpta.producto[0]);  
            this.frmDatosItem.get('idprod')?.setValue(rpta.producto[0].idprod);
              this.frmDatosItem.get('despro')?.setValue(rpta.producto[0].despro); 
              this.frmDatosItem.get('idmarca')?.setValue(rpta.producto[0].idmarca);      
              this.frmDatosItem.get('codproducto')?.setValue(rpta.producto[0].codproducto);  
              this.frmDatosItem.get('idtipoprod')?.setValue(rpta.producto[0].idtipoprod); 
              this.frmDatosItem.get('nommarca')?.setValue(rpta.producto[0].nommarca);  
              
              this.verControles(rpta.producto[0].idtipoprod);
              if (rpta.producto[0].idtipoprod === 3) {
                this.verMarca = false;
              }
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {        
          }
        });
      this.$listSubcription.push($traerUno)
    }
}
