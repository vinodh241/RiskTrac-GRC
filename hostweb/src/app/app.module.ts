import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatModule } from './modules/mat/mat.module';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { InfoComponent } from './includes/utilities/popups/info/info.component';
import { ConfirmDialogComponent } from './includes/utilities/popups/confirm/confirm-dialog.component';
import { WaitComponent } from './includes/utilities/popups/wait/wait.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangeUserpasswordComponent } from './includes/header/change-userpassword/change-userpassword.component';
import { AuthGuard } from './services/auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    LandingComponent,
    InfoComponent,
    ConfirmDialogComponent,
    WaitComponent,
    ForgotPasswordComponent,
    ChangeUserpasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
