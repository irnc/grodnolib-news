const fetch = require('node-fetch');
const cheerio = require('cheerio');
const moment = require('moment');

const magicNumber = '1020582162';

function fetchNewsListing(fromDate, toDate) {
  const param = (date) => moment(date).format('DD-MM-YYYY');
  const newsUrl = 'http://grodnolib.by/jsppages/calendar-' +
    `/params/d1/${param(fromDate)}/d2/${param(toDate)}/dsID/1596945294` +
    '/DS_CATEGORIES/0.html';

  return fetch(newsUrl).then(res => res.text()).then((html) => {
    const $ = cheerio.load(html);
    const news = $(`a.newslink${magicNumber}`).map(function () {
      return {
        title: $(this).text(),
        url: 'http://grodnolib.by' + $(this).attr('href'),
      };
    });
    return news;
  });
}

function fetchNewsArticle(article) {
  return fetch(article.url).then(res => res.text()).then((html) => {
    const $ = cheerio.load(html);
    const $date = $(`.newsimportantdate${magicNumber}`);
    const $text = $date.parent('td');

    return Object.assign({}, article, {
      date: $date.text(),
      text: $text.text(),
    })
  });
}

exports.fetchNewsListing = fetchNewsListing;
exports.fetchNewsArticle = fetchNewsArticle;
