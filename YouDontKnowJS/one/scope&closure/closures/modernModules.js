const myModule = (function() {
  const modules = {};
  function define (name, deps, impl) {
    for(let i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }

  function get (name) {
    return modules[name];
  }
  return {
    define,
    get
  }
})();

myModule.define('bar', [], function () {
  function hello (name) {
    return `Hi, ${name}!`;
  }

  return { hello };
});

myModule.define('foo', ['bar'], function (bar) {
  function awesome (name) {
    console.log(bar.hello(name).toUpperCase());
  }

  return { awesome };
});

const bar = myModule.get('bar');
const foo = myModule.get('foo');

console.log(bar.hello('Shirley'));

foo.awesome('Shirley');
