/*eslint no-empty: 0*/

'use strict';

var CACHE = {},
    BASE_DIR,
    Path = require('path'),
    fs = require('fs'),
    hljs = require('highlight.js'),
    React = require('react'),
    Remarkable = require('remarkable'),
    endsWith, md;

endsWith = function(str, test, caseInsensitive) {
    return (new RegExp(test+'$', caseInsensitive ? 'i': '')).test(str);
};

md = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true,
    quotes: '“”‘’',
    linkify: true,
    langPrefix:   'hljs language-',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }
        try {
            return hljs.highlightAuto(str).value;
        } catch (__) {}
        return ''; // use external default escaping
    }
});

var ReactMarkdown = React.createClass({
    render: function() {
        var ast = md.render(this.props.source || '');
        return React.DOM.div({dangerouslySetInnerHTML: {__html: ast}});
    }
});

var FsMarkdown = {
    readFile: function(filename) {
        if (!endsWith(filename.toUpperCase(), '.MD')) {
            filename += '.MD';
        }
        if (!CACHE[filename]) {
            CACHE[filename] = new Promise(function(resolve) {
                fs.readFile(Path.join(BASE_DIR, filename), 'utf8', function(err, data) {
                    if (err) {
                        resolve({__html: ''});
                    }
                    else {
                        var Component = React.createElement(ReactMarkdown, {source: data});
                        resolve({__html: React.renderToStaticMarkup(Component)});
                    }
                });
            });
        }
        return CACHE[filename];
    },

    clearCachedFile: function(filename) {
        if (!endsWith(filename.toUpperCase(), '.MD')) {
            filename += '.MD';
        }
        delete CACHE[filename];
    },

    clearCache: function() {
        CACHE = {};
    }
};

module.exports = function(baseDir) {
    BASE_DIR = baseDir;
    return FsMarkdown;
};