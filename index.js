const readline = require('readline-sync');

function start() {
    const content = {};

    content.searchTerm = askAndReturnSearhTerm();

    function askAndReturnSearhTerm() {
        return readline.question('Type Wikipidia searh term: ');
    }

    console.log(content);
}

start();