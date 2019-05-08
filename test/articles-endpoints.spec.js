'use strict';
/*global request*/
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeArticlesArray } = require('./articles.fixtures');


describe('Articles Endpoints', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('blogful_articles').truncate());

  afterEach('cleanup', () => db('blogful_articles').truncate());
  describe('GET /articles', () => {
    context('Given no articles', () => {
      it('responds with 200 and an empty list', () => {
        return request(app)
          .get('/articles')
          .expect(200, []);
      });
    });
    context('Given there are articles in the database', () => {
      const testArticles = [
        {
          id: 1,
          date_published: '2029-01-22T16:28:32.615Z',
          title: 'First test post!',
          style: 'How-to',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
          id: 2,
          date_published: '2100-05-22T16:28:32.615Z',
          title: 'Second test post!',
          style: 'News',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
          id: 3,
          date_published: '1919-12-22T16:28:32.615Z',
          title: 'Third test post!',
          style: 'Listicle',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        },
        {
          id: 4,
          date_published: '1919-12-22T16:28:32.615Z',
          title: 'Fourth test post!',
          style: 'Story',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum molestiae accusamus veniam consectetur tempora, corporis obcaecati ad nisi asperiores tenetur, autem magnam. Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam?'
        },
      ];
      
      beforeEach('insert articles', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles);
      });

      it('GET /articles responds with 200 and all of the articles', () => {
        return request(app)
          .get('/articles')
          .expect(200, testArticles);
      });
    });
  });
  describe('GET /articles/:article_id', () => {
    context('Given no articles', () => {
      it('responds with 404', () => {
        const articleId = 123456;
        return request(app)
          .get(`/articles/${articleId}`)
          .expect(404, { error: { message: 'Article doesn\'t exist' } });
      });
    });

    context('Given there are articles in the database', () => {
      const testArticles = makeArticlesArray();

      beforeEach('insert articles', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles);
      });
      it('GET /article/:article_id responds with 200 and the specified article', () => {
        const articleId = 2;
        const expectedArticle = testArticles[articleId - 1];
        return request(app)
          .get(`/articles/${articleId}`)
          .expect(200, expectedArticle);
      });
    });
  });
});