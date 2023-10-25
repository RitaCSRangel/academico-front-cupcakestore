import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/users/user-model';
import { UsersService } from 'src/app/services/users/users.service';
import { getUser, setUser } from 'src/app/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  // -------- Atributos --------

  // Controladores
  loading = false;

  // Inputs
  nome = '';
  email = '';
  telefone = '';
  rua = '';
  numero = '';
  bairro = '';
  cep = '';
  senha = '';

  // Armazenadores
  user!: User;

  // -------- Método Construtor --------
  constructor(
    private usersService: UsersService
  ) { }

  // -------- Métodos do ciclo de vida do componente --------
  ngOnInit(): void {
    this.loadUserData();
  }

  // -------- Métodos da Classe --------

  // Método loadUserData
  // Este método é responsável por colocar as informações do usuário atual no formulário de perfil
  loadUserData() {
    this.user = getUser();
    this.nome = this.user.name;
    this.email = this.user.email;
    this.telefone = this.user.phone;
    this.senha = this.user.password;
    this.rua = this.user.rua;
    this.numero = this.user.numero;
    this.bairro = this.user.bairro;
    this.cep = this.user.cep;
  }

  // Método submitNewUser
  // Este método é responsável por atualizar as informações do usuário de acordo com as informações inseridas no formulário de perfil
  async submitNewUser() {
    this.loading = true;

    this.user.id = this.user.id;
    this.user.name = this.nome;
    this.user.email = this.email;
    this.user.phone = this.telefone;
    this.user.password = this.senha;
    this.rua = this.user.rua;
    this.bairro = this.user.bairro;
    this.cep = this.user.cep;
    this.numero = this.user.numero;

    this.usersService.updateUser(this.user).subscribe(
      (responseSearch: any) => {
        alert("Usuário atualizado com sucesso!");
        setUser(this.user);
      },
      (error: HttpErrorResponse) => {
        alert("Houve um erro ao atualizar o usuário.");
      }
    );
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}