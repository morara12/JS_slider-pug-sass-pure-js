class SWslider {
  constructor(containerName, slideName, delay, prevIcon = '<', nextIcon = `>`) {
    this.container = document.querySelector(`${containerName}`);
    this.slides = Array.from(document.querySelectorAll(`${slideName}`));
    this.delay = delay;
    this.prevIcon = prevIcon;
    this.nextIcon = nextIcon;
    this.navigateClasses = [
    { name: 'slider-sw__nav-prev', icon: `${this.prevIcon}`, dir: 'left' },
    { name: 'slider-sw__nav-next', icon: `${this.nextIcon}`, dir: 'right' }];

    this.paginationItems = [];
    this.autoplayStopID = null;
    this.currentIndexes = null;
    this.direction = -1;

    this.slideChange = this.getSlideIndexes();
    this.currentIndexes = this.slideChange(this.direction);
    this.setClasses();
    this.createNavigation();
    this.setPagination();
    this.setAutoPlay = this.setAutoPlay.bind(this);

    this.setAutoPlay();
    this.setHover();
  }
  createNavigation() {
    this.navigateClasses.forEach(v => {
      let span = document.createElement('span');
      span.className = `slider-sw__nav ${v.name}`;
      span.innerHTML = `${v.icon}`;
      if (v.dir === 'left') {
        span.addEventListener('click', () => {
          this.prevAction();
        });
      } else {
        span.addEventListener('click', () => {
          this.nextAction();
        });
      }
      this.container.appendChild(span);
    });
  }
  prevAction() {
    this.setSlides('decrement');
    this.setClasses();
    this.setActivePagination();
  }
  nextAction() {
    this.setSlides('increment');
    this.setClasses();
    this.setActivePagination();
  }
  setPagination() {
    let pagination = document.createElement('div');
    pagination.className = `slider-sw__pagination`;
    for (let i = 0; i < this.slides.length; i++) {
      let span = document.createElement('span');
      span.className = `slider-sw__pagination-item ${this.currentSlide === i ? 'slider-sw__pagination-item--active' : ''}`;
      span.setAttribute('data-pagination-item-id', `${i + 1}`);
      this.paginationItems.push(span);
      pagination.appendChild(span);
    }
    pagination.addEventListener('click', e => {
      this.changeActivePaginationItem(e);
    });
    this.container.appendChild(pagination);
  }
  setActivePagination() {
    this.paginationItems.forEach(v => {
      v.classList.remove('slider-sw__pagination-item--active');
    });
    this.paginationItems[this.currentIndexes[1]].classList.add('slider-sw__pagination-item--active');
  }
  changeActivePaginationItem(e) {

    this.currentSlide = +e.target.getAttribute('data-pagination-item-id');

    let steps = this.currentIndexes[1] - this.currentSlide;

    let stopID1 = null;
    if (steps < 0) {
      for (let i = steps; i < 0; i++) {
        this.currentIndexes = this.slideChange(1);
      }
    } else if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        this.currentIndexes = this.slideChange(-1);
      }
    }
    this.setSlides();
    this.setClasses();
    this.setActivePagination();
  }
  getSlideIndexes() {
    let arr = [...this.slides];
    let indexes = arr.map((v, i) => {return i;});
    let len = indexes.length - 1;
    return function (step) {
      indexes = indexes.map(v => {
        v += step;
        if (v < 0) {
          v = len;
        } else if (v > len) {
          v = 0;
        }
        return v;
      });
      return indexes;
    };
  }
  setSlides(dir) {
    dir === 'increment' ? this.direction = 1 : this.direction = -1;
    this.currentIndexes = this.slideChange(this.direction);
  }
  setClasses(p, c, n) {
    this.slides.forEach(v => {
      v.classList.remove('slider-sw__prev');
      v.classList.remove('slider-sw__next');
      v.classList.remove('slider-sw__current');
    });
    this.slides[this.currentIndexes[0]].classList.add('slider-sw__prev');
    this.slides[this.currentIndexes[2]].classList.add('slider-sw__next');
    this.slides[this.currentIndexes[1]].classList.add('slider-sw__current');

  }
  setAutoPlay() {
    this.autoplayStopID = setInterval(() => {
      this.setSlides('increment');
      this.setClasses();
      this.setActivePagination();
    }, this.delay);
  }
  setHover() {
    this.container.addEventListener('mouseover', () => {
      clearInterval(this.autoplayStopID);
    });
    this.container.addEventListener('mouseout', () => {
      this.setAutoPlay();
    });
  }}


// new SWslider('.slider-sw', '.slider-sw__slide', 1500);
// new SWslider('.slider-sw', '.slider-sw__slide', 1500,'.slider-sw__prevIcon','.slider-sw__nextIcon');
new SWslider('.slider-sw', '.slider-sw__slide', 1500,'前','後');

