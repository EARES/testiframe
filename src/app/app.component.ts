import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IframeCommunicationService } from './iframe-communication.service';

export interface IframeMessage {
  type: string;
  payload: any;
  source?: string;
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit, OnDestroy {
  title = 'testiframe';
 @Input() iframeSrc!: string;
  @Input() iframeTitle: string = 'Iframe İçeriği';

  @ViewChild('iframeElement') iframeElement!: ElementRef<HTMLIFrameElement>;

  private destroy$ = new Subject<void>();
  private iframeService = inject(IframeCommunicationService);

  ngOnInit(): void {
    // Tüm iframe mesajlarını dinle
    this.iframeService.getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.handleIframeMessage(message);
      });
  }

  // iframe'den gelen mesajları işle
  private handleIframeMessage(message: IframeMessage): void {
    console.log('iframe mesajı işleniyor:', message);

    // Mesaj tipine göre farklı işlemler yapabilirsiniz
    switch(message.type) {
      case 'action':
        console.log('Aksiyon alındı:', message.payload);
        break;
      case 'notification':
        console.log('Bildirim alındı:', message.payload);
        break;
      default:
        console.log('Bilinmeyen mesaj tipi:', message.type, message.payload);
    }
  }

  // iframe'e mesaj gönder
  public sendMessageToIframe(message: IframeMessage): void {
    if (this.iframeElement?.nativeElement) {
      this.iframeService.sendMessageToIframe(
        this.iframeElement.nativeElement,
        message
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
