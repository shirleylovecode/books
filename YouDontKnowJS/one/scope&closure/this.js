// 再JS中使用的是词法作用域，但是this的绑定机制基本上是动态作用域的。因此会引起一些问题。
// 词法作用域是声明的时候确定了
// 动态作用域是在运行的时候一层层去找调用该函数的位置

const obj = {
  count: 234,
  // 利用闭包，将this赋值给self，setTimeout回调函数执行时，会找到cool对应的词法作用域
  cool1: function () {
    const self = this;
    setTimeout(function(){
      console.log(this.count);
      console.log(self.count);
    }, 100);
  },

  // 箭头函数用当前的词法作用域覆盖了this的值，相当于继承了cool2中this绑定
  cool2: function() {
    setTimeout(() => {
      console.log(this.count);
    }, 100);
  },

  // 利用bind函数，明确指明回调函数中this的值
  cool3: function () {
    setTimeout(function(){
      console.log(this.count);
    }.bind(this), 100)
  }
}

obj.cool1();
obj.cool2();
obj.cool3();
