let package = require('../../package.json');

module.exports = {
    title: 'Terun JS',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav:[
            { text: `Versão: ${package.version}`, link: '/start' }
        ],
        sidebar: [
            '/start',
            '/config',
            '/plugins',
            '/lifecycle',
            '/engine',
            '/changelog'
        ]
    }
}
