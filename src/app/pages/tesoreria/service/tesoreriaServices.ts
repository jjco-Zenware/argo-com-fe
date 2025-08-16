import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { map } from 'rxjs';

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

    prcBanco(objeto: any) {
        const url = `${constantesApiWeb.prcBanco}`;
        return this.http.post<any>(url, objeto)
    }

    listarBanco() {
        const url = `${constantesApiWeb.listarBanco}`;
        return this.http.get<any>(url)
    }

    traerunoBanco(codigo: any) {
        const url = `${constantesApiWeb.traerunoBanco}${codigo}`;
        return this.http.get<any>(url);
    }

    prcProgramacion(objeto: any) {
        const url = `${constantesApiWeb.prcProgramacion}`;
        return this.http.post<any>(url, objeto)
    }

    listarProgramacion(objeto: any) {
        const url = `${constantesApiWeb.listarProgramacion}`;
        return this.http.post<any>(url, objeto)
    }

    prcProgramacionDet(objeto: any) {
        const url = `${constantesApiWeb.prcProgramacionDet}`;
        return this.http.post<any>(url, objeto)
    }

    traerunoprcProgramacion(codigo: any) {
        const url = `${constantesApiWeb.traerunoprcProgramacion}${codigo}`;
        return this.http.get<any>(url);
    }

    listarCentroCosto() {
        const url = `${constantesApiWeb.listarCentroCosto}`;
        return this.http.get<any>(url)
    }

    prcCentroCosto(objeto: any) {
        const url = `${constantesApiWeb.prcCentroCosto}`;
        return this.http.post<any>(url, objeto)
    }

    eliminarCentroCosto(codigo: any) {
        const url = `${constantesApiWeb.eliminarCentroCosto}${codigo}`;
        return this.http.get<any>(url);
    }

    prcPagoDocumento(objeto: any) {
        const url = `${constantesApiWeb.prcPagoDocumento}`;
        return this.http.post<any>(url, objeto)
    }

    listPagoDocumento(objeto: any) {
        const url = `${constantesApiWeb.listPagoDocumento}`;
        return this.http.post<any>(url, objeto)
    }

    traerunoPagoDocumento(codigo: any) {
        const url = `${constantesApiWeb.traerunoPagoDocumento}${codigo}`;
        return this.http.get<any>(url);
    }

    pagodocextornoprc(objeto: any) {
        const url = `${constantesApiWeb.pagodocextornoprc}`;
        return this.http.post<any>(url, objeto)
    }

    exportarexcelcuentas(data: any) {
    const url = `${constantesApiWeb.exportarexcelcuentas}`;
    return this.http
        .post<Blob>(url, data, { responseType: 'blob' as 'json' })
        .pipe(
        map((resp: Blob) => resp));
    }

    exportarexcelcuentaspc(data: any) {
    const url = `${constantesApiWeb.exportarexcelcuentaspc}`;
    return this.http
        .post<Blob>(url, data, { responseType: 'blob' as 'json' })
        .pipe(
        map((resp: Blob) => resp));
    }

    updateFechaProgramacion(objeto: any) {
        const url = `${constantesApiWeb.updateFechaProgramacion}`;
        return this.http.post<any>(url, objeto)
    }

    exportarExcelpagosprogramados(data: any) {
        const url = `${constantesApiWeb.exportarExcelpagosprogramados}`;
        return this.http
            .post<Blob>(url, data, { responseType: 'blob' as 'json' })
            .pipe(
            map((resp: Blob) => resp));
        }

    listarFlujoCaja(codigo: any) {
        const url = `${constantesApiWeb.listarFlujoCaja}${codigo}`;
        return this.http.get<any>(url);
    }
}