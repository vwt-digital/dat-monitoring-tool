import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    const currentApiKey = sessionStorage.getItem('apiKey');

    const formGroup = this.formBuilder.group({});
    const apiKeyControl = this.formBuilder.control(
      (currentApiKey ? currentApiKey : ''),
      Validators.required
    );
    formGroup.addControl('apiKey', apiKeyControl);
    this.form = formGroup;
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.apiKey) {
      sessionStorage.setItem('apiKey', this.route.snapshot.queryParams.apiKey);
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saveApiKey(this.form.value);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  saveApiKey(value: AbstractControl): void {
    sessionStorage.setItem('apiKey', value['apiKey']);
    this.form.reset();
    this.router.navigate(['dashboard']);
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
