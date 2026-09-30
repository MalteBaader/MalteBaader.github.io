// IOS11 demo: same geometry as the published tool (see the IOS project README)
(function () {
  var slider = document.getElementById("ios-slider");
  if (!slider) return;
  var center = 200, radius = 70;
  // distance between circle centres, in radii, for steps 1-11
  var multiplier = [2.15, 1.89, 1.64, 1.45, 1.27, 0.91, 0.73, 0.58, 0.44, 0.33, 0.22];
  var c1 = document.getElementById("ios-c1"), c2 = document.getElementById("ios-c2");
  var you = document.getElementById("ios-you"), x = document.getElementById("ios-x");
  var out = document.getElementById("ios-out");

  function draw() {
    var v = +slider.value;
    var half = (radius * multiplier[v - 1]) / 2;
    c1.setAttribute("cx", center - half);
    c2.setAttribute("cx", center + half);
    // labels stop moving once the circles overlap heavily, as in the original
    var labelHalf = (radius * multiplier[Math.min(v, 4) - 1]) / 2;
    you.setAttribute("x", center - labelHalf);
    x.setAttribute("x", center + labelHalf);
    out.textContent = v;
  }
  slider.addEventListener("input", draw);
  draw();
})();
