import { CommonModule, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeCl from '@angular/common/locales/es-CL';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  readonly title = 'Anago Izakaya';
}

registerLocaleData(localeCl);
