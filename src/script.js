class SWslider {
// 	// 「もの」を生成する仕組み。その「もの」を生成するには、まずその「設計図」を用意する必要がある。
// 　その設計図のことをクラスという。
// 　「class クラス名」とすることで新しくクラスを用意する事が出来る。
// 　クラス名は基本的に大文字から始める
	constructor (containerName, slideName, delay, prevIcon = '<', nextIcon = `>`) {
		// クラスがインスタンス化された際に自動的に呼び出される特別なメソッド
		// インスタンス化…クラス という 「型」 から 「具体的な実体」 に生成されたものを インスタンス と呼ぶ
		// prevIcon = '<', デフォルト因数nextIcon = `>`
		this.container = document.querySelector(`${containerName}`);
		// document.querySelector_JavaScriptから任意のHTML要素を検出・取得することができるメソッド
		this.slides = Array.from(document.querySelectorAll(`${slideName}`));
		// Array.from_文字列や配列風オブジェクトから新しい配列を生成する
		this.delay = delay;
		// 引数の delay をインスタンスのプロパティに設定
		// 下2つも同様
		this.prevIcon = prevIcon;
		this.nextIcon = nextIcon;
		this.navigateClasses = [
			{name: 'slider-sw__nav-prev', icon: `${this.prevIcon}`, dir: 'left'},
			{name: 'slider-sw__nav-next', icon: `${this.nextIcon}`, dir: 'right'}
		];
		// []配列{}オブジェクト
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
		// this.setClasses();単体だと動かないので()つけて動くようにしている

		this.setAutoPlay();
		this.setHover();
	}
	createNavigation () {
		this.navigateClasses.forEach((v) => {
			let span  = document.createElement('span');
			span.className = `slider-sw__nav ${v.name}`;
			span.innerHTML = `${v.icon}`;
			if(v.dir === 'left'){
				span.addEventListener('click', () => {
					this.prevAction();
				});
			}else{
				span.addEventListener('click', () => {
					this.nextAction();
				});
			}	
			// this.container.appendChild(span)
		});
	}
	// document.createElement HTML 要素を動的に生成
	// ===完全一致
	// addEventListene何かをしたときに関数が実行されること
	// span.className = `slider-sw__nav ${v.name}`;
	// slider-sw__nav ${v.name}`で一つの文　テンプレートリテラルを使って文字を弄れる
	// appendChild() は Node インターフェイスのメソッドで、指定された親ノード（要素）の子ノードリストの末尾にノードを追加
	prevAction () {
		this.setSlides('decrement');
		this.setClasses();
		this.setActivePagination();
	}
	nextAction () {
		this.setSlides('increment');
		this.setClasses();
		this.setActivePagination();
	}
	setPagination () {
		let pagination = document.createElement('div');
		pagination.className = `slider-sw__pagination`;
		for(let i = 0; i < this.slides.length; i++){
			let span = document.createElement('span');
			span.className = `slider-sw__pagination-item ${this.currentSlide === i ? 'slider-sw__pagination-item--active' : ''}`;
			span.setAttribute('data-pagination-item-id', `${i+1}`);
			this.paginationItems.push(span);
			pagination.appendChild(span);
		}
		pagination.addEventListener('click', (e) => {
			this.changeActivePaginationItem(e);
		});
		this.container.appendChild(pagination);
	}
	// (1)document.createElement HTML 要素を動的に生成
	// (2)for文_指定した回数だけ繰り返し処理を行なう
	// (3) 初期値 : let i = 0;
	//  配列名.length
	// (例)
	// let data = [10, 42, 52];
	// console.log(data.length);
	// >> 3
	// 配列の最後のインデックスに +1 した値を返す（つまり、2に1を足したので3)
	// (4)i++後置インクリメント演算子⇒0の箇所を指している
	// (5)三項演算子（? と :）ifのかわりに使う
	// this.currentSlide === i ? 'slider-sw__pagination-item--active' : '
	// this.currentSlide === i 
	// ⇒iならば?（trune)'slider-sw__pagination-item--active'
	// ⇒iと等しくなければ（false)''
	// （6)setAttribute　指定した要素に属性を追加する、または既存の属性を変更
	// 　　span 要素に data-pagination-item-id という属性を追加
	// (7)this.paginationItems.push(span);
	// Array.prototype.push()配列の末尾(後ろ)に新しい要素を追加
	// ⇒つまり、paginationItemsに、spanを追加
	// appendChild() は Node インターフェイスのメソッドで、指定された親ノード（要素）の子ノードリストの末尾にノードを追加
	
	setActivePagination () {
		this.paginationItems.forEach(v => {
			v.classList.remove('slider-sw__pagination-item--active');
		});
		this.paginationItems[this.currentIndexes[1]].classList.add('slider-sw__pagination-item--active');
	}

	
	changeActivePaginationItem (e) {
		
		this.currentSlide = +e.target.getAttribute('data-pagination-item-id');
		
		let steps = this.currentIndexes[1] - this.currentSlide;
		
		let stopID1 = null;
		if(steps < 0){
			for(let i = steps; i < 0; i++){
				this.currentIndexes = this.slideChange(1);
			}
		}else if(steps > 0){
			for(let i = steps; i > 0; i--){
				this.currentIndexes = this.slideChange(-1);
			}
		}
		this.setSlides();
		this.setClasses();
		this.setActivePagination();
	}
	getSlideIndexes () {
		let arr = [...this.slides];
		// ...スプレッド構文は、3つのドット「...」を使って、配列やオブジェクトの要素を展開する記法
		let indexes = arr.map( (v, i) =>{ return i });
		let len = indexes.length - 1;
		return function (step) {
			indexes = indexes.map( (v) => {
				v += step;
				if(v < 0){
					v = len ;
				}else if(v > len){
					v = 0;
				}
			 	return v;
			});
			return indexes;
		}
	}
	setSlides (dir) {
		dir === 'increment' ? this.direction = 1 : this.direction = -1;
		this.currentIndexes = this.slideChange(this.direction);
	}
	setClasses (p, c, n) {
		this.slides.forEach( v => {
			v.classList.remove('slider-sw__prev');
			v.classList.remove('slider-sw__next');
			v.classList.remove('slider-sw__current');
		});
		this.slides[this.currentIndexes[0]].classList.add('slider-sw__prev');
		this.slides[this.currentIndexes[2]].classList.add('slider-sw__next');
		this.slides[this.currentIndexes[1]].classList.add('slider-sw__current');
		
	}
	setAutoPlay () {
		this.autoplayStopID = setInterval(() => {
			this.setSlides('increment');
			this.setClasses();
			this.setActivePagination();
		}, this.delay);
	}
	setHover () {
		this.container.addEventListener('mouseover', () => {
			clearInterval(this.autoplayStopID);
		});
		this.container.addEventListener('mouseout', () => {
			this.setAutoPlay();
		});
	}
}

new SWslider('.slider-sw', '.slider-sw__slide', 1500,'前','後');
	