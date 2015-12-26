var glob = require("glob");
var path = require("path");

module.exports = function(source) {
  this.cacheable();
  var regex = /(import +(\w+) from ([\'\"])(.*)\3)(?: then (.*))?;$/gm;
  var importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  var importFiles = /import +([\'\"])(.*?)\1/gm;

  var resourceDir = path.dirname(this.resourcePath);

  function replacer(match, regularMatch, importName, quote, filename, action) {
    var modules = [];
    var withModules = false;
    if (!glob.hasMagic(filename)) return match;

    var imports = glob
      .sync(filename, {cwd: resourceDir})
      .map(function(file, index) {
        var fileName = quote + file + quote;
        if (regularMatch.match(importModules)) {
          var moduleName = importName + index;
          modules.push(moduleName);
          withModules = true;
          return 'import * as ' + moduleName + ' from ' + fileName;
        } else if (regularMatch.match(importFiles)) {
          return 'import ' + fileName;
        }
      })

    var lines = [];

    if (action) {
      for (var i = 0; i < imports.length; i++) {
        lines.push(imports[i]);
        lines.push(action.replace(importName, modules[i]));
      }
    } else {
      lines = imports;
    }

    return lines.join(';\n');
  }
  var res = source.replace(regex, replacer);
  return res;
};
