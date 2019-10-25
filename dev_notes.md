Structure of presentations:

Reveal.js:

```html
<div class="reveal">
  <div class="slides">
    <section class="stack past">
      <section class="past"></section>
    </section>
    <section class="stack present"></section>
    <section class="stack future"></section>
  </div>
  <div class="backgrounds"></div>
  <div class="progress"></div>
  <aside class="controls"></div>
  <div class="slide-number"></div>
  ...
</div>
```

Deck.js:

```html
<header></header>
<article>
  <section class="slide deck-current">
    ...
  </section>
  <section class="slide deck-next">...</section>
  <section class="slide deck-after">...
</article>
<footer></footer>
```

Webslides:

```html
<article id="webslides">
  <section>...</section>
</article>
```

Remark:

```html
<div class="remark-slides-area">
  <div class="remark-slide-container">
    <div class="remark-slide-scaler">
      <div class="remark-slide">
        <div class="remark-slide-content"></div>
      </div>
    </div>
  </div>
</div>
```

Marko:

```html
<div id="canvas">
  <div id="canvas-content">
    <section class="section">
      <section class="slide active"></section>
      <section class="slide inactive"></section>
    </section>
  </div>
</div>
```

# new format:

```html
<any class="presentation">
  <article/div class="slides">
    <section class="slide">...</section>
    <section class="slide">...</section>
  </article/div>
  <aside class="controls">...</aside>
</any>
```

```html
<any class="presentation">
  <article/div class="slides">
    <section class="slides-section">
      <section class="slide">...</section>
      <section class="slide">...</section>
    </section>
  </article/div>
  <aside class="controls">...</aside>
</any>
```
