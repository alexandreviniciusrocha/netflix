import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Animation, AnimationController, AnimationDirection} from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('header') header: ElementRef;
  private headerEl: any;
  public stories: Array<any> = new Array<any>();
  public movies: Array<any> = new Array<any>();
  public slidesOptions: any = { slidesPerView: 3, freeMode: true, spaceBetween: 10 };
  private lastScrollTop: number = 0;
  private animation: Animation; 
 

  constructor(
    private httpClient: HttpClient,
    private animationCtrl: AnimationController,
    private renderer: Renderer2

    ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.headerEl = this.header.nativeElement;

    this.loadStories();
    this.loadMovies();
    this.createAnimation();
  }

  loadStories() {
    this.httpClient.get('http://www.omdbapi.com/?apikey=3a056eae&s=net&page=1').subscribe(data => {
      const response: any = data;
      
      this.stories = response.Search;
    });
  }

  loadMovies(){
    this.httpClient.get("http://www.omdbapi.com/?apikey=3a056eae&s=love&page=1").subscribe(data => {
      const response: any = data;

      this.movies = response.Search;
    });
  }

  createAnimation(){
    this.animation = this.animationCtrl.create()
    .addElement(this.headerEl)
    .duration(360)
    .direction('reverse')
    .fromTo('transform', 'translate(0)', `translateY(-${this.headerEl.clientHeight}px)`);
  }

  onScroll(event: any) {
    const scrollTop: number = event.detail.scrollTop;
    const direction: AnimationDirection = scrollTop > this.lastScrollTop ? 'normal' : 'reverse';

    if(scrollTop > 50){
      this.renderer.addClass(this.headerEl, 'dark');
    }else{
      this.renderer.removeClass(this.headerEl, 'dark');
    }

    if (this.animation.getDirection() != direction) this.animation.direction(direction).play();

    this.lastScrollTop = scrollTop;
  }
}