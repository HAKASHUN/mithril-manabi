var assert = require('power-assert');

var m = require('mithril');
var mq = require('mithril-query');

var Todo = require('../client/todo_model');
var MyTodoApp = require('../client/app');

describe('MyTodoApp.view via mithril-query', function() {
    it('has no items', function() {
        var controller = new MyTodoApp.controller(true);
        var view = mq(MyTodoApp.view(controller));
        assert(view.has('table > tbody'));
        assert(view.find('tr').length === 0);
    });
    it('has three items', function() {
        var controller = new MyTodoApp.controller(true);
        controller.vm.list(['task1', 'task2', 'task3'].map(function(label) {
            return new Todo({description: label});
        }));
        var view = mq(MyTodoApp.view(controller));
        assert(view.has('table'));
        assert(view.find('tr').length === 3);
        assert(view.contains('task1'));
    });
});