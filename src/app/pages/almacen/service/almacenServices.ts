import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class AlmacenService {

    constructor(private http: HttpClient) {   }

    ListarAlamcen(objeto: any) {
        const url = `${constantesApiWeb.ListarAlamcen}`;
        console.log("url alamacen : ", url);
        return this.http.post<any>(url, objeto)
    }

    GrabarAlamcen(objeto: any) {
        console.log("prcClientes : ", objeto);
        const url = `${constantesApiWeb.GrabarAlamcen}`;
        return this.http.post<any>(url, objeto)
    }
    
    // ActualizarAlamcen(objeto: any) {
    //     console.log("prcClientes : ", objeto);
    //     const url = `${constantesApiWeb.prcClientes}`;
    //     return this.http.post<any>(url, objeto)
    // }

    // TraerunoAlmacen(idtabla: number) {
    //     const url = `${constantesApiWeb.listaTipoDocumento}${idtabla}`;
    //     return this.http.get<any>(url);
    // }


}