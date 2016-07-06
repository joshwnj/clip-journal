#!/usr/bin/env electron

// delay between polling the clipboard for changes
const watchDelay = 1000

// target file to append clip entries to
const targetFile = process.argv[2]
if (!targetFile) {
  console.error(`Usage: ${process.argv[1]} <target>`)
  process.exit(1)
}

require('../index.js')({
  targetFile
})
