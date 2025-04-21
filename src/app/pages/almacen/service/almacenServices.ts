import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class AlmacenService {

    constructor(private http: HttpClient) {   }

    ListarAlamcen(objeto: any) {
        const url = `${constantesApiWeb.ListarAlamcen}`;
        return this.http.post<any>(url, objeto)
    }

    GrabarAlamcen(objeto: any) {
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
        return this.http.post<any>(url, objeto)
    }

    almacenTraeruno(codigo: any) {
        const url = `${constantesApiWeb.almacenTraeruno}${codigo}`;
        return this.http.get<any>(url);
    }

    traerunoFamilia(codigo: any) {
        const url = `${constantesApiWeb.traerunoFamilia}${codigo}`;
        console.log('traerunoFamilia url...', url)
        return this.http.get<any>(url);
    }

    traerunoSubFamilia(codigo: any) {
        const url = `${constantesApiWeb.traerunoSubFamilia}${codigo}`;
        return this.http.get<any>(url);
    }

    prcFamilia(objeto: any) {
        const url = `${constantesApiWeb.prcFamilia}`;
        return this.http.post<any>(url, objeto)
    }

    prcSubFamilia(objeto: any) {
        const url = `${constantesApiWeb.prcSubFamilia}`;
        return this.http.post<any>(url, objeto)
    }

    oficinaTraeruno(codigo: any) {
        const url = `${constantesApiWeb.oficinaTraeruno}${codigo}`;
        return this.http.get<any>(url);
    }

    grabarOficina(objeto: any) {
        const url = `${constantesApiWeb.grabarOficina}`;
        return this.http.post<any>(url, objeto)
    }

    ListarOficina(objeto: any) {
        const url = `${constantesApiWeb.ListarOficina}`;
        console.log('ListarOficina url...', url)
        return this.http.post<any>(url, objeto)
    }

    buscarProducto03(objeto: any) {
        const url = `${constantesApiWeb.buscarProducto03}`;
        return this.http.post<any>(url, objeto)
    }

    traerUbicaciones(codigo: any) {
        const url = `${constantesApiWeb.traerUbicaciones}${codigo}`;
        return this.http.get<any>(url);
    }

    prcUbicaciones(objeto: any) {
        const url = `${constantesApiWeb.UbicacionAlmacenPrc}`;
        return this.http.post<any>(url, objeto)
    }

    obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }
    
}