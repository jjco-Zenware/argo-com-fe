import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { User, Message } from '@interfaces';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {

    @Input() user!: User;

    lastMessage!: Message;

    constructor(private chatService: ChatService) { }

    ngOnInit(): void {
        let filtered = this.user.messages.filter(m => m.ownerId !== 123)
        this.lastMessage = filtered[filtered.length - 1];
    }

    changeView(user: User) {
        this.chatService.changeActiveChat(user);
    }
}
