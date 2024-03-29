const presets = [
    [
        "@babel/env",
        {
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: "usage",
        },
    ]
];
const plugins = [
  ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
  ["partial-application"],
]

module.exports = { presets, plugins };
