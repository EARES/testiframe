import { Component, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

// Domain Models
interface WeatherData {
  icon: string;
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: Date;
}

interface ModalState {
  isOpen: boolean;
  isAnimating: boolean;
}

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Regular Widget View -->
    <div class="bg-white rounded-lg shadow-lg p-6 h-fit" [class.hidden]="modalState().isOpen">
      <!-- Widget Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Weather</h3>
        <div class="flex gap-2">
          <button
            (click)="refreshWeather()"
            [disabled]="weatherService.isLoading()"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh weather"
          >
            <svg
              class="w-4 h-4"
              [class.animate-spin]="weatherService.isLoading()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
          <button
            (click)="openFullscreen()"
            [disabled]="weatherService.isLoading()"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Open fullscreen view"
          >
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18 4.654v.291a10 10 0 0 0-1.763 1.404l-2.944 2.944a1 1 0 0 0 1.414 1.414l2.933-2.932A9.995 9.995 0 0 0 19.05 6h.296l-.09.39A9.998 9.998 0 0 0 19 8.64v.857a1 1 0 1 0 2 0V4.503a1.5 1.5 0 0 0-1.5-1.5L14.5 3a1 1 0 1 0 0 2h.861a10 10 0 0 0 2.249-.256l.39-.09zM4.95 18a10 10 0 0 1 1.41-1.775l2.933-2.932a1 1 0 0 1 1.414 1.414l-2.944 2.944A9.998 9.998 0 0 1 6 19.055v.291l.39-.09A9.998 9.998 0 0 1 8.64 19H9.5a1 1 0 1 1 0 2l-5-.003a1.5 1.5 0 0 1-1.5-1.5V14.5a1 1 0 1 1 2 0v.861a10 10 0 0 1-.256 2.249l-.09.39h.295z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Widget Weather Content -->
      <div [innerHTML]="renderWeatherContent()"></div>
    </div>

    <!-- Fullscreen Modal -->
    @if (modalState().isOpen) {
      <!-- Modal Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        [class.opacity-0]="modalState().isAnimating"
        [class.opacity-100]="!modalState().isAnimating"
        (click)="closeFullscreen()"
      ></div>

      <!-- Modal Content -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
        [class.scale-95]="modalState().isAnimating"
        [class.scale-100]="!modalState().isAnimating"
        [class.opacity-0]="modalState().isAnimating"
        [class.opacity-100]="!modalState().isAnimating"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Weather Details</h2>
            <div class="flex gap-2">

              <button
                (click)="closeFullscreen()"
                class="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close fullscreen view"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Weather Content -->
          <div class="p-8">
            @if (weatherService.isLoading()) {
              <div class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p class="text-gray-500 mt-4 text-lg">Loading weather...</p>
              </div>
            } @else if (weatherService.errorMessage()) {
              <div class="text-center py-12">
                <div class="text-red-500 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <p class="text-red-600 text-lg">{{ weatherService.errorMessage() }}</p>
              </div>
            } @else if (weatherService.data()) {
              <!-- Enhanced Weather Content for Modal -->
              <div class="text-center">
                <!-- Weather Icon & Temperature - Larger -->
                <div class="mb-8">
                  <div class="text-8xl mb-4">{{ weatherService.data()!.icon }}</div>
                  <div class="text-6xl font-bold text-gray-900 mb-2">
                    {{ weatherService.data()!.temperature }}°C
                  </div>
                  <div class="text-xl text-gray-600 capitalize">
                    {{ weatherService.data()!.condition }}
                  </div>
                </div>

                <!-- Location - Enhanced -->
                <div class="mb-8 pb-6 border-b border-gray-200">
                  <div class="flex items-center justify-center gap-2 text-xl text-gray-700 font-medium">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ weatherService.data()!.location }}
                  </div>
                </div>

                <!-- Weather Details Grid - Enhanced -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div class="bg-blue-50 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-2">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                      <span class="text-lg font-semibold text-blue-900">Humidity</span>
                    </div>
                    <p class="text-3xl font-bold text-blue-800">{{ weatherService.data()!.humidity }}%</p>
                  </div>

                  <div class="bg-green-50 rounded-xl p-6">
                    <div class="flex items-center gap-3 mb-2">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      <span class="text-lg font-semibold text-green-900">Wind Speed</span>
                    </div>
                    <p class="text-3xl font-bold text-green-800">{{ weatherService.data()!.windSpeed }} km/h</p>
                  </div>
                </div>

                <!-- Last Updated - Enhanced -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <div class="flex items-center justify-center gap-2 text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm">
                      Last updated: {{ formatLastUpdated(weatherService.data()!.lastUpdated) }}
                    </span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class WeatherWidgetComponent {
  // Modal state management using signals
  protected readonly modalState = signal<ModalState>({
    isOpen: false,
    isAnimating: false
  });

  constructor(public weatherService: WeatherService) {
    // Effect to handle body scroll lock when modal is open
    effect(() => {
      if (this.modalState().isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Keyboard event handler for ESC key
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.modalState().isOpen) {
      this.closeFullscreen();
    }
  }

  async refreshWeather(): Promise<void> {
    await this.weatherService.refreshWeather();
  }

  formatLastUpdated(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  }

  openFullscreen(): void {
    this.modalState.set({
      isOpen: true,
      isAnimating: true
    });

    // Remove animation class after animation completes
    setTimeout(() => {
      this.modalState.update(state => ({
        ...state,
        isAnimating: false
      }));
    }, 50);
  }

  closeFullscreen(): void {
    this.modalState.update(state => ({
      ...state,
      isAnimating: true
    }));

    // Close modal after animation completes
    setTimeout(() => {
      this.modalState.set({
        isOpen: false,
        isAnimating: false
      });
    }, 300);
  }

  // Render weather content for the widget view
  protected renderWeatherContent(): string {
    if (this.weatherService.isLoading()) {
      return `
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="text-gray-500 mt-2">Loading weather...</p>
        </div>
      `;
    }

    if (this.weatherService.errorMessage()) {
      return `
        <div class="text-center py-8">
          <div class="text-red-500 mb-2">
            <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-red-600 text-sm">${this.weatherService.errorMessage()}</p>
        </div>
      `;
    }

    const data = this.weatherService.data();
    if (data) {
      return `
        <div class="text-center">
          <div class="mb-4">
            <div class="text-4xl mb-2">${data.icon}</div>
            <div class="text-3xl font-bold text-gray-900">${data.temperature}°C</div>
            <div class="text-gray-600 capitalize">${data.condition}</div>
          </div>
          <div class="mb-4 pb-4 border-b border-gray-200">
            <p class="text-gray-700 font-medium">${data.location}</p>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Humidity</span>
              <span class="font-medium">${data.humidity}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Wind Speed</span>
              <span class="font-medium">${data.windSpeed} km/h</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              Last updated: ${this.formatLastUpdated(data.lastUpdated)}
            </p>
          </div>
        </div>
      `;
    }

    return '';
  }
}
