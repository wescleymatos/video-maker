var Algorithmia  = require('algorithmia');
var credential  = require('../credentials/credentials.json').algorithmia.apiKey;

function robot(content) {
    fetchContentFromWikipidia(content);
    //sanitizeContent();
    //breakContentIntoSentences();

    function fetchContentFromWikipidia(content) {
        var input = {
            "articleName": content.searchTerm,
            "lang": "en"
          };

        Algorithmia.client(credential)
            .algo('web/WikipediaParser/0.1.2?timeout=300') // timeout is optional
            .pipe(content)
            .then(function(response) {
                console.log(response.get());
            });
    }
}

module.exports = robot;