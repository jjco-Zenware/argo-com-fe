import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class ContabilidadService {

    constructor(private http: HttpClient) {   }

    listarPlanContable() {
        const url = `${constantesApiWeb.listarPlanContable}`;
        return this.http.get<any>(url)
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

    listarItemsTablaSunat(codigo: any) {
        const url = `${constantesApiWeb.listaritemTablaSunat}${codigo}`;
        return this.http.get<any>(url)
    }

    listarTipoTransporteTablaSunat() {
        const url = `${constantesApiWeb.listarTipoTransporteTablaSunat}`;
        return this.http.get<any>(url)
    }

    listarMotivoTrasladoTablaSunat() {
        const url = `${constantesApiWeb.listarMotivoTrasladoTablaSunat}`;
        return this.http.get<any>(url)
    }

    listarTipoDocumentoTablaSunat(codigo: any) {
        const url = `${constantesApiWeb.listarTipoDocumentoTablaSunat}${codigo}`;
        return this.http.get<any>(url)
    }

    plancontablePrc(objeto: any) {
        const url = `${constantesApiWeb.plancontablePrc}`;
        return this.http.post<any>(url, objeto)
    }
    
    listarItemsTabla(codigo: any) {
        const url = `${constantesApiWeb.lstItemsTabla}${codigo}`;
        return this.http.get<any>(url)
    }

    listarCategoriasDoc(codigo: any) {
        const url = `${constantesApiWeb.lstCategoriasDoc}${codigo}`;
        return this.http.get<any>(url)
    }

    listarAmarreContable(objeto: any) {
        const url = `${constantesApiWeb.listarAmarreContable}`;
        return this.http.post<any>(url, objeto)
    }

    listarDocumentoPrc() {
        const url = `${constantesApiWeb.listarDocumentoPrc}`;
        return this.http.get<any>(url)
    }

    amarrecontablePrc(objeto: any) {
        const url = `${constantesApiWeb.amarrecontablePrc}`;
        return this.http.post<any>(url, objeto)
    }

     obtenerItemsTabla(id:number) {
        const url = `${constantesApiWeb.lstItemsTabla}${id}`;
        return this.http.get<any>(url);
    }

    traerunoAsiento(codigo: any) {
        const url = `${constantesApiWeb.asientocfgTraeruno}${codigo}`;
        return this.http.get<any>(url);
    }

     asientoPrc(objeto: any) {
        const url = `${constantesApiWeb.asientoPrc}`;
        return this.http.post<any>(url, objeto)
    } 
    
}