// import { Component, Inject, OnInit } from '@angular/core';
// import { Observable, of } from 'rxjs';

// import { AuthService } from '@services/api/auth/auth.service';
// import { AUTH_SERVICE_TOKEN } from '@app/services/tokens/auth.token';
// import { IAuthUserPatientInfo } from '@app/models/auth-user-patient.model';

// @Component({
//     selector: 'cr-account-status',
//     template: '',
//     standalone: true
// })
// export class AccountStatusPartialComponent implements OnInit {
//     status$: Observable<IAuthUserPatientInfo | null>;

//     constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: AuthService) {}

//     ngOnInit(): void {
//         this.status$ = this.authService.getUserInfo();
//     }
// }