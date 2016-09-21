'use strict';
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todomodel = AV.Object.extend('Todomodel');



var todomodel = new Todomodel();


// add Todo list
// Todo.prototype.save = new Promise(function(resolve, reject) {
//     var todo = {
//       content: this.content
//     }
//     todomodel.set('content', todo.content);
//     todomodel.save().then(function(results){
//       resolve(results);
//     }, function(err){
//       reject(err);
//     });
// });


// Todo.prototype.findAll = new Promise(function(next) {
//     var query = new AV.Query(Todomodel);
//     query.descending('createdAt');
//     query.find().then(function(results){
//       resolve(results);
//     }, function(err){
//       reject(err);
//     });
// });

module.exports = Todo1;
