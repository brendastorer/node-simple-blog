const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');

      res.body.length.should.be.at.least(2);
      const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add an blog post on POST', function() {
    const newPost = {
      title: 'A Test Blog Post',
      content: 'Here is a story.',
      author: 'David S. Pumpkins'
    };

    return chai.request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
      res.body.title.should.equal(newPost.title);
      res.body.id.should.not.be.null;
      res.body.publishDate.should.not.be.null;
      res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
    });
  });

  it('should update blog post on PUT', function() {
    const updatePost = {
      title: 'A Test Blog Post (updated)',
      content: 'Here is a better story.',
      author: 'Santa Claus'
    };

    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updatePost.id = res.body[0].id;
      return chai.request(app)
        .put(`/blog-posts/${updatePost.id}`)
        .send(updatePost);
    })
    .then(function(res) {
      res.should.have.status(204);
    });
  });

  it('should delete blog post on DELETE', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      return chai.request(app)
        .delete(`/blog-posts/${res.body[0].id}`);
    })
    .then(function(res) {
      res.should.have.status(204);
    });
  });
});
