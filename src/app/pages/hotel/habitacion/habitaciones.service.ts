import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  constructor(private http: HttpClient) { }

  listarhabitacion(objeto: any) {
    const url = `${constantesApiWeb.listarhabitacion}`;
    return this.http.post<any>(url, objeto)
  }
  
}