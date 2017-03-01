'use strict';

module.exports = {
  sudo: false,
  os: ['linux', 'osx'],
  language: 'node_js',
  node_js: [ 'node', '7', '6', '5', '4', '0.12', '0.10' ],
  matrix: {
    allow_failures: [
      {node_js: '4'},
      {node_js: '0.12'},
      {node_js: '0.10'}
    ]
  }
};
