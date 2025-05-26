import { Injectable, signal } from '@angular/core';
import { Message, MessageSender, MessageStatus, ChatState } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly chatState = signal<ChatState>({
    messages: [],
    isTyping: false,
    isConnected: true
  });

  readonly state = this.chatState.asReadonly();

  async sendMessage(content: string): Promise<void> {
    const userMessage: Message = {
      id: this.generateId(),
      content: content.trim(),
      sender: MessageSender.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    this.addMessage(userMessage);
    this.setTyping(true);

    try {
      // Simulate AI response delay
      await this.delay(1000 + Math.random() * 2000);

      const aiResponse = this.generateAIResponse(content);
      const aiMessage: Message = {
        id: this.generateId(),
        content: aiResponse,
        sender: MessageSender.AI,
        timestamp: new Date(),
        status: MessageStatus.SENT
      };

      this.addMessage(aiMessage);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      this.setTyping(false);
    }
  }

  private addMessage(message: Message): void {
    this.chatState.update(state => ({
      ...state,
      messages: [...state.messages, message]
    }));
  }

  private setTyping(isTyping: boolean): void {
    this.chatState.update(state => ({
      ...state,
      isTyping
    }));
  }

  private generateAIResponse(userInput: string): string {
    const responses = [
      "That's an interesting point! Let me think about that...",
      "I understand what you're asking. Here's my perspective:",
      "Thanks for sharing that with me. I'd say:",
      "Great question! Based on what you've told me:",
      "I appreciate you bringing that up. My thoughts are:"
    ];

    const topics = {
      weather: "The weather can really affect our mood and plans, can't it?",
      code: "Programming is such a creative and logical pursuit at the same time!",
      help: "I'm here to help! What specifically would you like assistance with?",
      default: "That's really interesting. Could you tell me more about what you're thinking?"
    };

    const lowerInput = userInput.toLowerCase();
    let response = responses[Math.floor(Math.random() * responses.length)];

    if (lowerInput.includes('weather')) {
      response += " " + topics.weather;
    } else if (lowerInput.includes('code') || lowerInput.includes('program')) {
      response += " " + topics.code;
    } else if (lowerInput.includes('help')) {
      response += " " + topics.help;
    } else {
      response += " " + topics.default;
    }

    return response;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
