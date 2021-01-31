/** @type {import('@jest/types/build/Config').DefaultOptions} */
const path = require('path');
const fs = require('fs');
let distFilePaths = ['./jest.setup.js'];
fs.readdirSync(path.join(__dirname, './dist'), (err, files) => {
  distFilePaths = [].concat.apply(distFilePaths, files);
});

const config = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  setupFiles: distFilePaths,
};

module.exports = config;
