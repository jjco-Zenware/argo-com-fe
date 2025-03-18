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

    ordenCompraprc(objeto:any) {
        const url = `${constantesApiWeb.ordencompraprc}`;
            return  this.http.post<any>(url, objeto)
    }

    tipoProyectoList() {
        const url = `${constantesApiWeb.tipoProyectoList}`;
        return this.http.get<any>(url);
    } 

    portipoProyectoList(codigo:any) {
        const url = `${constantesApiWeb.portipoProyectoList}${codigo}`;
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

    listarCotizacionUno(idcotiza:number) {
        const url = `${constantesApiWeb.lstCotizacionUno}${idcotiza}`;
        return this.http.get<any>(url);
    }

    ListaClientes(objeto: any) {
        const url = `${constantesApiWeb.ListaClientes}`;
        return this.http.post<any>(url, objeto)
    }

    obtenerMonedas() {
        const url = `${constantesApiWeb.kanbanListaMonedas}`;
        return this.http.get<any>(url);
    }

    obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }

    procesarTrx(objeto:any) {
        const url = `${constantesApiWeb.procesarTrx}`;
            return  this.http.post<any>(url, objeto)
    }

    prcDocumento(objeto:any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.prcDocumento}`;
          return this.http.post(url,objeto, {
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    descargarPlantilla(id:any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.descargarPlantilla}${id}`;
          return this.http.get(url,{
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    altaContacto(objeto: any) {
        const url = `${constantesApiWeb.PrcContactos}`;
        return this.http.post<any>(url, objeto)
    }

    ordencompraaprobadasprovlist(idproveedor:any) {
        const url = `${constantesApiWeb.ordencompraaprobadasprovlist}${idproveedor}`;
        return this.http.get<any>(url);
    }

    buscarporRUC(objeto:any) {
        const url = `${constantesApiWeb.buscarporRUC}`;
            return  this.http.post<any>(url, objeto)
    }

    prcReporte(objeto:any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.prcReporte}`;
          return this.http.post(url,objeto, {
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    prcClientes(objeto: any) {
        console.log("prcClientes : ", objeto);
        const url = `${constantesApiWeb.prcClientes}`;
        return this.http.post<any>(url, objeto)
    }

    listarBanco() {
        const url = `${constantesApiWeb.listarBanco}`;
        return this.http.get<any>(url)
    }

    prcDocumentoDet(objeto:any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.prcDocumentoDet}`;
          return this.http.post(url,objeto, {
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    postordocumentoseleccionacotiza(objeto:any) {
        const url = `${constantesApiWeb.postordocumentoseleccionacotiza}`;
            return  this.http.post<any>(url, objeto)
    }
    
    prcDocumentoDet2(objeto:any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.prcDocumentoDet2}`;
          return this.http.post(url,objeto, {
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    ordencompraaprobadasprovlistSal(idproveedor:any) {
        const url = `${constantesApiWeb.ordencompraaprobadasprovlistsal}${idproveedor}`;
        return this.http.get<any>(url);
    }
}