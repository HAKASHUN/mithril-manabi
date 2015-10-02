var m = require('mithril');

var bootstrapComponent = {
    controller: function() {},
    view: function() {
        return [
            m('.container', [
                m('.page-header', [
                    m('h1', 'Alerts')
                ]),
                m('.alert.alert-success[route=\'alert\']', [
                    m('strong', 'Well done!'),
                    'You successfully read this important alert message.'
                ])
            ])
        ]
    }
};

m.mount(document.getElementById('root'), bootstrapComponent);