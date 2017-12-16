# BB Code Helper 0.2

Adds a context submenu to tag code, quotes, images, and links as BB Code or Markdown.

## Options

You may configure how many line breaks you would like inserted between tags when using `Multi-Mode`

## Quoting

Highlight text and choose `Quote Selection` from the `BB Code Helper` context submenu to copy the text as a forum quote using BB Code or Markdown.

```
[quote]{selection}[/quote]
```

OR

```
> {selection}
```

## Code Blocks

Highlight text and choose `Copy As Code` from the `BB Code Helper` context submenu to copy the text as a code block using BB Code or Markdown.

```
[code]{selection}[/code]
```

OR

```
``` 
{selection}
``` 
```

## Links

Right click a link and select `Tag Link` from the `BB Code Helper` context submenu to copy a BB Code representation of the link to the clipboard. If there is text inside the `<a/>`, it will be used as a caption for the BB Code or Markdown, if not, the simple version will be used.

```
[url={URL}]{Caption}[/url]

OR

[url]{URL}[/url]
```

OR

```
[{caption}]({url})
```

## Images

Right click an image and select `Tag Image` or `Tag Image With Link` from the `BB Code Helper` context submenu to copy a BB Code or Markdown representation of the image to the clipboard.

```
[img]{image URL}[/img]
```

OR

```
![]({url})
```

If tagging the image and the link (if any), the link will be wrapped in `url` BB Code.

```
[url={link URL}][img]{image URL}[/img][/url]
```

OR

```
[![]({image URL})]({link URL})
```

## Multi-Mode

In this mode, tags are appended to the clipboard, rather than replacing the current clipboard content (default)

## Clear The Clipboard

Added for convenience.