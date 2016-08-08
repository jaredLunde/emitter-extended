const fs = require('fs')
const path = require('path')

function copyFileSync(source, target) {
  var targetFile = target

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }
  console.log('Linking:',
              path.relative(__dirname, source),
              '->',
              path.relative(__dirname, targetFile))
  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

function copyFolderRecursiveSync(source, targetFolder) {
  var files = []

  //check if folder needs to be created or integrated
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(function (file) {
      var curSource = path.join(source, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, path.join(targetFolder,
                                                     path.basename(curSource)))
      } else {
        copyFileSync(curSource, targetFolder)
      }
    })
  }
}

const libPath = path.join(path.dirname(__dirname), 'src')
copyFolderRecursiveSync(libPath, path.dirname(libPath))
