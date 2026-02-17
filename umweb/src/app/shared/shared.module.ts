import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Factory function for creating the TranslateHttpLoader
 * This loads translation files from the assets/i18n folder
 * @param http HttpClient instance
 * @returns TranslateHttpLoader instance
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * SharedModule provides common functionality across the application
 * including internationalization (i18n) support via ngx-translate
 * 
 * To add new languages:
 * 1. Create a new JSON file in assets/i18n/ (e.g., fr.json, de.json, es.json)
 * 2. Copy the structure from en.json and translate the values
 * 3. Use TranslateService.use('fr') to switch languages
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule
  ]
})
export class SharedModule {
  /**
   * Use forRoot() in the root AppModule to initialize the TranslateModule
   * with the HTTP loader for loading translation files
   */
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
