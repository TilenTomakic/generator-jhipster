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

const fixPath = './generators/client/templates/angular/src/main/webapp/app/jsf';
const toBeCut = './generators/client/templates/angular/src/main/webapp/app/';
const files = walk(fixPath);

console.log(files);

const toInsert = [];
for (const f of files) {
    let fi = f;
    if (!f.endsWith('.ejs')) {
        console.log('ranaming ' + f);
        fs.renameSync(f, f + '.ejs');
        fi += '.ejs';
    }
    fi = fi.substring(0, fi.length - 4);
    toInsert.push(fi.substring(toBeCut.length));
}

console.log(toInsert);
// process.exit(0);

const angularFilesPath = 'generators/client/files-angular.js';
const fileAngularTxt = fs.readFileSync(angularFilesPath, {encoding:'utf8'});
console.log(fileAngularTxt);

const iS = fileAngularTxt.indexOf('// JSF START') + '// JSF START'.length;
const iE = fileAngularTxt.indexOf('// JSF END');

console.log("CUT OUT ==========");
console.log(fileAngularTxt.substring(iS, iE));
console.log("==========");
console.log("==========");
const newtxt = fileAngularTxt.substring(0, iS + 1) + toInsert.map(x => '                \'' + x + '\',\n').join('') + '                ' + fileAngularTxt.substring(iE);
console.log(newtxt);
console.log("==========");
fs.writeFileSync(angularFilesPath, newtxt, {encoding:'utf8'});
