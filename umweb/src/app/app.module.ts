import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './includes/footer/footer.component';
import { HeaderComponent } from './includes/header/header.component';
import { MatModule } from './modules/mat/mat.module';
import { InfoComponent } from './includes/utilities/popups/info/info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WaitComponent } from './includes/utilities/popups/wait/wait.component';
import { environment } from 'src/environments/environment';

/**
 * Factory function for loading translation files
 * Translation files are located in assets/i18n/
 * To add new languages, create new JSON files (e.g., fr.json, de.json)
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InfoComponent,
    WaitComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    AppRoutingModule,
    MatModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLanguage,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
