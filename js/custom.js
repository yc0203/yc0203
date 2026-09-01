// 导航栏滚动自动隐藏
(function () {
  var nav = document.getElementById("nav");
  if (!nav) return;
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > lastY && y > 200) {
      nav.classList.add("nav-hide");
    } else {
      nav.classList.remove("nav-hide");
    }
    lastY = y;
  }, { passive: true });
})();
