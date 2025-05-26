import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg p-6 h-fit">
      <!-- Widget Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Weather</h3>
        <button
          (click)="refreshWeather()"
          [disabled]="weatherService.isLoading()"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
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
          (click)="fullScreen()"
          [disabled]="weatherService.isLoading()"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
        >
          <svg
            width="16px"
            height="16px"
            [class.animate-spin]="weatherService.isLoading()"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18 4.654v.291a10 10 0 0 0-1.763 1.404l-2.944 2.944a1 1 0 0 0 1.414 1.414l2.933-2.932A9.995 9.995 0 0 0 19.05 6h.296l-.09.39A9.998 9.998 0 0 0 19 8.64v.857a1 1 0 1 0 2 0V4.503a1.5 1.5 0 0 0-1.5-1.5L14.5 3a1 1 0 1 0 0 2h.861a10 10 0 0 0 2.249-.256l.39-.09zM4.95 18a10 10 0 0 1 1.41-1.775l2.933-2.932a1 1 0 0 1 1.414 1.414l-2.944 2.944A9.998 9.998 0 0 1 6 19.055v.291l.39-.09A9.998 9.998 0 0 1 8.64 19H9.5a1 1 0 1 1 0 2l-5-.003a1.5 1.5 0 0 1-1.5-1.5V14.5a1 1 0 1 1 2 0v.861a10 10 0 0 1-.256 2.249l-.09.39h.295z"
              fill="#000000"
            />
          </svg>
        </button>
      </div>

      @if (weatherService.isLoading()) {
      <div class="text-center py-8">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="text-gray-500 mt-2">Loading weather...</p>
      </div>
      } @else if (weatherService.errorMessage()) {
      <div class="text-center py-8">
        <div class="text-red-500 mb-2">
          <svg
            class="w-8 h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p class="text-red-600 text-sm">{{ weatherService.errorMessage() }}</p>
      </div>
      } @else if (weatherService.data()) {
      <!-- Weather Content -->
      <div class="text-center">
        <!-- Weather Icon & Temperature -->
        <div class="mb-4">
          <div class="text-4xl mb-2">{{ weatherService.data()!.icon }}</div>
          <div class="text-3xl font-bold text-gray-900">
            {{ weatherService.data()!.temperature }}°C
          </div>
          <div class="text-gray-600 capitalize">
            {{ weatherService.data()!.condition }}
          </div>
        </div>

        <!-- Location -->
        <div class="mb-4 pb-4 border-b border-gray-200">
          <p class="text-gray-700 font-medium">
            {{ weatherService.data()!.location }}
          </p>
        </div>

        <!-- Weather Details -->
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Humidity</span>
            <span class="font-medium"
              >{{ weatherService.data()!.humidity }}%</span
            >
          </div>

          <div class="flex justify-between items-center">
            <span class="text-gray-600">Wind Speed</span>
            <span class="font-medium"
              >{{ weatherService.data()!.windSpeed }} km/h</span
            >
          </div>
        </div>

        <!-- Last Updated -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            Last updated:
            {{ formatLastUpdated(weatherService.data()!.lastUpdated) }}
          </p>
        </div>
      </div>
      }
    </div>
  `,
})
export class WeatherWidgetComponent {
  constructor(public weatherService: WeatherService) {}

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

  fullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  }
}
