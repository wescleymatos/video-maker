const readline = require('readline-sync');
const robots = {
    text: require('./robots/text')
}

async function start() {
    const content = {};

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    await robots.text(content);

    function askAndReturnSearchTerm() {
        return readline.question('Type Wikipidia searh term: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of'];
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ');
        const selectedPrefixText = prefixes[selectedPrefixIndex];

        return selectedPrefixText;
    }
}

start();