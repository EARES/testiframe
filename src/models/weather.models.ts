export interface WeatherData {
  location: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  icon: string;
  lastUpdated: Date;
}

export enum WeatherCondition {
  SUNNY = 'sunny',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  STORMY = 'stormy'
}
