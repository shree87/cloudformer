#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');

function modifyFiles(files, replacements, destination) {
  files.forEach((file) => {
    let fileContentModified = fs.readFileSync(file, 'utf8')

    replacements.forEach((v) => {
      fileContentModified = fileContentModified.replace(v.regexp, v.replacement)
    })

    file = file.replace('\.\/templates\/', './files/');
    ensureDirectoryExistence(file);
    fs.writeFileSync(file, fileContentModified, 'utf8')
  })
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function yamlName(name) {
  console.log('yamlName1', name);
  const newname = name.replace('/[^a-zA-Z]+/g', '');
  console.log('yamlName2', newname, name);
  return newname;
}

function lambdaName(name) {
  return name.replace('/[^a-zA-Z-]+/g', '');
}


module.exports = {
  modifyFiles,
  yamlName,
  lambdaName
};
