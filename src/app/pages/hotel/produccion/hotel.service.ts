import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  constructor(private http: HttpClient) { }

  listarProduccionHotel(objeto: any) {
    const url = `${constantesApiWeb.listarProduccionHotel}`;
    return this.http.post<any>(url, objeto)
  }
}
