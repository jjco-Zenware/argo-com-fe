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
}