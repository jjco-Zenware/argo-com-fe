import { Component, OnInit } from '@angular/core';
import { I_Proyecto } from '@interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-c-proyectos-ganados',
  templateUrl: './c-proyectos-ganados.component.html',
  styleUrls: ['./c-proyectos-ganados.component.scss']
})
export class CProyectosGanadosComponent implements OnInit{
    $listSubcription: Subscription[] = [];

    vistaLista: boolean = true;
    visDetalle: boolean = false;
    tituloDetalle?: string;

    lstProyecto: I_Proyecto[] =[];

    constructor(){
    }

    ngOnInit(): void{
        this.lstProyecto = [{
            idproyecto: 152,
            idcasonegocio: 526,
            nomproyecto: 'Demo Proyecto',
            fecproyecto: '18/03/2024',
            descripcion: 'descripción',
            fecreg: '18/03/2024',
            horareg: '18:00',
            nompreventa: 'preventa',
            nomproveedor: 'proveedor',
            idoportunidad: '8943',
            monto: 550000,
            nomcomercial: 'bcp',
            nomvendedor: 'vendedor'
        }];
    }



    onVer(data: I_Proyecto) {
        console.log('onVer...', data);
        this.tituloDetalle = "Detalle del Proyecto N° " + data.idproyecto;
        this.vistaLista = false;
        this.visDetalle = true;
    }

    generarOC(data: I_Proyecto) {
        console.log('generarOC...', data);
    }

    getProyecto(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
      }
}
