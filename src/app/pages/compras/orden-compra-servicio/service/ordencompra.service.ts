import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { I_RespuestaProceso } from '@interfaces';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable()
export class OrdencompraService {

    constructor(private http: HttpClient) {
        //   this.http.get<any>('assets/demo/data/tasks.json')
        //   .toPromise()
        //   .then(res => res.data as Task[])
        //   .then(data => {
        //       this.tasks = data;
        //       this.taskSource.next(data);
        //   });
    }

    

    obtenerMarcas() {
        const url = `${constantesApiWeb.lstMarca}`;
        return this.http.get<any>(url);
    }

    procesarMarca(objeto:any) {
        const url = `${constantesApiWeb.prcMarca}`;
            return  this.http.post<any>(url, objeto)
    }

    obtenerContactos(idCliente:string) {
        const url = `${constantesApiWeb.kanbanListaContactosOpor}${idCliente}`;
        return this.http.get<any>(url);
    }
}