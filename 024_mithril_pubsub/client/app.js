var AddressFinder = {
    init: function() {
        PubSub.subscribe('address.find', AddressFinder.find)
    },
    find: function(msg, postalCode) {
        m.request({
            method: 'GET',
            url: '/api/getaddress',
            data: {
                postalcode: postalCode
            }
        }).then(function(data) {
                if(data) {
                    PubSub.publishSync('address.receive', data);
                }
            })
    }
};

AddressFinder.init();

// コンポーネント
var AddressForm = {
    controller: function(args) {
        var self = this;
        self.gotAddress = function(msg, address) {
            args.yomi(address[0].yomi);
            args.address(address[0].kanji);
        };
        self.token = PubSub.subscribe('address.receive', this.gotAddress);
        self.find = function() {
            PubSub.publish('address.find', args.postalCode());
        };
        self.onunload = function() {
            PubSub.unsubscribe(self.token);
        };
    },
    view: function(ctrl, args) {
        return m('div', [
            m('div', [
                '郵便: ',
                m('input', {maxlength:7, onchange: m.withAttr('value', args.postalCode)}, args.postalCode),
                m('button', {onclick: ctrl.find}, '住所検索'),
                m('div', [
                    '読み: ',
                    m('input', { onchange: m.withAttr('value', args.yomi), value: args.yomi() })
                ]),
                m('div', [
                    '住所: ',
                    m('input', { onchange: m.withAttr('value', args.address), value: args.address() })
                ])
            ])
        ])
    }
};

// メインコンポーネント
var AddressPage = {
    controller: function() {
        var self = this;
        self.postalCode = m.prop('');
        self.yomi = m.prop('');
        self.address = m.prop('');
        self.submit = function() {

        };
    },
    view: function(ctrl) {
        return [
            m('h3', '住所入力'),
            m.component(AddressForm, ctrl),
            m('button', {onclick: ctrl.submit}, '確認')
        ]
    }

};

m.mount(document.getElementById('root'), AddressPage);