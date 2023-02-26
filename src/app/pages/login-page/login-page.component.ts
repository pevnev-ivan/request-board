import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  email = '';
  linkSuccess = false;

  constructor(
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.auth.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/groups', { replaceUrl: true });
      }
    });
  }

  async signIn() {
    this.spinner.show();
    const result = await this.auth.signInWithEmail(this.email);

    this.spinner.hide();
    if (result.error) {
      alert(result.error.message);
    } else {
      this.linkSuccess = true;
    }
  }
}
