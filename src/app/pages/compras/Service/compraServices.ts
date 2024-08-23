import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { globalVariable } from '@constantes';
import { I_RespuestaProceso } from '@interfaces';

@Injectable()
export class ComprasService {

    constructor(private http: HttpClient) {
        //   this.http.get<any>('assets/demo/data/tasks.json')
        //   .toPromise()
        //   .then(res => res.data as Task[])
        //   .then(data => {
        //       this.tasks = data;
        //       this.taskSource.next(data);
        //   });
    }

    $emitter = new EventEmitter();

    ListaProveedores(objeto: any) {
        const url = `${constantesApiWeb.ListaProveedores}`;
        return this.http.post<any>(url, objeto)
    }

    prcClientes(objeto: any) {
        const url = `${constantesApiWeb.prcClientes}`;
        return this.http.post<any>(url, objeto)
    }

    obtenerTipoDocumento(idtabla: number) {
        const url = `${constantesApiWeb.listaTipoDocumento}${idtabla}`;
        return this.http.get<any>(url);
    }

    prcPersonaCuenta(objeto: any) {
        const url = `${constantesApiWeb.prcPersonaCuenta}`;
        return this.http.post<any>(url, objeto)
    }

    obtenerMonedas() {
        const url = `${constantesApiWeb.kanbanListaMonedas}`;
        return this.http.get<any>(url);
    }

    prcProveedorLinea(objeto: any) {
        const url = `${constantesApiWeb.prcProveedorLinea}`;
        return this.http.post<any>(url, objeto)
    }

    listaPersonaLinea(codigo: any) {
        const url = `${constantesApiWeb.personacuentalist}${codigo}`;
        return this.http.get<any>(url);
    }

    lineaProveedorlist(idtabla: any) {
        const url = `${constantesApiWeb.lineaProveedorlist}${idtabla}`;
        return this.http.get<any>(url);
    }

    ListaContactos(idcliente: any) {
        const url = `${constantesApiWeb.kanbanListaContactos}${idcliente}`;
        return this.http.get<any>(url)
    }

    vigenciaContacto(objeto: any) {
        const url = `${constantesApiWeb.vigenciaContactos}`;
        return this.http.post<any>(url, objeto)
    }

    updateContacto(objeto: any) {
        const url = `${constantesApiWeb.PrcContactos}`;
        return this.http.post<any>(url, objeto)
    }

    listarArchivos(codigo:any) {
        const url = `${constantesApiWeb.listaArchivos}${codigo}`;
        return this.http.get<any>(url);
    }

    eliminarArchivo(objeto: any) {
        const url = `${constantesApiWeb.eliminaradjunto}`;
        return this.http.post<I_RespuestaProceso>(url, objeto);
    }

    downloadArchivo(objeto: any) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
          });

          const url = `${constantesApiWeb.descargaradjunto}`;
          return this.http.post(url,objeto, {
            headers: headers,
            observe: 'response',
            responseType: 'blob'
          })
    }

    subirArchivo(objeto: any) {
        const url = `${constantesApiWeb.uploadfile}`;
        return this.http.post<any>(url, objeto);
    }

    editarArchivo(objeto: any) {
        const url = `${constantesApiWeb.editarAdjunto}`;
        return this.http.post<any>(url, objeto);
    }

    ListarAdjuntoProc(objeto: any) {
        const url = `${constantesApiWeb.listarAdjuntoProc}`;
        return this.http.post<any>(url, objeto);
    }

    obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }

    emitirEvento(dato:any) {
        console.log('emitirEvento...', dato);
        globalVariable.codigoId =  dato;
        this.$emitter.emit(dato);
    }

    prcTerminoPago(objeto: any) {
        const url = `${constantesApiWeb.prcTerminoPago}`;
        return this.http.post<any>(url, objeto)
    }

    activarProveedor(objeto: any) {
        const url = `${constantesApiWeb.activarProveedor}`;
        return this.http.post<any>(url, objeto)
    }

    lineaproveedorDel(codigo: any) {
        const url = `${constantesApiWeb.lineaproveedorDel}${codigo}`;
        return this.http.get<any>(url);
    }

    PersonaCuentaDell(codigo: any) {
        const url = `${constantesApiWeb.PersonaCuentaDell}${codigo}`;
        return this.http.get<any>(url);
    }

    listarFlujo() {
        const url = `${constantesApiWeb.listarFlujo}`;
        return this.http.get<any>(url);
    }  

    grabarRegla(objeto: any) {
        const url = `${constantesApiWeb.grabarRegla}`;
        console.log('url', url);
        return this.http.post<any>(url, objeto);
    }

    listarReglaFlujo() {
        const url = `${constantesApiWeb.listarReglaFlujo}`;
        return this.http.get<any>(url);
    }

    traerUnoReglaFlujo(codigo: any) {
        const url = `${constantesApiWeb.traerUnoReglaFlujo}${codigo}`;
        return this.http.get<any>(url);
    }

    agregarResolutor(objeto: any) {
        const url = `${constantesApiWeb.agregarResolutor}`;
        return this.http.post<any>(url, objeto);
    }

    listarPerfil(objeto: any) {
        const url = `${constantesApiWeb.listarPerfil}`;
        return this.http.post<any>(url, objeto);
    }

    listarResolutor(codigo: any) {
        const url = `${constantesApiWeb.listarResolutor}${codigo}`;
        return this.http.get<any>(url);
    }

    eliminarResolutor(objeto: any) {
        const url = `${constantesApiWeb.eliminarResolutor}`;
        return this.http.post<any>(url, objeto);
    }
}