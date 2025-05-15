
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, filter, fromEvent, map, takeUntil } from 'rxjs';

export interface IframeMessage {
  type: string;
  payload: any;
  source?: string;
}


@Injectable({
  providedIn: 'root'
})
export class IframeCommunicationService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private messageReceived$ = new Subject<IframeMessage>();

  constructor() {
    // window objesine gelen mesajları dinlemeye başla
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        takeUntil(this.destroy$),
        filter(event => !!event.data), // boş mesajları filtrele
        map(event => this.parseMessage(event))
      )
      .subscribe(message => {
        console.log('iframe\'den mesaj alındı:', message);
        this.messageReceived$.next(message);
      });
  }

  // Mesajları dinle
  public getMessages(): Observable<IframeMessage> {
    return this.messageReceived$.asObservable();
  }

  // Belirli bir tip için mesajları dinle
  public getMessagesByType(type: string): Observable<IframeMessage> {
    return this.getMessages().pipe(
      filter(message => message.type === type)
    );
  }

  // iframe'e mesaj gönder
  public sendMessageToIframe(iframe: HTMLIFrameElement, message: IframeMessage): void {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    } else {
      console.error('Geçerli bir iframe bulunamadı');
    }
  }

  // Gelen mesajı parse et
  private parseMessage(event: MessageEvent): IframeMessage {
    try {
      // Eğer string bir mesaj geldiyse JSON olarak parse et
      if (typeof event.data === 'string') {
        try {
          return JSON.parse(event.data);
        } catch (error) {
          // Parse edilemezse string mesajı type olarak kullan
          return {
            type: 'text',
            payload: event.data,
            source: event.origin
          };
        }
      }
      // Zaten nesne ise doğrudan kullan
      return {
        ...event.data,
        source: event.origin
      };
    } catch (error) {
      console.error('Mesaj parse edilemedi:', error);
      return {
        type: 'error',
        payload: 'Mesaj işlenemedi',
        source: event.origin
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
