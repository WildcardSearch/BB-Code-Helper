# BB Code Helper 0.0.2

Adds a context submenu to tag quotes, images, and links for as BB Code to be pasted into forum posts.

## Selection

Highlight text and choose `Quote Selection` from the `BB Code Helper` context submenu to copy the text as a forum quote using BB Code

```
[quote]selected text[/quote]
```

## Links

Right click a link and select `Tag Link` from the `BB Code Helper` context submenu to copy a BB Code representation of the link to the clipboard. If there is text inside the `<a/>`, it will be used as a caption for the BB Code, if not, the simple version will be used.

```
[url=http://www.url.com]Caption[/url]

OR

[url]http://www.url.com[/url]
```

## Images

Right click an image and select `Tag Image` or `Tag Image With Link` from the `BB Code Helper` context submenu to copy a BB Code representation of the image to the clipboard.

```
[img]{imgUrl}[/img]
```

If tagging the image and the link (if any), the link will be wrapped in `url` BB Code.

```
[url={linkUrl}][img]{imgUrl}[/img][/url]
```

## Multi-Mode

In this mode, tags are appended to the clipboard, rather than replacing the current clipboard content (default)

## Clear The Clipboard

Added for convenience.