const readline = require('readline-sync');
const robots = {
    text: require('./robots/text')
}

function start() {
    const content = {};

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    robots.text(content.searchTerm);

    function askAndReturnSearchTerm() {
        //console.log(readline.question('Type Wikipidia searh term: '));
        return readline.question('Type Wikipidia searh term: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ');
        const selectedPrefixText = prefixes[selectedPrefixIndex];

        return selectedPrefixText;
    }

    console.log(content);
}

start();