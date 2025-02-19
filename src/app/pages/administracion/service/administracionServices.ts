import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class AdministracionService {

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
  
}