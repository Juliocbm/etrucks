import { Component, OnInit, OnDestroy } from '@angular/core';

interface SlideImage {
  url: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Array de imágenes para el slider
  images: SlideImage[] = [
    {
      url: 'https://hgtransportaciones.com/wp-content/uploads/2023/10/viajes-nacionales-y-locales-1024x684.jpg',
      alt: 'Sistema HGTools',
      title: 'Bienvenido a HGTools',
      description: 'Sistema integral para la gestión de operaciones'
    },
    {
      url: 'https://hgtransportaciones.com/wp-content/uploads/2023/10/EDI.jpg',
      alt: 'Herramientas',
      title: 'Herramientas Potentes',
      description: 'Accede a todas las funcionalidades desde un solo lugar'
    },
    {
      url: 'https://img.freepik.com/vector-premium/insights-predictivos-generados-concepto-abstracto-ilustracion-vectorial-analisis-datos-predictivo_107173-64998.jpg?w=826',
      alt: 'Analíticas',
      title: 'Analíticas en Tiempo Real',
      description: 'Visualiza y analiza información crítica para la toma de decisiones'
    }
  ];

  currentIndex: number = 0;
  autoSlideInterval: any;

  constructor() { }

  ngOnInit(): void {
    // Iniciar el cambio automático de slides
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    this.stopAutoSlide();
  }

  // Cambiar al slide anterior
  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.resetAutoSlide();
  }

  // Cambiar al siguiente slide
  nextSlide(): void {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
    this.resetAutoSlide();
  }

  // Cambiar a un slide específico
  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  // Iniciar el cambio automático de slides
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }

  // Detener el cambio automático
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // Reiniciar el temporizador de cambio automático
  resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
