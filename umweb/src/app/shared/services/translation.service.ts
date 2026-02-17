import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * TranslationService provides a wrapper around ngx-translate
 * for consistent translation handling across the application.
 * 
 * This service can be extended to handle:
 * - Language detection from browser/user preferences
 * - Language persistence in localStorage
 * - Dynamic language switching
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private defaultLanguage = environment.defaultLanguage;
  private supportedLanguages = ['en']; // Add more languages as needed: 'fr', 'de', 'es', etc.

  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }

  /**
   * Initialize translation service with default language
   */
  private initializeTranslation(): void {
    this.translate.setDefaultLang(this.defaultLanguage);
    
    // Try to use stored language preference, otherwise use default
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      this.translate.use(storedLang);
    } else {
      this.translate.use(this.defaultLanguage);
    }
  }

  /**
   * Switch to a different language
   * @param lang Language code (e.g., 'en', 'fr', 'de')
   */
  switchLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('preferredLanguage', lang);
    } else {
      console.warn(`Language '${lang}' is not supported. Supported languages: ${this.supportedLanguages.join(', ')}`);
    }
  }

  /**
   * Get the current active language
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.translate.currentLang || this.defaultLanguage;
  }

  /**
   * Get list of supported languages
   * @returns Array of supported language codes
   */
  getSupportedLanguages(): string[] {
    return [...this.supportedLanguages];
  }

  /**
   * Get an instant translation (synchronous)
   * @param key Translation key
   * @param params Optional interpolation parameters
   * @returns Translated string
   */
  instant(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }

  /**
   * Get a translation as an Observable (asynchronous)
   * @param key Translation key
   * @param params Optional interpolation parameters
   * @returns Observable of translated string
   */
  get(key: string, params?: object): Observable<string> {
    return this.translate.get(key, params);
  }

  /**
   * Add a new supported language at runtime
   * @param lang Language code to add
   */
  addSupportedLanguage(lang: string): void {
    if (!this.supportedLanguages.includes(lang)) {
      this.supportedLanguages.push(lang);
    }
  }
}
