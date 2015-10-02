
var LinkPattern = /((?:(?:mailto|http|https|ftp):[\x21-\x7E]*)|(?:[A-Z][a-z]+(?:[A-Z][a-z]+)+))/mg;
var WikiName = /([A-Z][a-z]+(?:[A-Z][a-z]+)+)/;

var PlainTextType = 1;
var LinkType = 2;
var WikiNameType = 3;

// model
var WikiPage = function(data, isInitial) {
    this.source = m.prop(data.source);
    this.pageTitles = m.prop(data.pageTitles);
};


WikiPage.read = function(pageName) {
    return m.request({
        method: 'GET',
        url: '/api/' + pageName,
        type: WikiPage
    });
};

WikiPage.save = function(pageName, source) {
    return m.request({
        method: 'POST',
        url: '/api/' + pageName,
        data: {
            source: source
        }
    });
};

WikiPage.tokenize = function(sourceText) {
    return sourceText.split(LinkPattern)
        .map(function(fragment) {
            if (LinkPattern.test(fragment)) {
                if (WikiName.test(fragment)) {
                    return { type: WikiNameType, text: fragment };
                } else {
                    return { type: LinkType, text: fragment };
                }
            } else {
                return { type: PlainTextType, text: fragment };
            }
        });
};

WikiPage.prototype.contains = function(pageName) {
    return this.pageTitles().indexOf(pageName) !== -1;
};


// view model

var vm = {
    page: null,
    edit: null,
    read: function(pageName) {
        vm.page = WikiPage.read(pageName);
    },
    startEdit: function() {
        vm.edit = m.prop(vm.page().source());
    },
    save: function(pageName) {
        WikiPage.save(pageName, vm.edit());
        vm.page().source(vm.edit());
    }
};

// ViewPage

var ViewPage = {
    controller: function() {
        var self = this;
        self.pageName = m.route.param('pagename');
        self.edit = function() {
            vm.startEdit();
            m.route('/' + self.pageName + '/edit');
        };
        vm.read(self.pageName);
    },
    view: function(ctrl) {
        return m('div', [
            m('h1', ctrl.pageName),
            m('pre', WikiPage.tokenize(vm.page().source()).map(function(token) {
                switch(token.type) {
                    case PlainTextType:
                        return token.text;
                    case LinkType:
                        return m('a', { href: token.text }, token.text);
                    case WikiNameType:
                        if (vm.page().contains(token.text)) {
                            return m('a', {href: '/' + token.text, config: m.route}, token.text);
                        } else {
                            return m('a', {href: '/' + token.text, config: m.route}, token.text + '?');
                        }
                }
            })),
            m('button', {onclick: ctrl.edit}, '編集')
        ]);
    }
};

// EditPage

var EditPage = {
    controller: function() {
        var self = this;
        self.pageName = m.route.param('pagename');
        self.preview = function() {
            m.route('/' + self.pageName + '/preview');
        };
        self.discard = function() {
            m.route('/' + self.pageName);
        };
    },
    view: function(ctrl) {
        return m('div', [
            m('h1', ctrl.pageName),
            m('textarea', { onchange: m.withAttr('value', vm.edit) }, vm.edit()),
            m('br'),
            m('button', {onclick: ctrl.discard}, '破棄'),
            m('button', {onclick: ctrl.preview}, '確認')
        ]);
    }
};

// PreviewPage

var PreviewPage = {
    controller: function() {
        var self = this;
        self.pageName = m.route.param('pagename');
        self.edit = function() {
            m.route('/' + self.pageName + '/edit');
        };
        self.save = function() {
            vm.save(self.pageName);
            m.route('/' + self.pageName);
        }
    },
    view: function(ctrl) {
        return m('div', [
            m('h1', ctrl.pageName),
            m('pre', WikiPage.tokenize(vm.edit()).map(function(token) {
                switch(token.type) {
                    case PlainTextType:
                        return token.text;
                    case LinkType:
                        return m('span', { style: { "textDecoration" : "underline" } }, token.text);
                    case WikiNameType:
                        var suffix = vm.page().contains(token.text) ? '' : '?';
                        return m('span', { style: { "textDecoration" : "underline" } }, token.text + suffix);
                }
            })),
            m('button', {onclick: ctrl.edit}, '戻る'),
            m('button', {onclick: ctrl.save}, '保存')
        ]);
    }
};

// router
m.route.mode = 'pathname';
m.route(document.getElementById('root'), '/FrontPage', {
    '/:pagename': ViewPage,
    '/:pagename/edit': EditPage,
    '/:pagename/preview': PreviewPage
});

