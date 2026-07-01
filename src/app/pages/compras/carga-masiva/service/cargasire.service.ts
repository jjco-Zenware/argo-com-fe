import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable()
export class CargaSireService {
    constructor(private http: HttpClient) {}

    cargaSirePrc(objeto: any) {
        return this.http.post<any>(constantesApiWeb.cargasirePrc, objeto);
    }

    cargaSireList(objeto: any) {
        return this.http.post<any>(constantesApiWeb.cargasireList, objeto);
    }

    cargaSireDetalleList(idcargasire: number) {
        return this.http.get<any>(`${constantesApiWeb.cargasireDetalleList}${idcargasire}`);
    }

    cargaSireErrorList(idcargasire: number) {
        return this.http.get<any>(`${constantesApiWeb.cargasireErrorList}${idcargasire}`);
    }
}
