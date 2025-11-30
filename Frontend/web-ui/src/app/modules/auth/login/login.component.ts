import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import StorageHelper from 'src/app/helpers/StorageHelper';
import { AuthService } from '../auth.service';
import { UserLoginRequestModel } from '../UserLoginRequestModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 isLoading: boolean = false;
  form: UntypedFormGroup;
  model: UserLoginRequestModel = {
    username : "",
    password : ""
  };
  constructor(private authService: AuthService,   private fb: UntypedFormBuilder, private router: Router){
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {

  }
  onSubmit(): void{
    if (this.form.valid) {
      this.isLoading = true;
      this.model  = this.form.value;
      this.authService.authenticate(this.model);
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    const t = StorageHelper.getToken();
    if (t) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

}
