const assert = require('assert');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fetchNewsListing = require('./index').fetchNewsListing;
const fetchNewsArticle = require('./index').fetchNewsArticle;

const TEST_ARTICLE_URL = 'http://grodnolib.by/jsppages/calendar-/params/d1/25-05-2016/d2/25-06-2016/dsID/1596945294/DS_SELECTED_ID/180151752122/DS_CATEGORIES/0.html';

describe('grodnolib.by', () => {

  describe('main page', () => {
    it('should link to news archive', () => {
      const NEWS_ARCHIVE_URL = '/jsppages/calendar-/params/dsID/1596945294/DS_CATEGORIES/0.html';

      return fetch('http://grodnolib.by/').then(res => res.text()).then((html) => {
        const $ = cheerio.load(html);
        function newsArchive() {
          return $(this).text() === 'Архіў навін';
        }
        const href = $('#centerbar a').filter(newsArchive).attr('href');
        assert.equal(href, NEWS_ARCHIVE_URL);
      });
    });
  });
});

describe('fetchNewsListing', () => {
  it('should fetch 27 articles from May 25th to June 25th 2016', () => {
    return fetchNewsListing('2016-05-25', '2016-06-25').then((articles) => {
      assert.equal(articles.length, 27);
      assert.equal(articles[24].title, 'Прэзентацыя кнігі “На Гродзенскім бруку”');
      assert.equal(articles[24].url, TEST_ARTICLE_URL);
    });
  });
});

describe('fetchNewsArticle', () => {
  it('should fetch date and text of a specific article', () => {
    return fetchNewsArticle({ url: TEST_ARTICLE_URL }).then((article) => {
      assert.equal(article.title, undefined);
      assert.equal(article.url, TEST_ARTICLE_URL);
      assert.equal(article.date, '24.06.2016');
      assert.equal(article.text.match('30 чэрвеня 2016 года').index, 256);
      assert.equal(article.text.match('вул.Замкавая,20').index, 324);
      assert.equal(article.text.match('Пачатак – у 17.00').index, 342);
    });
  });
});
