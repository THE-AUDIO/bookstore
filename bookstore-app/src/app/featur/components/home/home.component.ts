import { ActivatedRoute, Route, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/models/book.model';
import { HomeService } from '../../services/home-service.service';
import { SigninService } from 'src/app/auth/services/signin.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit, AfterViewInit{
// ============= Variable ===========
  mybook!: Book;  
  book$!: any;
  token = sessionStorage.getItem('token')
  adminTeste !: boolean;
  @Input() Book!: Book;

 constructor(
  private route: ActivatedRoute,
  private homeService: HomeService,
  private router:Router,
  private signinService: SigninService,
  ){}
 
  @ViewChild('category') category!: ElementRef;
  testeAdmin(){
    const teste = this.signinService.decodeMyToken(this.token)
    if(teste.role  === 'admin'){
      this.adminTeste = true
    }
  }
  goToAdmin(){
    this.router.navigate(['bookstore/admin'])
  }
   selectByCategory(){
      const div = this.category.nativeElement // selectionner le container des catergory de book
      const container = div.querySelectorAll(`.cat`); // selectionner les elt qui ont la classe cat
      container.forEach((elt:any)=>{ // a chaque elt du container 
        elt.addEventListener('click', ()=>{ // ajouter une evenement clique
          const span = elt.querySelector('span') // selectionner l'element span dans chauqe element cliquer
         const category = span.innerHTML // contenu du span
          this.getBookByCategory(category) // appelle au fonction getBookCategory
         
        })
      })
  }

  getbook(): Observable<Book[]>{
    this.book$ = this.homeService.getAllBooks()
    return this.book$
    }
    onViewDetails(bookId: number) { 
      this.router.navigateByUrl(`bookstore/${bookId}`); 
  }
  async getBookByCategory(category: string){
      this.book$ = await this.homeService.getBookByCategory(category)
      return this.book$
  }

  ngOnInit(): void {
    this.getbook()
    this.testeAdmin()
  }
  ngAfterViewInit(): void {
    this.selectByCategory()
  }
}
