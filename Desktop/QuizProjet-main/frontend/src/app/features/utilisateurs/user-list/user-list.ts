import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  AdminService, 
  UtilisateurResponse 
} from '../../../core/services/admin';


@Component({
  selector:'app-user-list',
  standalone:true,
  imports:[
    CommonModule
  ],
  templateUrl:'./user-list.html',
  styleUrls:[
    './user-list.scss'
  ]
})
export class UserListComponent implements OnInit{


  users:UtilisateurResponse[]=[];

  loading=false;



  constructor(
    private adminService:AdminService,
    private router:Router
  ){}



  ngOnInit():void{

    this.loadUsers();

  }



  loadUsers(){

    this.loading=true;


    this.adminService.getAllUsers()
    .subscribe({

      next:(data)=>{

        this.users=data;

        this.loading=false;

      },


      error:()=>{

        this.loading=false;

      }

    });


  }




  addUser(){

    this.router.navigate([
      '/admin/utilisateurs/new'
    ]);

  }





  editUser(id:number){

    this.router.navigate([
      '/admin/utilisateurs/edit',
      id
    ]);

  }




  deleteUser(id:number){

    if(confirm(
      'Supprimer cet utilisateur ?'
    )){


      this.adminService.deleteUser(id)
      .subscribe(()=>{

        this.loadUsers();

      });


    }

  }





  activer(id:number){

  this.adminService.activateUser(id)
  .subscribe({

    next:()=>{
      alert("Utilisateur activé");
      this.loadUsers();
    },

    error:(err)=>{
      console.error(err);
      alert("Erreur activation");
    }

  });

}





  desactiver(id:number){

  this.adminService.deactivateUser(id)
  .subscribe({

    next:()=>{
      alert("Utilisateur désactivé");
      this.loadUsers();
    },

    error:(err)=>{
      console.error(err);
      alert("Erreur désactivation");
    }

  });

}





  resetPassword(id:number){


    const password =
    prompt(
      'Nouveau mot de passe'
    );


    if(password){

      this.adminService.resetPassword(
        id,
        password
      )
      .subscribe(()=>{

        alert(
          'Mot de passe réinitialisé'
        );

      });


    }


  }


}