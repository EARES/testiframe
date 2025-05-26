import { Injectable, signal } from '@angular/core';
import { WeatherData, WeatherCondition } from '../models/weather.models';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly weatherData = signal<WeatherData | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  readonly data = this.weatherData.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly errorMessage = this.error.asReadonly();

  constructor() {
    this.loadWeatherData();
  }

  async loadWeatherData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Simulate API call delay
      await this.delay(800);

      // Mock weather data - in real app, this would be an HTTP call
      const mockData: WeatherData = {
        location: 'San Francisco, CA',
        temperature: 22,
        condition: WeatherCondition.SUNNY,
        humidity: 65,
        windSpeed: 12,
        icon: '☀️',
        lastUpdated: new Date()
      };

      this.weatherData.set(mockData);
    } catch (error) {
      this.error.set('Failed to load weather data');
      console.error('Weather service error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async refreshWeather(): Promise<void> {
    await this.loadWeatherData();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
