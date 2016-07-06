'use strict'

const clipboardWatcher = require('electron-clipboard-watcher')
const electron = require('electron')
const fs = require('fs')
const notifier = require('node-notifier')
const path = require('path')

const app = electron.app
const globalShortcut = electron.globalShortcut
const Tray = electron.Tray
const Menu = electron.Menu

function createTray (app) {

  const tray = new Tray(path.join(__dirname, 'assets', 'logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: () => app.quit()
    }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

module.exports = function (opts) {
  const {
    targetFile,
    watchDelay
  } = opts

  const targetDir = path.dirname(targetFile)
  const writeStream = fs.createWriteStream(targetFile, { flags: 'a+' })

  let imageSeq = 0

  app.on('quit', () => {
    writeStream.end()
  })

  app.on('ready', () => {
    createTray(app)

    clipboardWatcher({
      watchDelay,
      onTextChange: (text) => {
        writeStream.write(`
~~~
time: ${new Date().toString()}
~~~

${text}

----
`)

        notifyTextChange(text)
      },
      onImageChange: (image) => {
        console.log('image changed', image.getSize())
        imageSeq += 1
        const imageFilename = `image-${imageSeq}.png`
        const imagePath = path.join(targetDir, imageFilename)
        fs.writeFile(imagePath, image.toPng(), (err, res) => {
          if (err) { return console.error(err) }

          const size = image.getSize()
          writeStream.write(`

~~~
time: ${new Date().toString()}
width: ${size.width}
height: ${size.height}
~~~

![${imageFilename}](${imageFilename})

----
`)

          notifyImageChange(imagePath)
        })
      }
    })
  })

  function notifyTextChange (text) {
    notifier.notify({
      title: 'Clip: Text',
      message: text,
      icon: path.join(__dirname, 'assets', 'logo.png')
    }, (err) => {
      if (err) {
        console.error('Notification failed', err)
      }
    })
  }

  function notifyImageChange (imagePath) {
    notifier.notify({
      title: 'Clip: Image',
      message: path.basename(imagePath),
      icon: imagePath
    }, (err) => {
      if (err) {
        console.error('Notification failed', err)
      }
    })
  }
}
