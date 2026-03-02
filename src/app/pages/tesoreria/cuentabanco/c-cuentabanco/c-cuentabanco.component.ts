import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-cuentabanco',
  templateUrl: './c-cuentabanco.component.html',
  styleUrls: ['./c-cuentabanco.component.scss']
})

export class CCuentaBancoComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  lstMonedas: any;
  lstProveedor: any;
  products:any[] = [];
  lstContractual: any;
  cuentaVisible: boolean = false;
  lstTipocuenta: any;
  IdCuenta: number = 0;
  lstBancos: any;
  frmDatos!: FormGroup;
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  dataDet:any;
  tituloDetalle: string ='';
  idPersona: number = 3324

  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public dialogService: DialogService  , 
      private serviceSharedApp: SharedAppService,
      private tesoreriaService: TesoreriaService, 
      private comprasService: ComprasService,     
      private messageService: MessageService, 
    ){    
      
  }

  ngOnInit(): void{
    this.createFormRegistro();
    this.personaProveedorlist();
    this.listarBancos();
    this.cols = [
      { field: 'razonsocial', header: 'BANCO' },
      { field: 'desmoneda', header: 'MONEDA ' },
      { field: 'codctactble', header: 'CUENTA ' },
      { field: 'nomtipocuenta', header: 'TIPOCUENTA ' },
      { field: 'nomcuenta', header: 'NOMCUENTA' },
      { field: 'nrocuenta', header: 'NROCTA' },
      { field: 'nrocci', header: 'CCI' }       
    ];
    this.personaProveedorlist();
  }

    createFormRegistro(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(), disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
        idbanco: [{ value: 0, disabled: false }],
      })
    }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  listarBancos(){    
    const $getListarOrdenCompra = this.tesoreriaService.listarBanco()
      .subscribe({
        next: (rpta:any) => {
            this.lstBancos = rpta;
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }
  
  personaProveedorlist(){
    this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;

    const $personaProveedorlist = this.comprasService.listaPersonaLinea(this.idPersona).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log('lstContractual...', rpta);
       this.lstContractual= rpta;
        
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
        this.setSpinner(false);
      },
    });
    this.$listSubcription.push($personaProveedorlist);
  }
  
  agregarCuenta(){
    const objeto = {
      idcuentaprov: 0,
      idpersona: this.idPersona
    }

    this.dataDet = objeto;
    this.tituloDetalle = "REGISTRAR CUENTA";
    this.vistaLista = false;
    this.visDetalle = true;
  }

  editarCuenta(objeto:any){
    console.log('editarLinea', objeto);
    objeto.idpersona = this.idPersona;
    this.dataDet = objeto;
    
    this.tituloDetalle = "EDITAR CUENTA";
    this.vistaLista = false;
    this.visDetalle = true;
  }

  eliminarCuenta(objeto:any){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjInactivar;

    const $eliminarCuenta = this.comprasService.PersonaCuentaDell(objeto.idcuentaprov).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje }); 
          this.personaProveedorlist(); 
         }else{
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
         }
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
        this.setSpinner(false);
      },
    });
    this.$listSubcription.push($eliminarCuenta);
    
  }

  getDetalle(dato:boolean){
    this.vistaLista = true;
    this.visDetalle = false;
    this.personaProveedorlist();
  }

  getBack() {
    this.vistaLista = true;
    this.visDetalle = false;
    this.personaProveedorlist();
  }
  
}
