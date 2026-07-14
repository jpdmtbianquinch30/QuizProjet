import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService, CreateUserRequest } from '../../../core/services/admin';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.html',
  //styleUrls: ['./user-form.scss']
})
export class UserFormComponent {


  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {

    this.form = this.fb.group({

      nom: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ],

      role: [
        'EVALUATEUR',
        Validators.required
      ]

    });

  }


  submit(): void {

    if(this.form.valid){

      const request: CreateUserRequest =
      this.form.getRawValue();


      this.adminService.createUser(request)
      .subscribe({

        next:()=>{

          alert(
            'Utilisateur créé avec succès'
          );

          this.router.navigate([
            '/admin/utilisateurs'
          ]);

        },

        error:(err)=>{

          console.error(err);

          alert(
            'Erreur lors de la création'
          );

        }

      });


    }

  }


}