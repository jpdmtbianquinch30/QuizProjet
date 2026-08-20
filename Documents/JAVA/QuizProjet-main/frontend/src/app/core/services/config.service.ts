import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export interface PlatformConfig {
  platformName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  maintenanceMode: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private apiUrl = 'http://localhost:8080/api/config';
  private configSubject = new BehaviorSubject<PlatformConfig | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<PlatformConfig>(`${this.apiUrl}/public`))
      .then(config => {
        this.configSubject.next(config);
        this.applyTheme(config);
      })
      .catch(() => {
        const fallback: PlatformConfig = {
          platformName: 'Mon Quiz',
          primaryColor: '#3498db',
          secondaryColor: '#2ecc71',
          logoUrl: '',
          maintenanceMode: false
        };
        this.configSubject.next(fallback);
        this.applyTheme(fallback);
        console.warn('Configuration par défaut utilisée (backend inaccessible)');
      });
  }

  updateConfig(config: PlatformConfig): Observable<PlatformConfig> {
    return this.http.put<PlatformConfig>(`${this.apiUrl}/admin`, config);
  }

  applyTheme(config: PlatformConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--secondary-color', config.secondaryColor);
    document.title = config.platformName;
  }

  getCurrentConfig(): PlatformConfig | null {
    return this.configSubject.value;
  }

  // Méthode pour mettre à jour le subject après une sauvegarde
  refreshConfig(config: PlatformConfig): void {
    this.configSubject.next(config);
    this.applyTheme(config);
  }
}