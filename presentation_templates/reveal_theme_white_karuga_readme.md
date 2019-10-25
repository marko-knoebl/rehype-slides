reveal_theme_white_karuga is a modified version of the original white reveal theme.

main differences:
- smaller font sizes
- main slide content is left-aligned

How to create the file reveal_theme_white_karuga.css:

- clone the reveal.js repo
- npm install
- copy css/theme/source/white.scss to css/theme/source/white-karuga.scss
- edit white-karuga.scss:
line 24: $mainFontSize: 24px;
add to the end of the file:

```css
.reveal .slides {
  text-align: unset;
}
.reveal .slides h1 {
  text-align: center;
}
.reveal .slides section,
.reveal .slides section > section {
  line-height: unset;
}
.reveal .slides {
  line-height: 1.5;
}
.reveal .slides pre {
  font-size: 1em;
  line-height: 1.2;
  width: unset;
}
.reveal .slides pre code {
  padding: 0.5em 1em;
}
.reveal .slides p {
  line-height: 1.5;
  margin-bottom: 1em;
}
.reveal .slides > section,
.reveal .slides > section > section {
  transition-duration: 0.4s;
}
```

- npm run build -- css-themes
- the result will be located in css/theme/white-karuga.css
