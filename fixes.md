# Fixes for your page (4 steps)

## 1. Load the slide fonts
Replace your Google Fonts `<link>` with this one (adds Orbitron + Chakra Petch):

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Orbitron:wght@500;700;900&family=Chakra+Petch:wght@300;400&display=swap" rel="stylesheet">
```

## 2. Replace the slide CSS
In your `<style>`, **delete everything from the first `:root { --bg:#000; ... }` down to `.lines i:nth-child(4) {...}`** and paste this instead:

```css
/* ---------- Slide (everything scoped, so it can't touch the rest of the page) ---------- */
.slide-frame{ position:relative; width:100%; aspect-ratio:1920/961; overflow:hidden; background:#000; }
.stage{
  --s-card:#161616; --s-accent:#9fe32b; --s-text:#e8e8e8;
  position:absolute; top:0; left:0; width:1920px; height:961px;
  transform-origin:top left;
  background:#000 url("background.png") center / cover no-repeat;
  font-family:"Chakra Petch",sans-serif; line-height:normal;
}
.stage *{ margin:0; padding:0; }

.stage .logo{ position:absolute; left:108px; top:106px; display:flex; align-items:center; gap:10px; color:#fff; font-size:21px; letter-spacing:.5px; }
.stage .logo svg{ width:30px; height:30px; fill:var(--s-accent); }

.stage .slide-title{
  position:absolute; left:0; right:0; top:68px; text-align:center;
  font-family:"Orbitron",sans-serif; font-weight:700; font-size:108px; line-height:92px;
  color:var(--s-accent); text-transform:uppercase;
  text-shadow:0 0 10px rgba(159,227,43,.9), 0 0 30px rgba(159,227,43,.55), 0 0 60px rgba(159,227,43,.35);
}

/* renamed from .card: Bootstrap already has a .card class that was overriding it */
.stage .slide-card{
  position:absolute; background:var(--s-card); border:1px solid var(--s-accent);
  border-radius:10px; padding:0 20px; text-align:center;
}
.stage .slide-card h2{ font-family:"Orbitron",sans-serif; font-weight:700; font-size:25px; line-height:28px; color:var(--s-accent); }
.stage .slide-card p{ font-weight:300; font-size:19.5px; line-height:21.5px; color:var(--s-text); }
.stage .c1{ left:218px;  top:296px; width:427px; height:501px; }
.stage .c2{ left:734px;  top:339px; width:439px; height:494px; }
.stage .c3{ left:1262px; top:296px; width:439px; height:501px; }
.stage .c1 h2{ margin-top:58px; } .stage .c1 p{ margin-top:42px; }
.stage .c2 h2{ margin-top:70px; } .stage .c2 p{ margin-top:62px; font-size:20.5px; line-height:22px; }
.stage .c3 h2{ margin-top:58px; } .stage .c3 p{ margin-top:46px; font-size:20.5px; line-height:22px; }

.stage .lines{ position:absolute; width:91px; height:40px; }
.stage .lines i{ position:absolute; height:3px; border-radius:2px; background:linear-gradient(90deg, rgba(159,227,43,0), var(--s-accent)); }
.stage .lines.left{ left:108px; top:276px; }
.stage .lines.right{ left:1722px; top:296px; transform:scaleX(-1); }
.stage .lines i:nth-child(1){ top:0;    left:0; width:58px; }
.stage .lines i:nth-child(2){ top:10px; left:0; width:70px; }
.stage .lines i:nth-child(3){ top:20px; left:0; width:50px; }
.stage .lines i:nth-child(4){ top:31px; left:0; width:91px; }
```

## 3. Replace the carousel + hero markup
Delete from `<main class="stage" ...>` through the closing `</div>` of the carousel (the hero `<section>` was wrongly nested inside the carousel). Paste this; keep your existing `<section class="hero">…</section>` block, now **after** the carousel:

```html
<div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">

    <div class="carousel-item active" data-bs-interval="10000">
      <img src="w1.png" class="d-block w-100" alt="">
    </div>

    <div class="carousel-item" data-bs-interval="2000">
      <img src="a.png" class="d-block w-100" alt="">
    </div>

    <!-- coded slide replaces r2.png -->
    <div class="carousel-item">
      <div class="slide-frame">
        <div class="stage">
          <div class="logo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v6.3l5.5-3.2 2 3.5-5.5 3.2 5.5 3.2-2 3.5-5.5-3.2V22h-4v-6.3l-5.5 3.2-2-3.5 5.5-3.2-5.5-3.2 2-3.5L10 8.3z"/></svg>
            <span>web zelora</span>
          </div>
          <div class="lines left"><i></i><i></i><i></i><i></i></div>
          <div class="lines right"><i></i><i></i><i></i><i></i></div>

          <h2 class="slide-title">Reporting and<br>Response</h2>

          <section class="slide-card c1">
            <h2>Why early reporting<br>is critical</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.</p>
          </section>
          <section class="slide-card c2">
            <h2>How to report<br>suspicious activity in<br>your organization</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.</p>
          </section>
          <section class="slide-card c3">
            <h2>Role of incident<br>response teams</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.</p>
          </section>
        </div>
      </div>
    </div>

  </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<!-- your existing <section class="hero"> ... </section> goes here -->
```

## 4. Replace the slide-scaling script
At the bottom, delete the old block (`// Scale the 1920x961 slide…` through `fit();`) and add:

```js
// Scale each slide to the width of its carousel frame
document.querySelectorAll('.slide-frame').forEach(frame => {
  const stage = frame.querySelector('.stage');
  const fit = () => { stage.style.transform = `scale(${frame.clientWidth / 1920})`; };
  new ResizeObserver(fit).observe(frame);
  fit();
});
```

Keep `background.png` in the same folder as your HTML file.
