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

// TODO
// 		・ブックマークレット化(githubを使って良き感じにすれば中身を書き換えやすい)
//		・一つ戻る
/**
 * ペインター
 */
;
(function () {
    var rootPath = 'https://yuki-sakaguchi.github.io/painter/public/';
    // 定数
    var createjsUrl = 'https://code.createjs.com/1.0.0/createjs.min.js', // http://code.createjs.com/easeljs-0.8.1.min.js',
    saveUrl = rootPath + "js/html2canvas.js", className = 'active', modeName = 'data-mode';
    // グローバル変数
    var elCanvas, elTool, elSave, stage, line, art, lastPoint, counter, fontWeight, fontColor, editMode;
    // モード
    var mode;
    (function (mode) {
        mode[mode["pen"] = 1] = "pen";
        mode[mode["eraser"] = 2] = "eraser";
        mode[mode["weight"] = 3] = "weight";
        mode[mode["save"] = 4] = "save";
        mode[mode["trash"] = 5] = "trash";
    })(mode || (mode = {}));
    ;
    /**
     * 初期化
     */
    function init() {
        createDom();
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
            elTool.getElementsByClassName('trash')[0].addEventListener('click', trash);
        });
    }
    /**
     * 必要なDOM要素を作成する
     */
    function createDom() {
        var elWrap = document.createElement('div');
        elWrap.id = elWrap.className = 'painter-wrap';
        var linkFont = document.createElement('link');
        linkFont.setAttribute('rel', 'stylesheet');
        linkFont.setAttribute('href', 'https://use.fontawesome.com/releases/v5.0.1/css/all.css');
        var linkCss = document.createElement('link');
        linkCss.setAttribute('rel', 'stylesheet');
        linkCss.setAttribute('href', rootPath + "css/main.css");
        var elCanvas = document.createElement('canvas');
        elCanvas.id = elCanvas.className = 'painter-canvas';
        var elPainter = document.createElement('div');
        elPainter.id = elPainter.className = 'painter';
        var elTool = document.createElement('ul');
        elTool.id = elTool.className = 'painter-tool';
        var toolItem = [
            {
                className: 'pen active',
                mode: '1',
                iconClassName: 'fas fa-pencil-alt',
            },
            {
                className: 'eraser',
                mode: '2',
                iconClassName: 'fa fa-eraser',
            },
            {
                className: 'save',
                mode: '3',
                iconClassName: 'fas fa-sign-in-alt',
            },
            {
                className: 'trash',
                mode: '4',
                iconClassName: 'fas fa-trash-alt',
            }
        ];
        for (var i = 0, len = toolItem.length; i < len; i++) {
            var elToolItem = document.createElement('li');
            elToolItem.setAttribute('class', "painter-tool__item " + toolItem[i].className);
            elToolItem.setAttribute('data-mode', toolItem[i].mode);
            var elDiv = document.createElement('div');
            var elToolItemIcon = document.createElement('i');
            elToolItemIcon.className = toolItem[i].iconClassName;
            elTool.appendChild(elToolItem);
            elToolItem.appendChild(elDiv);
            elDiv.appendChild(elToolItemIcon);
        }
        elWrap.appendChild(linkFont);
        elWrap.appendChild(linkCss);
        elWrap.appendChild(elCanvas);
        elWrap.appendChild(elPainter);
        elPainter.appendChild(elTool);
        document.body.appendChild(elWrap);
        // save
        elSave = document.createElement('script');
        elSave.setAttribute('src', saveUrl);
        elWrap.appendChild(elSave);
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
        if (e.target.getAttribute('data-mode') == 4) {
            return;
        }
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
        elTool.style.visibility = 'hidden';
        html2canvas(document.querySelector('body')).then(function (canvas) {
            // document.body.appendChild(canvas);
            downloadImage(canvas);
            elTool.style.visibility = 'inherit';
        });
    }
    function trash() {
        if (confirm('全てを削除します')) {
            document.getElementById('painter-wrap').remove();
        }
    }
    function downloadImage(canvas) {
        var dataUrl = canvas.toDataURL("image/png");
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        a.setAttribute('href', dataUrl);
        a.setAttribute('download', 'html2canvas動作確認の出力結果イメージ');
        a.dispatchEvent(event);
    }
    // 実行
    init();
})();


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map