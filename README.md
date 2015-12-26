# better-import-glob
ES6 import with glob patterns (preloader for Webpack)

Expands globbing patterns for ES6 `import` statements and adds an optional action after the expanded import statement.
Very much inspired by https://github.com/terpiljenya/import-glob.

---
```js
import mod from "./foo/**/*.js" then mod(bleh);
```
Expands into
```js
import * as module0 from "./foo/1.js";
module0.default(bleh);

import * as module1 from "./foo/bar/2.js";
module1.default(bleh);

import * as module2 from "./foo/bar/3.js";
module2.default(bleh);

```
---
__For side effects:__

```js
import "./foo/**/*.scss";
```
Expands into
```js
import "./foo/1.scss";
import "./foo/bar/2.scss";
```
---

## Install
```sh
npm install better-import-glob --save-dev
```

## Usage
You can use it one of two ways, the recommended way is to use it as a preloader

```js
{
  module: {
    preloaders: [{
      test: /\.js/,
      loader: 'better-import-glob'
    }]
  }
}
```

Alternatively you can use it as a chained loader
```js
require('!better-import-glob!foo/bar.js')
```
