import { Component, OnInit } from '@angular/core';
import myAppConfig from "../../config/my-app-config";
import {OktaAuthService} from "@okta/okta-angular";
import * as OktaSignIn from "@okta/okta-signin-widget";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktSigning: any;

  constructor(private oktaAuthService: OktaAuthService) {
    this.oktSigning = new OktaSignIn ({
        logo: 'assets/images/logo.png',
        baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes,
        }
      }
    )
  }


  ngOnInit(): void {
    this.oktSigning.remove();

    this.oktSigning.renderEl({
        el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
      (response: { status: string; }) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuthService?.signInWithRedirect()
        }
      },
      (error: Error) => {
        throw error;
      }
    );
  }
}
