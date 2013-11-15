How to run the tests:
---------------------

1) Install Intern (https://github.com/theintern/intern#quick-start),
using the parent directory of your dui checkout as your my/project/root installation directory:

```
$ cd /my/project/root
$ npm install intern --save-dev
```

2) Install selenium server 2.37.0 (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.37.0.jar
```

3) Run the intern tests:

```
$ node /my/project/root/node_modules/intern/runner.js config=dui/tests/intern/default-conf
```

