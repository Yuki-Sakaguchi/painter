/**
 * ペインター
 */
;(function() {
	// 定数
	const createjsUrl: string = 'https://code.createjs.com/1.0.0/createjs.min.js', // http://code.createjs.com/easeljs-0.8.1.min.js',
				saveUrl: string = './js/html2canvas.js',
				className: string = 'active',
				modeName: string = 'data-mode';

	// グローバル変数
	let elCanvas: HTMLElement,
			elTool: HTMLElement,
			stage: any,
			line: createjs.Shape,
			art: createjs.Shape,
			lastPoint: createjs.Point,
			counter: number[],
			fontWeight: number,
			fontColor: string,
			editMode: number;

	// モード
	enum mode {
		'pen' = 1,
		'eraser' = 2,
		'weight' = 3,
		'trash' = 4
	};

	/**
	 * 初期化
	 */
	function init(): void {
		// 必要なライブラリをロード
		let elCreate: HTMLScriptElement = document.createElement('script');
		elCreate.src = createjsUrl;
		document.getElementsByTagName('head')[0].appendChild(elCreate);

		// createjsロード完了後に初期設定
		elCreate.addEventListener('load', () => {
			// canvas
			elCanvas = document.getElementById('painter-canvas');
			setWindowSize();

			// ツール
			elTool = document.getElementById('painter-tool');

			// 初期設定
			stage = new createjs.Stage(elCanvas);
			line = new createjs.Shape();
			art = stage.addChild(line);
			art.cache(0, 0, elCanvas.clientWidth, elCanvas.clientHeight);
			lastPoint = new createjs.Point();
			counter = [0, 0];
			fontWeight = 10;
			fontColor = createjs.Graphics.getHSL(0, 50, 50);
			editMode = mode.pen;

			if (createjs.Touch.isSupported()) {
				// タッチ操作を有効にします。
				createjs.Touch.enable(stage)
			}

			// colorセット
			setColor();

			// 表示
			elCanvas.className += ` ${className}`;
			elTool.className += ` ${className}`;

			// イベント追加
			stage.addEventListener('stagemousedown', drowStart);
			[].forEach.call(elTool.children, (e: HTMLElement): void => e.addEventListener('click', changeMode));
			window.addEventListener('resize', setWindowSize);
			elTool.getElementsByClassName('save')[0].addEventListener('click', save);
		});
	}

	/**
	 * 描画開始
	 * @param e 
	 */
	function drowStart(e: createjs.MouseEvent): void {
		stage.addEventListener('stagemousemove', drow);
		stage.addEventListener('stagemouseup', drowEnd);
		lastPoint.setValues(e.stageX, e.stageY);
		counter[0] = 0;
		counter[1] = 0;
		document.onmousemove = checkOutside;
	}

	/**
	 *  描画
	 * @param e 
	 */
	function drow(e): void {
		// モードによって変更
		let compositeOperation = editMode == mode.eraser ? 'destination-out' : 'source-over';
		
		// 線を書く
		art.graphics.clear()
		.setStrokeStyle(fontWeight, 1)
		.beginStroke(fontColor)
		.moveTo(lastPoint.x, lastPoint.y)
		.lineTo(e.stageX, e.stageY);

		// 値をセットして更新
		art.updateCache(compositeOperation);
		lastPoint.setValues(e.stageX, e.stageY);
		counter[0]++;
		stage.update();
	}

	/**
	 * 描画終了
	 * @param e 
	 */
	function drowEnd(e): void {
		stage.removeEventListener('stagemousemove', drow);
		stage.removeEventListener('stagemouseup', drowEnd);
		document.onmousemove = null;
	}

	/**
	 * 画面外に出た時の処理
	 * @param e 
	 */
	function checkOutside(e): void {
		counter[1]++;
		if (counter[1] - counter[0] > 1) {
			drowEnd(null);
		}
	}

	/**
	 * モードを変更する
	 * @param e 
	 */
	function changeMode(e): void {
		// 現在のモードを取得
		let elCurrent: HTMLElement[] = [].filter.call(elTool.children, (target: HTMLElement): boolean => {
			if (editMode == parseInt(target.getAttribute(modeName))) {
				return true;
			}
		});

		// クラスの付け替え
		elCurrent[0].className = elCurrent[0].className.replace(className, '');
		e.target.className += ` ${className}`;

		// モード切り替え
		editMode = e.target.getAttribute(modeName);
	}

	/**
	 * windowのサイズをキャンパスに指定
	 */
	function setWindowSize() {
		elCanvas.setAttribute('width', `${window.innerWidth}px`);
		elCanvas.setAttribute('height', `${document.body.clientHeight}px`);

		if (stage) {
			// art.cache(0, 0, elCanvas.clientWidth, elCanvas.clientHeight);
			stage.update();
		}
	}

	/**
	 * 色をセットする
	 */
	function setColor() {
		let elColor = elTool.getElementsByClassName('pen');
		[].find.call(elColor, (e) => e.style.color = fontColor);
	}

	/**
	 * 保存する
	 */
	function save() {
		let elSave = document.createElement('script');
		elSave.src = saveUrl;
		document.body.appendChild(elSave);

		elSave.addEventListener('load', () => {
			html2canvas(document.querySelector('body')).then(canvas => {
				document.body.appendChild(canvas);
			});
		});
	}
 
	// 実行
	window.addEventListener('load', init);

})();