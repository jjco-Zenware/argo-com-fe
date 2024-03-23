import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { I_RespuestaProceso } from '@interfaces';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable()
export class ProyectosService {

    constructor(private http: HttpClient) {
        //   this.http.get<any>('assets/demo/data/tasks.json')
        //   .toPromise()
        //   .then(res => res.data as Task[])
        //   .then(data => {
        //       this.tasks = data;
        //       this.taskSource.next(data);
        //   });
    }

    listarCasoNegocio(idOportunidad:string) {
        const url = `${constantesApiWeb.listarCasoNegocio}${idOportunidad}`;
        return this.http.get<any>(url);
    }

    listarCotizaciones(idOportunidad:string) {
        const url = `${constantesApiWeb.lstCotizacion}${idOportunidad}`;
        return this.http.get<any>(url);
    }

    obtenerMontoOportunidad(idOportunidad:string) {
        const url = `${constantesApiWeb.obtenerMonto}${idOportunidad}`;
        return this.http.get<any>(url);
    }
}
