'use strict';

module.exports = {
  sudo: false,
  os: ['linux', 'osx'],
  language: 'node_js',
  node_js: [ 'node', '6', '4', '0.12', '0.10' ],
  matrix: {
    allow_failures: [
      {node_js: '4'},
      {node_js: '0.12'},
      {node_js: '0.10'}
    ]
  }
};
