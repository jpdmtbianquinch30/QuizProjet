import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './app/core/services/config.service';

function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));