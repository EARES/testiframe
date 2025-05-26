import {
  Component,
  signal,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { MessageSender } from '../../models/chat.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-white">
      <!-- Chat Header -->
      <div class="border-b border-gray-200 p-4 bg-blue-50">
        <div class="flex items-center space-x-3 justify-between">
          <div class="flex items-center">
            <div
              class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-medium">VAI</span>
            </div>
            <div class="ms-3">
              <h2 class="font-semibold text-gray-900">Velocity AI Assistant</h2>
              <p
                class="text-sm text-gray-500"
                [class.text-green-500]="chatService.state().isConnected"
              >
                {{ chatService.state().isConnected ? 'Online' : 'Offline' }}
              </p>
            </div>
          </div>
             <a class="underline" routerLink="/iframe" >Go Iframe Test Component</a>
        </div>
      </div>

      <!-- Messages Area -->
      <div
        #messagesContainer
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        @if (chatService.state().messages.length === 0) {
        <div class="text-center text-gray-500 mt-8">
          <p class="text-lg">👋 Hello! How can I help you today?</p>
          <p class="text-sm mt-2">
            Start a conversation by typing a message below.
          </p>
        </div>
        } @for (message of chatService.state().messages; track message.id) {
        <div
          class="flex"
          [class.justify-end]="message.sender === MessageSender.USER"
          [class.justify-start]="message.sender === MessageSender.AI"
        >
          <div
            class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm"
            [class]="getMessageClasses(message.sender)"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>

            <p class="text-xs mt-1 opacity-70">
              {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>
        } @if (chatService.state().isTyping) {
        <div class="flex justify-start">
          <div class="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <div class="flex space-x-1">
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.1s"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              ></div>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Message Input -->
      <div class="border-t border-gray-200 p-4 bg-white">
        <form (ngSubmit)="sendMessage()" class="flex space-x-2">
          <input
            type="text"
            [(ngModel)]="messageInput"
            name="message"
            placeholder="Type your message..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            [disabled]="chatService.state().isTyping"
            #messageInputRef
          />
          <button
            type="submit"
            [disabled]="!messageInput().trim() || chatService.state().isTyping"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  `,
})
export class ChatComponent {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInputRef') messageInputRef!: ElementRef;

  readonly MessageSender = MessageSender;
  messageInput = signal('');

  constructor(public chatService: ChatService) {
    // Auto-scroll to bottom when new messages arrive
    effect(() => {
      const messages = this.chatService.state().messages;
      if (messages.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  async sendMessage(): Promise<void> {
    const message = this.messageInput().trim();
    if (!message) return;

    await this.chatService.sendMessage(message);
    this.messageInput.set('');
    this.messageInputRef.nativeElement.focus();
  }

  getMessageClasses(sender: MessageSender): string {
    return sender === MessageSender.USER
      ? 'bg-blue-500 text-white'
      : 'bg-white text-gray-900 border border-gray-200';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
