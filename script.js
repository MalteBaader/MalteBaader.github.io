// Theme toggle (remembers choice)
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: light)").matches) root.dataset.theme = "light";
} catch {}
document.getElementById("theme").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});

document.getElementById("year").textContent = new Date().getFullYear();

// Typewriter tagline — edit these phrases!
const phrases = [
  "Behavioural & experimental economist.",
  "Research Data Manager at FAIR, NHH.",
  "Creativity, ethics & cooperation.",
  "I build tools for experimental research.",
];

// Research filters
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    document.querySelectorAll(".paper").forEach((p) =>
      p.classList.toggle("hidden", f !== "all" && p.dataset.kind !== f));
  });
});
const typed = document.getElementById("typed");
let p = 0, i = 0, deleting = false;
(function type() {
  const word = phrases[p];
  typed.textContent = word.slice(0, i);
  if (!deleting && i < word.length) i++;
  else if (deleting && i > 0) i--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1800); }
  else { deleting = false; p = (p + 1) % phrases.length; }
  setTimeout(type, deleting ? 35 : 70);
})();

// Reveal sections on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible"));
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// 3D tilt on project cards
document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => (card.style.transform = ""));
});

// Animated constellation background that reacts to the mouse
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
const mouse = { x: -1e4, y: -1e4 };
let dots = [];

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const n = Math.min(90, Math.floor((innerWidth * innerHeight) / 14000));
  dots = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));
}
addEventListener("resize", resize);
addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
function draw() {
  const rgb = getComputedStyle(root).getPropertyValue("--dot").trim();
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const d of dots) {
    if (!reduced) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > innerWidth) d.vx *= -1;
      if (d.y < 0 || d.y > innerHeight) d.vy *= -1;
    }
    ctx.fillStyle = `rgba(${rgb}, 0.6)`;
    ctx.beginPath(); ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2); ctx.fill();
  }
  const pts = [...dots, mouse];
  for (let a = 0; a < pts.length; a++) {
    for (let b = a + 1; b < pts.length; b++) {
      const dist = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y);
      if (dist < 130) {
        ctx.strokeStyle = `rgba(${rgb}, ${0.25 * (1 - dist / 130)})`;
        ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();
