var Algorithmia = require('algorithmia');
var credentialAlgorithmia = require('../credentials/credentials.json').algorithmia.apiKey;
var credentialWatson = require('../credentials/credentials.json').watson;
const sentenceBoundaryDetection = require('sbd');
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
    version: '2018-11-16',
    iam_apikey: credentialWatson.apikey,
    url: credentialWatson.url
});

async function robot(content) {
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    limitMaximumSentences(content);
    await fetchKeywordsAllSentences(content);

    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuth = Algorithmia.client(credentialAlgorithmia);
        const wikipediaAlgorithmia = algorithmiaAuth.algo('web/WikipediaParser/0.1.2?timeout=300'); // timeout is optional
        const wikipediaResponse = await wikipediaAlgorithmia.pipe(content.searchTerm);
        const wikipediaContent = wikipediaResponse.get();

        content.sourceContentOriginal = wikipediaContent.content;
    }

    function sanitizeContent(content) {
        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal);
        const withoutMarkdown = removeMarkdown(withoutBlankLines);
        const withoutDateInParenteses = removeDateInParenteses(withoutMarkdown);

        content.sourceContentSanitized = withoutDateInParenteses;

        function removeBlankLines(text) {
            const allLines = text.split('\n');

            const withoutBlankLines = allLines.filter(line => {
                if (line.trim().lenght === 0) return false;

                return true;
            });

            return withoutBlankLines;
        }

        function removeMarkdown(text) {
            const withoutMarkdown = text.filter(line => {
                if (line.trim().startsWith('=')) return false;

                return true;
            });

            return withoutMarkdown.join(' ');
        }

        function removeDateInParenteses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g, ' ');
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = [];

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized);
        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            });
        });
    }

    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences);
    }

    async function fetchKeywordsAllSentences(content) {
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonAndReturnKeywordsSentences(sentence.text);
        }
    }

    async function fetchWatsonAndReturnKeywordsSentences(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze(
                {
                    text: sentence,
                    features: {
                        keywords: {}
                    }
                },
                function (error, response) {
                    if (error) {
                        console.log(error);
                    }
    
                    const keywords = response.keywords.map(keyword => {
                        return keyword.text;
                    });
    
                    resolve(keywords);
                }
            );
        });
    }
}

module.exports = robot;