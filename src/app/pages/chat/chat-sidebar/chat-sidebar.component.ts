import { Component, OnInit } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { User } from '@interfaces';

@Component({
    selector: 'app-chat-sidebar',
    templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {

    searchValue: string = '';

    users: User[] = [];

    filteredUsers: User[] = [];

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {
        /*this.chatService.getChatData().then(data => {
            this.users = data;
            this.filteredUsers = this.users;
            console.log("filteredUsers miky : ", JSON.stringify(this.filteredUsers));
        });*/
    }

    filter() {
        let filtered: User[] = [];
        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];
            if (user.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
                filtered.push(user)
            }
        }

        this.filteredUsers = [...filtered];
    }

}
