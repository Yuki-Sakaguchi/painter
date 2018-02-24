/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * ペインター
 */
;
(function () {
    // 定数
    var createjsUrl = 'https://code.createjs.com/1.0.0/createjs.min.js', // http://code.createjs.com/easeljs-0.8.1.min.js',
    saveUrl = './js/html2canvas.js', className = 'active', modeName = 'data-mode';
    // グローバル変数
    var elCanvas, elTool, stage, line, art, lastPoint, counter, fontWeight, fontColor, editMode;
    // モード
    var mode;
    (function (mode) {
        mode[mode["pen"] = 1] = "pen";
        mode[mode["eraser"] = 2] = "eraser";
        mode[mode["weight"] = 3] = "weight";
        mode[mode["trash"] = 4] = "trash";
    })(mode || (mode = {}));
    ;
    /**
     * 初期化
     */
    function init() {
        // 必要なライブラリをロード
        var elCreate = document.createElement('script');
        elCreate.src = createjsUrl;
        document.getElementsByTagName('head')[0].appendChild(elCreate);
        // createjsロード完了後に初期設定
        elCreate.addEventListener('load', function () {
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
                createjs.Touch.enable(stage);
            }
            // colorセット
            setColor();
            // 表示
            elCanvas.className += " " + className;
            elTool.className += " " + className;
            // イベント追加
            stage.addEventListener('stagemousedown', drowStart);
            [].forEach.call(elTool.children, function (e) { return e.addEventListener('click', changeMode); });
            window.addEventListener('resize', setWindowSize);
            elTool.getElementsByClassName('save')[0].addEventListener('click', save);
        });
    }
    /**
     * 描画開始
     * @param e
     */
    function drowStart(e) {
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
    function drow(e) {
        // モードによって変更
        var compositeOperation = editMode == mode.eraser ? 'destination-out' : 'source-over';
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
    function drowEnd(e) {
        stage.removeEventListener('stagemousemove', drow);
        stage.removeEventListener('stagemouseup', drowEnd);
        document.onmousemove = null;
    }
    /**
     * 画面外に出た時の処理
     * @param e
     */
    function checkOutside(e) {
        counter[1]++;
        if (counter[1] - counter[0] > 1) {
            drowEnd(null);
        }
    }
    /**
     * モードを変更する
     * @param e
     */
    function changeMode(e) {
        // 現在のモードを取得
        var elCurrent = [].filter.call(elTool.children, function (target) {
            if (editMode == parseInt(target.getAttribute(modeName))) {
                return true;
            }
        });
        // クラスの付け替え
        elCurrent[0].className = elCurrent[0].className.replace(className, '');
        e.target.className += " " + className;
        // モード切り替え
        editMode = e.target.getAttribute(modeName);
    }
    /**
     * windowのサイズをキャンパスに指定
     */
    function setWindowSize() {
        elCanvas.setAttribute('width', window.innerWidth + "px");
        elCanvas.setAttribute('height', document.body.clientHeight + "px");
        if (stage) {
            // art.cache(0, 0, elCanvas.clientWidth, elCanvas.clientHeight);
            stage.update();
        }
    }
    /**
     * 色をセットする
     */
    function setColor() {
        var elColor = elTool.getElementsByClassName('pen');
        [].find.call(elColor, function (e) { return e.style.color = fontColor; });
    }
    /**
     * 保存する
     */
    function save() {
        var elSave = document.createElement('script');
        elSave.src = saveUrl;
        document.body.appendChild(elSave);
        elSave.addEventListener('load', function () {
            html2canvas(document.querySelector('body')).then(function (canvas) {
                document.body.appendChild(canvas);
            });
        });
    }
    // 実行
    window.addEventListener('load', init);
})();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map