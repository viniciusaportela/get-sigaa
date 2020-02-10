const request = require('request-promise');

//Add support for fetching pages with older version of TLS
require('tls').DEFAULT_MIN_VERSION = 'TLSv1'

const URL = 'https://sigaa.ifpa.edu.br/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=31486';

(async () => {
  try {
    const html = await request(URL)
    const $ = require('cheerio').load(html)

    console.log($('.linhaPar').length)
    console.log($('.linhaImpar').length)
  } catch (e) { console.log(e) }
})();