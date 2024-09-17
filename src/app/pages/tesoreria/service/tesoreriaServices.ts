import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class TesoreriaService {

    constructor(private http: HttpClient) {   }

    ListarAlamcen(objeto: any) {
        const url = `${constantesApiWeb.ListarAlamcen}`;
        return this.http.post<any>(url, objeto)
    }

    GrabarAlamcen(objeto: any) {
        const url = `${constantesApiWeb.GrabarAlamcen}`;
        return this.http.post<any>(url, objeto)
    }
    
   

    listarProducto() {
        const url = `${constantesApiWeb.listarProducto}`;
        return this.http.get<any>(url)
    }

    prcProducto(objeto: any) {
        const url = `${constantesApiWeb.prcProducto}`;
        return this.http.post<any>(url, objeto)
    }

    traerunoProducto(codigo: any) {
        const url = `${constantesApiWeb.traerunoProducto}${codigo}`;
        return this.http.get<any>(url);
    }

    listarFamilia() {
        const url = `${constantesApiWeb.listarFamilia}`;
        return this.http.get<any>(url);
    }

    listarSubFamilia(codigo: any) {
        const url = `${constantesApiWeb.listarSubFamilia}${codigo}`;
        return this.http.get<any>(url);
    }

    traerProductoPorCodigo(codigo: any) {
        const url = `${constantesApiWeb.traerProductoPorCodigo}${codigo}`;
        return this.http.get<any>(url);
    }

    buscarProducto(objeto: any) {
        const url = `${constantesApiWeb.buscarProducto}`;
        console.log('buscarProducto url...', url)
        return this.http.post<any>(url, objeto)
    }

    almacenTraeruno(codigo: any) {
        const url = `${constantesApiWeb.almacenTraeruno}${codigo}`;
        return this.http.get<any>(url);
    }
}