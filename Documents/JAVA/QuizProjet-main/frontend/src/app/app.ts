import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.config$.subscribe(config => {
      if (config) {
        this.configService.applyTheme(config);
      }
    });
  }
}