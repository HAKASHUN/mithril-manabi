var m = require('mithril');
var Todo = require('./todo_model');

var vm = {
  init: function() {
      vm.list = m.prop([]);
  }
};

var MyTodoApp = {
    controller: function() {
        vm.init();
        this.vm = vm;
    },
    view: function(ctrl) {
        return m('table', [
            m('tbody', { id: 'items' }, ctrl.vm.list().map(function(entry) {
                return m('tr', entry.description())
            }))
        ])
    }
};

// testの為に
if (typeof document !== 'undefined') {
    m.mount(document.getElementById('root'), MyTodoApp);
}


module.exports = MyTodoApp;