import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class CatalogoProductoService {

  constructor(private http: HttpClient) { }

  productoComponentePRC(objeto: any) {
    const url = `${constantesApiWeb.productoComponentePRC}`;
    return this.http.post<any>(url, objeto)
  }
}
