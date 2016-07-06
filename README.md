# clip-journal

Seamlessly record your activities in a journal while you work, by making a copy of anything in the system clipboard.

## Install

```sh
npm i -g electron
npm i -g clip-journal
```

## Usage

You can start a journal anywhere. Just provide the path to a markdown file (it will be created if it doesn't already exist)

```sh
mkdir my-journal
clip my-journal/index.md
```

Now whenever you copy some text to the clipboard it will be appended to `index.md`, and if you copy an image it will be saved to the directory and embedded in the markdown file.

_Tip for OSX users:_ `Cmd-Ctrl-Shift-4` saves a screenshot to the clipboard rather than to a file

## Live preview

You might also like to use something like [`vmd`](https://github.com/yoshuawuyts/vmd) to get a live preview of the journal:

```sh
vmd index.md
```

## License

MIT
