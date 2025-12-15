import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 ProjectOps Dashboard. All rights reserved.</p>
        <p class="version">Version 1.0.0</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      padding: 1rem 2rem;
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .footer-content p {
      margin: 0;
    }

    .version {
      font-weight: 500;
    }
  `]
})
export class FooterComponent {}
