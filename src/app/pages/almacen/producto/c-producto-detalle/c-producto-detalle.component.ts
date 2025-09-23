
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenService } from '../../service/almacenServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { Marca, Moneda } from '@interfaces';

@Component({
  selector: 'app-c-producto-detalle',
  templateUrl: './c-producto-detalle.component.html',
  styleUrls: ['./c-producto-detalle.component.scss']
})
export class CProductoDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  registerFormRegistro: any= FormGroup;
  headerTitle: string = '';
  idprod: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  errorMensaje: string = "";
  lstFamilia:any;
  lstSubFamilia:any;
  lstOrdenC:any;
  submitted?: boolean;
  tagVisible: boolean = false;
  registerFormTag!: FormGroup;  
  lstTag: any[]=[];
  listaTag: any = [];
  lstMarcas: Marca[] = [];
  marcaVisible?: boolean;
  registerFormMarca: any = FormGroup;
  lstUnidades: any[]=[];
  lstMonedas: Moneda[] = [];
lstControlInventario: any;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private almacenService: AlmacenService, 
    private proyectosService: ProyectosService,
    private comprasService: ComprasService,
  ) { }

  get formTag() { return this.registerFormTag.controls; }
  ngOnInit(): void {
    this.idprod = this.IA_data.idcodigo;
    console.log('this.IA_data', this.IA_data);

    this.createFormRegistro();
    this.createFormContacto(); 
    this.createFormTag();  
    this.listarItemsTag();
    this.listarMarcas();
    this.listarFamilia();    
    this.listarItemsTabla();
    this.listaMonedas() ;
    this.listarControlInventario();
    
    if (this.idprod > 0) {     
      this.traerUno();
    }else{    
      this.mostrarBotones('N');
    }   
  }
  get formContacto() { return this.registerFormMarca.controls; }
  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idprod: [{ value: this.idprod, disabled: true }],
      codproducto: [{ value: '', disabled: true }],
      despro:[{ value: '', disabled: false }],
      desdet:[{ value: '', disabled: false }],
      valorunit:[{ value: 0, disabled: false }],
      preciovenmax:[{ value: 0, disabled: true }],
      preciovenmin:[{ value: 0, disabled: true }],
      fecactivo: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false}],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idfamilia:[{ value: 0, disabled: false }],
      idsubfamilia: [{ value: 0, disabled: false }],
      idmarca: [{ value: 0, disabled: false }],
      idunidad: [{ value: 0, disabled: false }],
      stockmin: [{ value: 0, disabled: false }],
      stockmax: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 1, disabled: false }],
      indctrlunidad: [{ value: true, disabled: false }],
      modelo:[{ value: '', disabled: false }],
      serie:[{ value: '', disabled: false }],
      lote:[{ value: '', disabled: false }],
      controlinven:[{ value: '', disabled: false }],
    });
  }

  createFormTag() {
    //Agregar validaciones de formulario
    this.registerFormTag = this.fb.group({
    nomtag: ['', [Validators.required]],
    });
  }  
  
  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormMarca = this.fb.group({
    nommarca: ['', [Validators.required]],
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
      case 'V':
        this.verbtnGrabar = false;
        this.onlyRead = true;
      break;
      case 'N':
      case 'E':
        this.verbtnGrabar = true;
        this.onlyRead = false;
      break;      
    
      default:
        break;
    }

   
    
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
   
    const $traerUno = this.almacenService.traerunoProducto(this.idprod)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.traerUno', rpta);
          this.setSpinner(false);          
          this.getSubFamilia(rpta.producto[0].idfamilia); 
          this.listaTag = rpta.producto[0].tags;
          this.registerFormRegistro.patchValue(rpta.producto[0]);
          this.mostrarBotones(this.IA_data.paramReg);                
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);          
        }
      });
    this.$listSubcription.push($traerUno)
  }

  guardarProducto(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    // let fechaingreso;
    // let fecentrega;
    // fechaingreso = this.registerFormRegistro.value.fechaingreso;
    // fecentrega = this.registerFormRegistro.value.fecentrega;

    // if (this.idprod > 0) {
    //   fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));   
    //   fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega));    
    // }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      tags: this.listaTag
      //fechaingreso,
      //fecentrega,
    }

    console.log('guardarOC...', objeto);
    
    this.almacenService.prcProducto(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idprod === 0) {
            this.idprod = rpta.resultProceso;  
            this.registerFormRegistro.get('idprod').setValue(rpta.resultProceso);
            // this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);             
          }
          this.traerUno();         
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
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

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

      if (this.registerFormRegistro.value.despro === null || this.registerFormRegistro.value.despro === '')
      {
          this.errorMensaje="Ingresar Descripción...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idfamilia === 0 || this.registerFormRegistro.value.idfamilia === null))
      {
          this.errorMensaje="Seleccionar Grupo...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idsubfamilia === 0 || this.registerFormRegistro.value.idsubfamilia === null))
      {
          this.errorMensaje="Seleccionar Categoria...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idmarca === 0 || this.registerFormRegistro.value.idmarca === null))
      {
          this.errorMensaje="Seleccionar Marca...!";
          _error = true;
      }
    
      if (!_error && (this.registerFormRegistro.value.controlinven === null || this.registerFormRegistro.value.controlinven === ''))
      {
            this.errorMensaje="Seleccionar Control de Inventario...!";
            _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.stockmin > this.registerFormRegistro.value.stockmax ))
      {
            this.errorMensaje="Stock Mínimo no puede ser Mayor que Stock Máximo...!";
            _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.preciovenmin > this.registerFormRegistro.value.preciovenmax ))
      {
            this.errorMensaje="Precio Venta Mínimo no puede ser Mayor que Precio Venta Máximo...!";
            _error = true;
      }
     
       return _error;
     }
     
     listarItemsTag() {
      this.proyectosService.productotaglist(2).subscribe({
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
              idtag: 0,
              nomtag: this.registerFormTag.value.nomtag,
              idusuario: constantesLocalStorage.idusuario,
              tipotag: 2
            }
            const $prcMarcas = this.proyectosService.tagNew(objeto).subscribe({
              next: (rpta: any) => {
                if (rpta.procesoSwitch === 0){
                  this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
                  this.tagVisible=false;
                  this.listarItemsTag();

                  const objeto = {
                    idtag: rpta.resultProceso,
                    nomtag: this.registerFormTag.value.nomtag,
                    valor: '',
                    iditemdocumento: this.idprod
                  }
                  this.listaTag.unshift(objeto);
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
  
      let _objeto = this.lstTag.filter(x => x.idtag === data);
      
      const objeto = {
        idtag: data,
        nomtag: _objeto[0].nomtag,
        valor: '',
        iditemdocumento: this.idprod
      }
      this.listaTag.unshift(objeto);
    }

    NuevaMarca()  {
      this.submitted = false;
      this.headerTitle= 'Nueva Marca' ;
      this.marcaVisible = true;
    }
  
    guardarMarca() {
        this.submitted = true;
        if (this.registerFormMarca.invalid) {
            this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Falta Ingresar Datos ..." });
            return;
        }
        if(this.submitted)
        {
            const objeto = {
                idmarca: 0,
                nommarca: this.registerFormMarca.value.nommarca,
                idproveedor: 0
              }
              const $prcMarcas = this.proyectosService.procesarMarca(objeto).subscribe({
                next: (rpta: any) => {
                  this.listarMarcas();
                },
                error: (err) => {
                  console.info('error : ', err);
                  this.serviceSharedApp.messageToast()
                },
                complete: () => {
                },
              });
              this.$listSubcription.push($prcMarcas);
  
            this.marcaVisible=false;
        }
    }

    listarFamilia() {
      const $listarFamilia = this.almacenService.listarFamilia().subscribe({
        next: (rpta: any) => {
          this.lstFamilia = rpta;
        },
        error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
      });
      this.$listSubcription.push($listarFamilia);
    }

    getSubFamilia(dato: any) {  
      const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('next : ', rpta);
              this.lstSubFamilia = rpta;
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
      this.$listSubcription.push($getSubFamilia);
    }

    validarStock(dato: any,valor:any){
      let _min;
      let _max;
      if (valor === 0) {
        _min = dato;
        _max = this.registerFormRegistro.value.stockmax;
      }else{
        _min = this.registerFormRegistro.value.stockmin;
        _max = dato;
      }
      
      console.log('MINIMO', _min,'MAXIMO',  _max, 'STOCKVALOR', valor);
      if (_min > _max && valor === 0) {        
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Stock Mínimo no puede ser Mayor que Stock Máximo..."});  
        //this.registerFormRegistro.get('stockmin').setValue(this.stockmin);
      }
      if (_max < _min && valor === 1) {        
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Stock Máximo no puede ser Menor que Stock Mínimo..."}); 
        //this.registerFormRegistro.get('stockmax').setValue( this.stockmax);
      }
    }

    validarVenta(dato: any, valor: any){
      let _min;
      let _max;
      if (valor === 0) {
        _min = dato;
        _max = this.registerFormRegistro.value.preciovenmax;
      }else{
        _min = this.registerFormRegistro.value.preciovenmin;
        _max = dato;
      }
      
      console.log('MINIMO', _min,'MAXIMO',  _max,  'PRECIOVALOR', valor);
      if (_min > _max && valor === 0) {        
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Precio Venta Mínimo no puede ser Mayor que Precio Venta Máximo..."});  
        //this.registerFormRegistro.get('preciovenmin').setValue( this.premin);
      }
      if (_max < _min && valor === 1) {        
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Precio Venta Máximo no puede ser Menor que Precio Venta Mínimo..."});  
        //this.registerFormRegistro.get('preciovenmax').setValue( this.premax);
      }
    }

    listarControlInventario() {
    this.comprasService.obtenerItemsTabla(134).subscribe({
        next: (rpta: any) => {
            this.lstControlInventario = rpta;
            console.log('lstControlInventario : ', rpta);
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }
}
