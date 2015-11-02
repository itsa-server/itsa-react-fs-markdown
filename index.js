/*eslint no-empty: 0*/

'use strict';

let CACHE = {},
    BASE_DIR;

const Path = require('path'),
      fs = require('fs'),
      hljs = require('highlight.js'),
      React = require('react'),
      Remarkable = require('remarkable');

const md = new Remarkable({
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

const ReactMarkdown = React.createClass({
    render: function() {
        const ast = md.render(this.props.source || '');
        return React.DOM.div({dangerouslySetInnerHTML: {__html: ast}});
    }
});

const FsMarkdown = {
    readFile(filename) {
        if (!filename.toUpperCase().endsWith('.MD')) {
            filename += '.MD';
        }
        if (!CACHE[filename]) {
            CACHE[filename] = new Promise((resolve) => {
                fs.readFile(Path.join(BASE_DIR, filename), 'utf8', (err, data) => {
                    if (err) {
                        resolve({__html: ''});
                    }
                    else {
                        const Component = React.createElement(ReactMarkdown, {source: data});
                        resolve({__html: React.renderToStaticMarkup(Component)});
                    }
                });
            });
        }
        return CACHE[filename];
    },

    clearCachedFile(filename) {
        if (!filename.toUpperCase().endsWith('\.MD')) {
            filename += '.MD';
        }
        delete CACHE[filename];
    },

    clearCache() {
        CACHE = {};
    }
};

module.exports = baseDir => {
    BASE_DIR = baseDir;
    return FsMarkdown;
};