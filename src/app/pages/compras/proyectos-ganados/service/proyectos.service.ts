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

   
    listarCasoNegocio(objeto: any) {
        const url = `${constantesApiWeb.listarCasoNegocio}`;
        return this.http.post<any>(url, objeto);
    }

    listarCotizaciones(idOportunidad:string) {
        const url = `${constantesApiWeb.lstCotizacion}${idOportunidad}`;
        return this.http.get<any>(url);
    }

    obtenerMontoOportunidad(idOportunidad:string) {
        const url = `${constantesApiWeb.obtenerMonto}${idOportunidad}`;
        return this.http.get<any>(url);
    }

    obtenerClientes(tipoRol:string) {
        const url = `${constantesApiWeb.ListaClientes}${tipoRol}`;
        return this.http.get<any>(url);
    }

    obtenerOportunidadXCliente(objeto:any) {
        const url = `${constantesApiWeb.obtenerOportunidadXCliente}`;
        return  this.http.post<any>(url, objeto)
    }

    listarProyecto(objeto:any) {
        const url = `${constantesApiWeb.listProyecto}`;
        return  this.http.post<any>(url, objeto)
    }

    newProyecto(objeto:any) {
        const url = `${constantesApiWeb.newProyecto}`;
        return  this.http.post<any>(url, objeto)
    }

    obtenerMonedas() {
        const url = `${constantesApiWeb.kanbanListaMonedas}`;
        return this.http.get<any>(url);
    }

    procesarCotizacion(objeto:any) {
        const url = `${constantesApiWeb.prcCotizacion}`;
            return  this.http.post<any>(url, objeto)
    }

    listarCotizacionUno(idcotiza:number) {
        const url = `${constantesApiWeb.lstCotizacionUno}${idcotiza}`;
        return this.http.get<any>(url);
    }

    prcClientes(objeto: any) {
        console.log("prcClientes : ", objeto);
        const url = `${constantesApiWeb.prcClientes}`;
        return this.http.post<any>(url, objeto)
    }

    ListaContactos(idcliente: any) {
        const url = `${constantesApiWeb.kanbanListaContactos}${idcliente}`;
        return this.http.get<any>(url)
    }

    obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }

    obtenerTipoProducto() {
        const url = `${constantesApiWeb.lstProducto}`;
        return this.http.get<any>(url);
    }

    obtenerMarcas() {
        const url = `${constantesApiWeb.lstMarca}`;
        return this.http.get<any>(url);
    }

    procesarMarca(objeto:any) {
        const url = `${constantesApiWeb.prcMarca}`;
            return  this.http.post<any>(url, objeto)
    }

    oportunidadTraeruno(idportunidad:string) {
        const url = `${constantesApiWeb.oportunidadTraeruno}${idportunidad}`;
        return this.http.get<any>(url);
    }

    procesarOC(objeto:any) {
        const url = `${constantesApiWeb.ordencompraprc}`;
            return  this.http.post<any>(url, objeto)
    }

    ordenCompraProyectoList(codigo:any) {
        const url = `${constantesApiWeb.ordenCompraProyectoList}${codigo}`;
        return this.http.get<any>(url);
    }

    ordenCompraList(objeto:any) {
        const url = `${constantesApiWeb.ordenCompralist}`;
            return  this.http.post<any>(url, objeto)
    }

    proyectotraeruno(objeto: any) {
        const url = `${constantesApiWeb.proyectotraeruno}`;
        return this.http.post<any>(url, objeto)
    }

    updProyecto(objeto:any) {
        const url = `${constantesApiWeb.updProyecto}`;
        return  this.http.post<any>(url, objeto)
    }

    ordenCompraTraeruno(objeto:any) {
        const url = `${constantesApiWeb.ordenCompraTraeruno}`;
            return  this.http.post<any>(url, objeto)
    }

    tipoProyectoList() {
        const url = `${constantesApiWeb.tipoProyectoList}`;
        return this.http.get<any>(url);
    } 

    prcItem(objeto:any) {
        const url = `${constantesApiWeb.prcItem}`;
        return  this.http.post<any>(url, objeto)
    }

    obtenerOportunidadCliente(objeto:any) {
        const url = `${constantesApiWeb.obtenerOportunidadCliente}`;
        return  this.http.post<any>(url, objeto)
    }
    
}
