const mongo = require('./mongo');

const {Post} = mongo;

describe('mongo', () => {
  it('stats', async () => {
    const stats = mongo.stats();
    const res = await Promise.all(stats);
    expect(res.length).toBe(1);
  });

  it('post', async () => {
    const post = new Post;
    post.title = '帮我找本书';
    try {
      const re = await post.save();
      expect(re).toHaveProperty('_id');
    } catch (e) {
      expect(e).toHaveProperty('errors');
    }
  });

  it('post:prepare data', async () => {

  });
});
