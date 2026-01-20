import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Cliente } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from '../../../compras/Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-registro-cliente',
  templateUrl: './c-registro-cliente.component.html',
  styleUrls: ['./c-registro-cliente.component.scss']
})

  export class CRegistroClienteComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
  
    dataCT:any;
    vistaLista: boolean = true;
    visDetalle: boolean = false;
  
    listaClientes: Cliente[] =[];
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
  
    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];
  
    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        private comprasService: ComprasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
      ){  
            
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
      }
  
    ngOnInit(): void{
      this.getClientes();
      this.cols = [
        { field: 'razonsocial', header: 'Razón Social' },
        { field: 'nomcomercial', header: 'Nombre Comercial' },
        { field: 'idtipodoc', header: 'Tipo Documento' },
        { field: 'nrodocumento', header: 'N° Documento' },
        { field: 'nomtipopersona', header: 'Tipo Persona' },
        { field: 'telefresumen', header: 'Telefono' },
        { field: 'email', header: 'Email' },
        { field: 'nomestado', header: 'Estado' },
    ];
      this.createFrm();
    }
  
    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }
  
    createFrm(){
        this.frmDatos = this.fb.group({
            idestado: [
            {
              value: null,
              disabled: false,
            },
          ],idcliente: [
            {
              value: null,
              disabled: false,
            },
          ],idproyecto: [
            {
              value: null,
              disabled: false,
            },
          ],
          fechaini: [
            {
              value: this.utilitariosService.obtenerFechaInicioMes(),
              disabled: false,
            },
          ],
          fechafin: [
            {
              value: this.utilitariosService.obtenerFechaFinMes(),
              disabled: false,
            },
          ],
          idusuario: [
            {
              value: constantesLocalStorage.idusuario,
              disabled: false,
            },
          ],
        })
      }
  
    getClientes() {
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

      const objeto = {
          idrolpersona: 'CLI',
          idusuario: constantesLocalStorage.idusuario
      }

      const $getClientes =  this.comprasService.ListaProveedores(objeto).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('getClientes : ', rpta);
              this.listaClientes = rpta;
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
          this.$listSubcription.push($getClientes);

    }
  
    onVer(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "VER CLIENTE" + data.razonsocial;
        this.vistaLista = false;
        this.visDetalle = true;
    }
  
    EditarCliente(data: any) {
        console.log('EditarCliente...', data);
        this.tituloDetalle = "EDITAR CLIENTE " + data.razonsocial;
        this.vistaLista = false;
        this.visDetalle = true;

        this.dataCT = data;
    }

    onNuevo(data: any) {
      console.log('nuevo cliente...',data);
      this.dataCT = data;
      this.tituloDetalle = "REGISTRAR NUEVO CLIENTE" ;
      this.vistaLista = false;
      this.visDetalle = true;
  }
  
    getDetalle(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
    }
  
    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.getClientes();
      }


      getActvarDesactivar(dato:any){   
        this.confirmationService.confirm({
          key: 'confirm1',
          header: 'Confirmación',
          //target: event.target || new EventTarget,
          message: '¿Estás seguro de Activar/Desactivar el Cliente: '+ '<b>'+ dato.razonsocial +'</b>'+ '?',
          //icon: 'pi pi-exclamation-triangle text-6xl',
          accept: () => {
            this.activarCliente(dato);  
          }
      }); 
        
      }

    activarCliente(data: any){      
      this.setSpinner(true);
      const objeto = {
        idpersona: data.idcliente,
        idusuario: constantesLocalStorage.idusuario,
        indestado: data.indestado
    }

    const $getClientes =  this.comprasService.activarProveedor(objeto).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('getClientes : ', rpta);
            if (rpta.procesoSwitch === 0){
              this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje }); 
              this.getClientes(); 
             }else{
              this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
             }
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
        this.$listSubcription.push($getClientes);
    }
  }
  