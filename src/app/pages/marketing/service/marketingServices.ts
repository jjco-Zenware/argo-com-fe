import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { tap } from 'rxjs';

@Injectable()
export class MarketingService {

    constructor(private http: HttpClient) {   }
   
    listaVinculados(codigo: any) {
        const url = `${constantesApiWeb.listavinculados}${codigo}`;
        return this.http.get<any>(url);
    }

    listaDatosLaboral(codigo: any) {
        const url = `${constantesApiWeb.listadatoslaborales}${codigo}`;
        return this.http.get<any>(url);
    }

    prcVinculado(objeto: any) {
        const url = `${constantesApiWeb.prcVinculado}`;
        return this.http.post<any>(url, objeto)
    }

    prcDatosLaborales(objeto: any) {
        const url = `${constantesApiWeb.prcDatosLaborales}`;
        return this.http.post<any>(url, objeto)
    }

    delVinculado(objeto: any) {
        const url = `${constantesApiWeb.delVinculado}`;
        return this.http.post<any>(url, objeto);
    }

    delDatosLaborales(objeto: any) {
        const url = `${constantesApiWeb.delDatosLaborales}`;
        return this.http.post<any>(url, objeto);
    }

    listaEstadoLab() {
        const url = `${constantesApiWeb.listaEstadoLab}`;
        return this.http.get<any>(url);
    }
    obtenerClientes(tipoRol:string) {
        const url = `${constantesApiWeb.ListaClientes}${tipoRol}`;
        return this.http.get<any>(url);
    }

    ListaContactos(idcliente: any) {
        const url = `${constantesApiWeb.kanbanListaContactos}${idcliente}`;
        return this.http.get<any>(url)
    }

    obtenerMonedas() {
        const url = `${constantesApiWeb.kanbanListaMonedas}`;
        return this.http.get<any>(url);
    }

    obtenerUsuarios() {
        const url = `${constantesApiWeb.kanbanListaUsuarios}`;
        return this.http.get<any>(url);
    }

    listarUsuarios(objeto:any) {
        const url = `${constantesApiWeb.listarUsuario}`;
        return  this.http.post<any>(url, objeto)
    }

    prcFondosTrimestrales(objeto: any) {
        const url = `${constantesApiWeb.prcFondosTrimestrales}`;
        return this.http.post<any>(url, objeto)
    }

    listarFondosTrimestrales(objeto: any) {
        const url = `${constantesApiWeb.listarFondosTrimestrales}`;
        return this.http.post<any>(url, objeto)
    }

    prcEventos(objeto: any) {
        const url = `${constantesApiWeb.prcEventos}`;
        return this.http.post<any>(url, objeto)
    }

    kanbanEventoList(objeto:any) {
        const url = `${constantesApiWeb.listEventos}`;
          return  this.http.post<any>(url, objeto)
        //   .pipe(
        //     tap((data: any) => {
        //         console.log("kanbanList 00 : ", data);
        //         this.updateLists(data.listas);
        //       }),
        //     );
    }

    procesarTrxEvento(objeto:any) {
        const url = `${constantesApiWeb.procesarTrxEvento}`;
            return  this.http.post<any>(url, objeto)
    }

    newProyecto(objeto:any) {
        const url = `${constantesApiWeb.newProyecto}`;
        return  this.http.post<any>(url, objeto)
    }

    obtenerToken() {
        const url = `${constantesApiWeb.obtenerToken}`;
        return this.http.get<any>(url);
    }

    enviarCorreo() {
        const url = `${constantesApiWeb.enviarCorreo}`;
        return this.http.get<any>(url);
    }

    listarGastos(objeto: any) {
        const url = `${constantesApiWeb.listarGastos}`;
        return this.http.post<any>(url, objeto)
    }

    listarItemsTabla(codigo: any) {
        const url = `${constantesApiWeb.lstItemsTabla}${codigo}`;
        return this.http.get<any>(url)
    }

    listarTrasacciones(codigo: any) {
        const url = `${constantesApiWeb.listarTrasacciones}${codigo}`;
        return this.http.get<any>(url)
    }

    gastoTraeruno(codigo:any) {
        const url = `${constantesApiWeb.gastosTraeruno}${codigo}`;
            return  this.http.get<any>(url)
    }

    gastoprc(objeto:any) {
        const url = `${constantesApiWeb.prcGastos}`;
        return  this.http.post<any>(url, objeto)
    }
}