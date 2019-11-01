# clear up presentation_templates

there should be fewer files: reveal.html, reveal_karuga.html, deck.html, standard.html

Assets like css or js should be in a separate npm package

# create a CLI

example usage:

```bash
npx slides my_slides.md my_slides.html
npx slides my_slides.md my_slides.html --heading-separators --highlight
```

# make reveal themes configurable

instead of "format": "revealjs" / "revealjs_karuga", use:
"revealjs_options": {"theme": "white_karuga"}
