var Algorithmia  = require('algorithmia');
var credential  = require('../credentials/credentials.json').algorithmia.apiKey;

async function robot(content) {
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    //breakContentIntoSentences();

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuth = Algorithmia.client(credential);
        const wikipediaAlgorithmia = algorithmiaAuth.algo('web/WikipediaParser/0.1.2?timeout=300'); // timeout is optional
        const wikipediaResponse = await wikipediaAlgorithmia.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();

        content.sourceContentOriginal = wikipediaContent.content;
    }

    function sanitizeContent(content) {
        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal);
        const withoutMarkdown = removeMarkdown(withoutBlankLines);
        const withoutDateInParenteses = removeDateInParenteses(withoutMarkdown);
        console.log(withoutDateInParenteses);

        function removeBlankLines(text) {
            const allLines = text.split('\n');

            const withoutBlankLines = allLines.filter(line => {
                if (line.trim().lenght === 0) return false;

                return true;
            });

            return withoutBlankLines;
        }

        function removeMarkdown(text) {
            //console.log(text);
            const withoutMarkdown = text.filter(line => {
                if (line.trim().startsWith('=')) return false;

                return true;
            });

            return withoutMarkdown.join(' ');
        }

        function removeDateInParenteses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
        }
    }
}

module.exports = robot;