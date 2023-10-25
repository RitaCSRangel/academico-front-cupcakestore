import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { checkLogin } from 'src/app/utils/utils';
import { CartComponent } from '../modals/cart/cart.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  // -------- Atributos --------

  // Recebíveis por vias externas
  @Input() currentPage = '';

  // Controladores
  logged = false;
  showCart = false;

  // -------- Método Construtor --------
  constructor(
    private modalService: NgbModal, // Injection da classe NgbModal para poder chamar a modal de carrinho
    private router: Router
  ) { }

  // -------- Métodos do ciclo de vida do componente --------
  ngOnInit(): void {
    this.checkCurrentPage();
    this.loadLoginFeatures();
  }

  // -------- Métodos da Classe --------

  // Método loadLoginFeatures
  // Este método é responsável por chamar a função definida nos utilitários (utils) de checkLogin para checar se um usuário está logado
  // e, se estiver, ativa os botões que permitem adicionar ou remover os itens de destaque da landing page ao carrinho. Se não estiver
  // logado então esses botões ficam inativos.
  loadLoginFeatures() {

    this.logged = checkLogin();
    if (this.logged === false) {
      let collection = document.getElementsByClassName('filled-button-iconBG');
      Array.from(collection).forEach(element => {
        element.classList.add('inactive');
      });
    } else if (this.logged === true) {
      let collection = document.getElementsByClassName('filled-button-iconBG');
      Array.from(collection).forEach(element => {
        element.classList.add('active');
      });
    }
  }

  // Método checkCurrentPage
  // Este método é responsável por verificar em qual página o usuário se encontra para destacar
  // o item da barra de navegação de acordo.
  checkCurrentPage() {
    if (this.currentPage === 'landing-page') {
      document.getElementById('inicio')?.classList.add('active');
      document.getElementById('cardapio')?.classList.remove('active');
      document.getElementById('acessar')?.classList.remove('active');
    } else if (this.currentPage === 'cardapio') {
      document.getElementById('inicio')?.classList.remove('active');
      document.getElementById('cardapio')?.classList.add('active');
      document.getElementById('acessar')?.classList.remove('active');
    } else if (this.currentPage === 'acessar') {
      document.getElementById('inicio')?.classList.remove('active');
      document.getElementById('cardapio')?.classList.remove('active');
      document.getElementById('acessar')?.classList.add('active');
    } else if (this.currentPage === 'perfil') {
      document.getElementById('inicio')?.classList.remove('active');
      document.getElementById('cardapio')?.classList.remove('active');
      document.getElementById('acessar')?.classList.remove('active');
    }
  }

  // Método open
  // Este método permite abrir uma modal que, no caso, é o componente CartComponent
  open() {
    const modalRef = this.modalService.open(CartComponent, { backdropClass: 'transparent-backdrop' });
  }

  // Método loggout
  // Este método é responsável por deslogar o usuário e redirecioná-lo para a landing page ou atualizar a landing page
  loggout(){
    sessionStorage.clear();
    if (this.router.url === '/'){
      window.location.reload();
    }else{
      this.router.navigate(['']);
    }
  }
}