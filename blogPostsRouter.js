const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// create a few blog posts
BlogPosts.create(
  'My First Blog Post',
  'Photo booth prism ethical, hella cornhole selvage tofu. Meggings plaid fashion axe, adaptogen literally aesthetic fam whatever cronut tbh single-origin coffee kombucha. Ennui copper mug venmo blue bottle. Trust fund chillwave craft beer DIY, vaporware sriracha meditation tumblr 8-bit gastropub godard. Chia humblebrag etsy, iPhone gluten-free messenger bag enamel pin. Kale chips artisan literally authentic, knausgaard coloring book iPhone narwhal selvage ugh. Salvia offal tacos chambray. Freegan next level kickstarter taiyaki. Post-ironic roof party bitters actually YOLO, gluten-free sustainable flexitarian meh adaptogen.',
  'Brenda Storer'
);

BlogPosts.create(
  'Another Blog Post!',
  'Ramps venmo actually tote bag before they sold out 8-bit cray street art YOLO normcore. Truffaut asymmetrical pickled narwhal, blog vegan gentrify before they sold out try-hard man bun. Cronut hashtag photo booth gochujang 8-bit listicle, tote bag art party jean shorts vape whatever try-hard distillery blog heirloom.',
  'Ritika Nigam'
);

// return all current blog posts at the root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// create a new blog post
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

// update a blog post
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

// delete a blog post
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;
