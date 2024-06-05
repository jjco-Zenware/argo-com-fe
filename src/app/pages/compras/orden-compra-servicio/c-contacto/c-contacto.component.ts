import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { globalVariable, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-contacto-oc',
  templateUrl: './c-contacto.component.html',
  styleUrls: ['./c-contacto.component.scss']
})
export class CContactoComponent {
  $listSubcription: Subscription[] = [];
  //@Input() IA_codigo: any;

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listaContacto: any;
  lsContactosProvee: any;
  idcontacto: any;

  constructor(
    private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private comprasService: ComprasService,
     private serviceSharedApp: SharedAppService,
  ) {
    
  }
  ngOnInit(): void { 
    this.getContactos();
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }


  getContactos() {  
    const $personaProveedorlist = this.comprasService.ListaContactos(globalVariable.codigoId).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.listaContacto = rpta;
        },
        error: (err) => {
            this.setSpinner(false);
            console.info('error : ', err);
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: mensajesQuestion.msgErrorGenerico,
            });
        },
        complete: () => {},
    });
    this.$listSubcription.push($personaProveedorlist);
  }

  eliminarContacto(){}

  agregarContacto(){}

}
