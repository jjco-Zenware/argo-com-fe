import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage } from '@constantes';
import { dOperacion } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-c-orden-compra-servicio',
  templateUrl: './c-orden-compra-servicio.component.html',
  styleUrls: ['./c-orden-compra-servicio.component.scss']
})
export class COrdenCompraServicioComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];


    vistaLista: boolean = true;
    visDetalle: boolean = false;
    visQuote: boolean = false;

    lstOperacion: dOperacion[] =[];
    tituloDetalle!: string;
    frmDatos!: FormGroup;

    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService){

            this.lstOperacion = [{
                nrooperacion: 152,
                idordencompra:4343,
                nomproveedor: ' nombre proveedor',
                nommoneda: 'soles',
                monto: 550000,
                nomtipoproducto: 'nom tipo product',
                idproyecto: 1233,
                nomproyecto: 'descripción Proyecto',
                idcotiza: 345
            }];
    }

    ngOnInit(): void{
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

      getBuscar(){
        // this.setSpinner(true);
        // this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

        // this.btnBuscar=true;
        // const $listaTareas = this.listatareasService.listaTareas(this.frmDatos.getRawValue())
        //   .subscribe({
        //     next: (rpta:any) => {
        //         this.setSpinner(false);
        //         console.log('rpta listaTareas', rpta);
        //       this.listaTareas = rpta;
        //     },
        //     error:(err)=>{
        //         this.setSpinner(false);
        //       console.error('error : ',err)
        //       this.messageService.clear();
        //       this.messageService.add({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: mensajesQuestion.msgErrorGenerico
        //       })
        //     },
        //     complete:() => {
        //       this.btnBuscar=false;
        //       this.setSpinner(false);
        //     }
        //   });
        // this.$listSubcription.push($listaTareas)
      }

    onVer(data: dOperacion) {
        console.log('onVer...', data);
        this.tituloDetalle = "Ver Orden de Compra/Servicio N° " + data.idordencompra;
        this.vistaLista = false;
        this.visDetalle = true;
        this.visQuote = false;
    }

    onEditar(data: dOperacion) {
        console.log('onVer...', data);
        this.tituloDetalle = "Editar Orden de Compra/Servicio N° " + data.idordencompra;
        this.vistaLista = false;
        this.visDetalle = true;
        this.visQuote = false;
    }
    verCotiza(data: dOperacion) {
        console.log('onVer...', data);
        this.tituloDetalle = "Cotización de Orden de Compra/Servicio N° " + data.idordencompra;
        this.vistaLista = false;
        this.visDetalle = false;
        this.visQuote = true;
    }

    getDetalle(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
        this.visQuote = false;
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.visQuote = false;
      }
}
