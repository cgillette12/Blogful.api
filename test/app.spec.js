'use strict';
/*global request*/
const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containitng "Hello, world!" ', () => {
    return request(app)
      .get('/')
      .expect(200, 'Hello, world!');
  });
});