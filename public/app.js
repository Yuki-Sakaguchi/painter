/**
 * Painterのブックマークレット
 * 以下をコピーしてブックマークレットに貼って使う
 */
javascript:(function() {
  var painterUrl = 'https://yuki-sakaguchi.github.io/painter/public/js/bundle.js';
  var elScript = document.createElement('script');
  elScript.src = painterUrl;
  document.body.appendChild(elScript);
})();