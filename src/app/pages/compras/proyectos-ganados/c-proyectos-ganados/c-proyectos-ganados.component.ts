import { Component, OnInit } from '@angular/core';
import { I_Proyecto } from '@interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ModalProyectoComponent } from '../modal-proyecto/modal-proyecto.component';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ProyectosService } from '../service/proyectos.service';


@Component({
  selector: 'app-c-proyectos-ganados',
  templateUrl: './c-proyectos-ganados.component.html',
  styleUrls: ['./c-proyectos-ganados.component.scss']
})
export class CProyectosGanadosComponent implements OnInit{
    $listSubcription: Subscription[] = [];

    vistaLista: boolean = true;
    visDetalle: boolean = false;
    visOcOs: boolean = true;
    tituloDetalle!: string;
    _tipoProy: any;
    frmDatos!: FormGroup;
    nomproyecto!: string;

    lstProyecto: I_Proyecto[] =[];
    itemsNvoPro!: MenuItem[];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "Cargando...!";
    tituloOC!: string;
    codigoBC!: string;
    oportunidad: any;
    dataCT:any;
    codproyecto:any;

    constructor(
        public dialogService: DialogService,
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        private proyectosService: ProyectosService,
        private messageService: MessageService,
    ){
        
    }

    ngOnInit(): void{     
        this.createFrm();
        //this.listaProyectoTipo();
        this.cargarLista(); 
    }

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
        }

    createFrm(){

        this.frmDatos = this.fb.group({
            
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

    cargarLista(){
        this.setSpinner(true);
        console.log('cargarLista...', this.frmDatos.value);
        this.proyectosService.listarProyecto(this.frmDatos.value).subscribe({
            next: (rpta: any) => {
            this.lstProyecto = rpta;
            console.info('lstProyecto : ', rpta );
            this.setSpinner(false);
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
                this.setSpinner(false);
            },
        });
    }   

    onVerBC(data: I_Proyecto) {
        console.log('onVer...', data);
        this.tituloDetalle = "DETALLE DEL PROYECTO " + data.nomproyecto;        

        this.codigoBC = data.idoportunidad;
        this.oportunidadTraerUno(data.idoportunidad);
    }

    onVer(dato: any) {
        console.log('onVer...', dato);
        
        const objeto = {
            idtipoproyecto : dato.idtipoproyecto,
            idproyecto: dato.idproyecto,
            indEditar: false
        }
        const ref = this.dialogService.open(ModalProyectoComponent, {
            data: objeto,
            header: "Ver Proyecto : "+ dato.nomproyecto,
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '30%'
        });
    }

    onEditar(dato: any) {
        console.log('onVer...', dato);
        
        const objeto = {
            idtipoproyecto : dato.idtipoproyecto,
            idproyecto: dato.idproyecto,
            indEditar: true
        }
        const ref = this.dialogService.open(ModalProyectoComponent, {
            data: objeto,
            header: dato.nomproyecto,
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '30%'
        });
        ref.onClose.subscribe(() => {
            this.cargarLista();
          });
    }

    generarOC(data: I_Proyecto) {
        console.log('generarOC...', data);
        this.codproyecto = data.idproyecto;
        this.nomproyecto = data.nomproyecto.toUpperCase();
        this.tituloDetalle =  data.nomproyecto.toUpperCase();
        this.vistaLista = false;
        this.visDetalle = false;
        this.visOcOs= true;
    }

    getProyecto(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
        this.visOcOs= false;
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.visOcOs= false;
    } 

    onNuevo(){
        // let nomProyecto='';
        // let dato = '';
        // switch (dato) {
        //     case 'O':
        //         nomProyecto='Oportunidad'
        //         this._tipoProy = 1;
        //     break;                
        //     case 'I':
        //         nomProyecto='Interno'  
        //         this._tipoProy = 2;              
        //     break;                
        //     case 'V':
        //         nomProyecto='Venta Pura' 
        //         this._tipoProy = 3;               
        //     break;   
        // }

        const objeto = {
            idtipoproyecto : 1,
            idproyecto: 0,
            indEditar: false
        }

        const ref = this.dialogService.open(ModalProyectoComponent, {
            data: objeto ,
            header: "Nuevo Proyecto",
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '30%'
        });
        ref.onClose.subscribe(() => {
            this.cargarLista();
          });
    }

    oportunidadTraerUno(idoportunidad: any){
        this.setSpinner(true);
        this.proyectosService.oportunidadTraeruno(idoportunidad).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                console.log('oportunidadTraerUno', rpta);
                this.oportunidad = rpta;
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
                complete: () => {
                    const {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista} = this.oportunidad;
                    this.dataCT = {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista};

                    this.vistaLista = false;
                    this.visDetalle = true;
                    this.visOcOs= false;
            },
        });
    }

    
}
