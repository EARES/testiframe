import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat.component';
import { WeatherWidgetComponent } from './components/weather-widget.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ChatComponent, WeatherWidgetComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto h-screen flex">
        <!-- Left Column - AI Chat -->
        <div class="flex-1 border-r border-gray-200">
          <app-chat
            (showWeatherRequest)="onShowWeatherRequest($event)"
          ></app-chat>
        </div>

        <!-- Right Column - Weather Widget -->
        <div class="w-80 p-6 content-center">
          @if (shouldShowWeather) {
          <app-weather-widget></app-weather-widget>

          }
          <div
            class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mt-6 text-white"
          >
            <h4 class="text-lg font-semibold mb-3">Quick Stats</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="opacity-90">Messages Today</span>
                <span class="font-medium">265</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-90">Status</span>
                <span class="font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppExampleComponent {
  shouldShowWeather: boolean = false;

  onShowWeatherRequest(data: { show: boolean; location?: string }): void {
    this.shouldShowWeather = data.show;


  }
}
