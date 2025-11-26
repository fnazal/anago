import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { MenuDinamicoComponent } from "../menu-dinamico/menu-dinamico.component";

@Component({
  selector: 'app-home',
  imports: [NgClass, NgIf, MenuDinamicoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isVeggie: boolean = false;
  restaurantName: string = 'ANAGO';
  buttonName: string = 'OTORO';
  kanjiText: string = '居酒屋';
  showHorizontalNav: boolean = true;
  leftImageUrl: string = '/anago.jpg';
  showLeftNavs: boolean = false;
  showLocationPopup: boolean = false;
  selectedLocation: string = 'sanjavier';
  isClosing: boolean = false;
  isLoadingMap: boolean = false;
  imageOpacity: number = 1;
  showMenuPopup: boolean = false;
  selectedCategory: 'entradas' | 'fondo' | 'ramen' = 'entradas'; //Por defecto entradas, ya que obligatoriamente debe estar en uno de los 3 casos
  menuClosing: boolean = false;
  isNavbarCollapsed: boolean = true;
  fadingItemIndices: Set<number> = new Set();
  isMobile: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.isMobile = window.innerWidth <= 768;
    this.leftImageUrl = this.isMobile ? '/anagores.jpg' : '/anago.jpg';
    
    // Auto-collapse navbar after 3 seconds on mobile
    if (this.isMobile) {
      this.isNavbarCollapsed = false;
      setTimeout(() => {
        this.isNavbarCollapsed = true;
      }, 3000);
    }
    
    this.preloadImages();
  }

  ngOnInit() {
    // Ensure page starts at the top (hero-image section)
    window.scrollTo(0, 0);
  }

  private preloadImages() {
    const images = [
      '/anago.jpg',
      '/otoro.jpg',
      '/trad.jpg',
      '/veggie.jpg',
      '/otoromenu.jpg',
      '/anagores.jpg',
      '/otorores.jpg',
      '/tradres.jpg',
      '/veggieres.jpg',
      '/otoromenures.jpg'
    ];
    
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  private changeImageWithFade(newImageUrl: string) {
    this.imageOpacity = 0;
    setTimeout(() => {
      this.leftImageUrl = newImageUrl;
      setTimeout(() => {
        this.imageOpacity = 1;
      }, 50);
    }, 400);
  }

  goHome() {
    if (this.showMenuPopup) {
      this.closeMenuPopup();
      setTimeout(() => {
        if (this.showLeftNavs) {
          const newImage = this.isMobile
            ? (this.restaurantName === 'OTORO' ? '/otorores.jpg' : '/anagores.jpg')
            : (this.restaurantName === 'OTORO' ? '/otoro.jpg' : '/anago.jpg');
          this.changeImageWithFade(newImage);
        }
        this.showLeftNavs = false;
        this.showHorizontalNav = this.restaurantName === 'ANAGO';
        this.isVeggie = false;
        
        // Scroll to top (hero image) in mobile
        if (window.innerWidth <= 768) {
          const heroImage = document.querySelector('.hero-image');
          if (heroImage) {
            heroImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 400);
    } else {
      if (this.showLeftNavs) {
        const newImage = this.isMobile
          ? (this.restaurantName === 'OTORO' ? '/otorores.jpg' : '/anagores.jpg')
          : (this.restaurantName === 'OTORO' ? '/otoro.jpg' : '/anago.jpg');
        this.changeImageWithFade(newImage);
      }
      this.showLeftNavs = false;
      this.showHorizontalNav = this.restaurantName === 'ANAGO';
      this.isVeggie = false;
      
      // Scroll to top (hero image) in mobile
      if (window.innerWidth <= 768) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
          heroImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  goMenu() {
    if (this.showMenuPopup) {
      return;
    }
    
    this.showLeftNavs = true;
    this.showHorizontalNav = true;
    this.isVeggie = false;
    
    // Change image without fade transition
    this.leftImageUrl = this.isMobile
      ? (this.restaurantName === 'OTORO' ? '/otoromenures.jpg' : '/tradres.jpg')
      : (this.restaurantName === 'OTORO' ? '/otoromenu.jpg' : '/trad.jpg');
    
    // Auto-collapse navbar on mobile
    if (window.innerWidth <= 768) {
      this.isNavbarCollapsed = true;
    }
    
    // Scroll to left image section in mobile with smooth animation
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const leftImage = document.querySelector('.left-image');
        if (leftImage) {
          leftImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  openLocation() {
    this.showLocationPopup = true;
    this.closeMenuPopup();
  }

  closeLocation() {
    this.isClosing = true;
    setTimeout(() => {
      this.showLocationPopup = false;
      this.isClosing = false;
    }, 400);
  }

  selectLocation(location: string) {
    if (this.selectedLocation !== location) {
      this.isLoadingMap = true;
      setTimeout(() => {
        this.selectedLocation = location;
        this.isLoadingMap = false;
      }, 400);
    }
  }

  setVeggie(value: boolean) {
    if (this.isVeggie === value) {
      return;
    }
    this.isVeggie = value;
    this.showLeftNavs = true;
    const newImage = this.isMobile
      ? (value ? '/veggieres.jpg' : '/tradres.jpg')
      : (value ? '/veggie.jpg' : '/trad.jpg');
    this.changeImageWithFade(newImage);
  }

  toggleRestaurant() {
    if (this.restaurantName === 'ANAGO') {
      this.setRestaurant('OTORO');
    } else {
      this.setRestaurant('ANAGO');
    }
  }

  setRestaurant(name: string) {
    if (this.restaurantName === name) {
      return;
    }
    
    // Close menu popup if open
    if (this.showMenuPopup) {
      this.closeMenuPopup();
    }
    
    if (name === 'ANAGO') {
      this.restaurantName = 'ANAGO';
      this.buttonName = 'OTORO';
      this.kanjiText = '居酒屋';
      this.showHorizontalNav = true;
      this.changeImageWithFade(this.isMobile ? '/anagores.jpg' : '/anago.jpg');
      this.showLeftNavs = false;
      this.isVeggie = false;
    } else if (name === 'OTORO') {
      this.restaurantName = 'OTORO';
      this.buttonName = 'ANAGO';
      this.kanjiText = '日本伝統料理';
      this.showHorizontalNav = false;
      this.changeImageWithFade(this.isMobile ? '/otorores.jpg' : '/otoro.jpg');
      this.showLeftNavs = false;
      this.isVeggie = false;
    }
    
    // Scroll to hero-image (inicio) on mobile
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
          heroImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }

  openMenuCategory(category: string) {
    if (this.showMenuPopup && this.selectedCategory === category) {
      return;
    }
    this.selectedCategory = category as 'entradas' | 'fondo' | 'ramen';
    this.showMenuPopup = true;
    this.fadingItemIndices.clear();
  }

  closeMenuPopup() {
    this.menuClosing = true;
    setTimeout(() => {
      this.showMenuPopup = false;
      this.menuClosing = false;
      this.fadingItemIndices.clear();
    }, 400);
  }

  onMenuScroll(event: Event) {
    const target = event.target as HTMLElement;
    const navbarHeight = window.innerWidth <= 768 
      ? (this.isNavbarCollapsed ? 60 : 100) 
      : 100;
    
    // Get all menu items
    const menuItems = target.querySelectorAll('.menu-item');
    const newFadingIndices = new Set<number>();
    
    menuItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top;
      const itemBottom = rect.bottom;
      
      // If item overlaps with navbar area, add to fading set
      if (itemTop < navbarHeight && itemBottom > 0) {
        newFadingIndices.add(index);
      }
    });
    
    // Only update if the set has changed
    if (newFadingIndices.size !== this.fadingItemIndices.size || 
        ![...newFadingIndices].every(i => this.fadingItemIndices.has(i))) {
      this.fadingItemIndices = newFadingIndices;
      this.cdr.detectChanges();
    }
  }

  shouldFadeItem(index: number): boolean {
    return this.fadingItemIndices.has(index);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  /*scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }*/

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
