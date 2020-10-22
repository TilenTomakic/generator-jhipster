const fs = require('fs');

let walk = function(dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
};

const fixPath = './generators/client/templates/angular/src/main/webapp/content/builder';
const toBeCut = '.generators/client/templates/angular/src/main/webapp/content/builder';

const files = walk(fixPath);
files.forEach(x => {
   console.log(`{ file: '${ x.substring('./generators/client/templates/angular/src/main/webapp/'.length) }', method: 'copy' },`);
});
