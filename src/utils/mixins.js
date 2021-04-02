/*
 * @usageFile: 快捷键：crtl+alt+i
 * @usageFunc: 快捷键：crtl+alt+t
 * @Descripttion:
 * @version:
 * @Author: 叶梦轩
 * @Date: 2021-03-31 14:42:44
 * @LastEditors: ymx
 * @LastEditTime: 2021-04-02 10:04:24
 */
/**
 * Created by FDD on 2017/9/18.
 * @desc mixin class
 */
const copyProperties = (target, source) => {
  for (let key of Reflect.ownKeys(source)) {
    if (
      !key.match(
        /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
      )
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
};
// ES6 Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。
const mixin = (...mixins) => {
  class Mix {}
  // 以编程方式给Mix类添加mixin的所有方法和访问器
  for (let key in mixins) {
    let mixin = mixins[key];
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }
  return Mix;
};

export default mixin;
