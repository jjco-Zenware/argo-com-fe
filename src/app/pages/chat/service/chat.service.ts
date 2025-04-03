import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { Message, User } from '@interfaces';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class ChatService {

    /*_activeUser: User = {
        "id": 1,
        "name": "Ioni Bowcher",
        "image": "ionibowcher.png",
        "status": "active",
        "messages": [
            {
                "text": " hola Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                "ownerId": 1,
                "createdAt": 1652646338240
            },
            {
                "text": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                "ownerId": 1,
                "createdAt": 1652646368718
            },
            {
                "text": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                "ownerId": 123,
                "createdAt": 1652646368718
            },
        ],
        "lastSeen": "2d"
    }*/
    _activeUser: User = {
        "id": 1,
        "name": "Miguel Rodriguez",
        "image": "avatar-9.png",
        "status": "active",
        "messages": [
            /*{
                "text": " hola Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                "ownerId": 1,
                "createdAt": 1652646338240
            },
            {
                "text": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                "ownerId": 1,
                "createdAt": 1652646368718
            },
            {
                "text": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
                "ownerId": 123,
                "createdAt": 1652646368718
            },*/
        ],
        "lastSeen": "2d"
    }


    private activeUser = new BehaviorSubject<Partial<User>>(this._activeUser);

    activeUser$ = this.activeUser.asObservable();

    constructor(private http: HttpClient) { }

    /*getChatData() {
        return this.http.get<any>('assets/demo/data/chat.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }*/

    changeActiveChat(user: User) {
        this._activeUser = user;
        this.activeUser.next(user);
    }

    sendMessage(message: Message) {
        this._activeUser?.messages?.push(message);
        //console.log("sendMessage miky : ", JSON.stringify(this._activeUser));
        this.activeUser.next(this._activeUser);
    }

    obtenerRespuestaOpenAI(objeto: any) {
        const url = `${constantesApiWeb.searchDocumentoVector}`;
        return this.http.post<any>(url, objeto)
    }
}
