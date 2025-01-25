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
		// querySelectorAll⇒全部取ってくるので複数になりえる
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
		// this.getSlideIndexes();引数はないがgetSlideIndexesという名前を付けたひとまとまりの処理にしたい
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
			this.container.appendChild(span)
		});
	}
	// document.createElement HTML 要素を動的に生成
	// ===完全一致
	// addEventListener何かをしたときに関数が実行されること
	// span.className = `slider-sw__nav ${v.name}`;
	// slider-sw__nav ${v.name}`で一つの文　テンプレートリテラルを使って文字を弄れる
	// appendChild() は Node インターフェイスのメソッドで、指定された親ノード（要素）の子ノードリストの末尾にノードを追加
	prevAction () {
		this.setSlides('decrement');
		//⇒ setSlides ('decrement') {
		// 'decrement' === 'increment' ? this.direction = 1 : this.direction = -1;
		// 	this.currentIndexes = this.slideChange(this.direction);
		// }
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
	// pagination.addEventListener('click', (e)⇒(e)の中身はpagination
	// let span = document.createElement('span');JS上に作成
	// (1)document.createElement HTML 要素を動的に生成
	// (2)for文_指定した回数だけ繰り返し処理を行なう
	// (3) 初期値 : let i = 0;
	//  配列名.length
	// (例)
	// let data = [10, 42, 52];
	// console.log(data.length);
	// >> 3
	// 配列の最後のインデックスに +1 した値を返す（つまり、2に1を足したので3)
	// (4)i++ 1個ずつ追加
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
	// currentIndexe…constructorの関数から引用
	// classList…setPaginationの関数からひっぱってきている
	// this.currentIndexes = this.slideChange(this.direction);
	// this.slideChange = this.getSlideIndexes();
	changeActivePaginationItem (e) {
		// 〇（ページネーション）をクリックしたときにアクティブにするもの
		this.currentSlide = +e.target.getAttribute('data-pagination-item-id');
		// +演算子⇒オペランドの前に置かれ、そのオペランドを評価し、それが数値以外の場合は数値に変換
		// +e.target　イベント取得しているtargetの対象が要素そのもの
		// this.currentSlideは数値が入る<span class="slider-sw__pagination-item" data-pagination-item-id="6"></span>
		// getAttribute
		let steps = this.currentIndexes[1] - this.currentSlide;
		// this.currentIndexes = this.slideChange(this.direction)
		// this.slideChange = this.getSlideIndexes();
		// [0]の箇所について：this.slideChange = this.getSlideIndexes();
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
		// 〇（ページネーション）がどこの位置か管理している
		this.setSlides();
		this.setClasses();
		this.setActivePagination();
	}
	// i--変数の値を1だけ減らす
	getSlideIndexes () {
		// ()引数のない関数
		let arr = [...this.slides];
		// ...スプレッド構文は、3つのドット「...」を使って、配列やオブジェクトの要素を展開する記法
		// this.slides = Array.from(document.querySelectorAll(`${slideName＝"slider-sw__slide"}`));
		let indexes = arr.map( (v, i) =>{ return i });
		// Array.prototype.map()⇒は Array インスタンスのメソッドで、与えられた関数を配列のすべての要素に対して呼び出し、その結果からなる新しい配列を生成
		// return 文は関数の実行を終了して、関数の呼び出し元に返す値を指定
		// V = arrの要素
		// i: 配列 arr の各要素のインデックス（位置）⇒html class=class=`slider-sw__slide`、slides[i]
		let len = indexes.length - 1;
		// 配列の数 -1
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
		// if (条件式1)
		// １がtruneのとき
		// else if 条件1がfalse、条件2があてはまるとき
		// indexesの要素の数？のこといってる
	}
	setSlides (dir) {
		dir === 'increment' ? this.direction = 1 : this.direction = -1;
		// dir === 'increment'trueか判断ししている
		// dir⇒decrement
		// 'increment'=== 'increment'であるかないかの式
		this.currentIndexes = this.slideChange(this.direction);
	}
	setClasses (p, c, n) {
		// p, c, nは今回関係ない書き方
		this.slides.forEach( v => {
			//※Vの中身this.slides = Array.from(document.querySelectorAll(`${HTMLのclss=slider-sw__slide}`));
			v.classList.remove('slider-sw__prev');
			// Element.classList＝Element（HTML/XML要素を内包したオブジェクト）.classList(特定の要素のクラス名を追加したり、削除したり、参照したりすることが出来る便利なプロパティ).romove(削除)(html=classのslider-sw__prev)
			v.classList.remove('slider-sw__next');
			v.classList.remove('slider-sw__current');
		});
		this.slides[this.currentIndexes[0]].classList.add('slider-sw__prev');
		// this.currentIndexes = this.slideChange(this.direction)
		// this.slideChange = this.getSlideIndexes();
		// [0]の箇所について：this.slideChange = this.getSlideIndexes();
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
	// setInterval…一定時間ごとに特定の処理を繰り返す
	// Webを見ていて、スライドショーなど、一定時間ごとに画像や文字が切り替わったりする動的な動きを見たことがあるのではないでしょうか。
　　// これは、JavaScriptのタイマー処理という処理で実装することができます。
　　// 1500m秒ごとに繰り返す 100で1秒⇒つまり、1.5秒
	setHover () {
		this.container.addEventListener('mouseover', () => {
			clearInterval(this.autoplayStopID);
		});
		// this.container = document.querySelector(`${containerName⇒'.slider-sw'}`);
		// addEventListener⇒addEventListener何かをしたときに関数が実行されること
		// clearInterval関数…setInterval関数によって開始された繰り返し処理をキャンセルするために使用される
		this.container.addEventListener('mouseout', () => {
			this.setAutoPlay();
		});
	}
	
}

new SWslider('.slider-sw', '.slider-sw__slide', 1500,'前','後');