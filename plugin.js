let prettier = require('prettier/parser-babel');
let types = require('@babel/types');
let traverse = require('@babel/traverse').default;
let toposort = require('toposort');

let babel = prettier.parsers.babel;

module.exports = {
  name: 'prettier-plugin-declaration-order',
  parsers: {
    babel: {
      ...babel,
      parse(...args) {
        let ast = babel.parse(...args);
        traverse(ast, {
          Program(path) {
            // TODO: check for cyclic dependencies

            let fns = path.node.body.filter(node => {
              let isExportedFn = types.isExportDeclaration(node) && types.isFunctionDeclaration(node.declaration);
              return types.isFunctionDeclaration(node) || isExportedFn;
            })

            let sorted = fns.slice().sort((node) => {
              if (types.isExportDeclaration(node)) {
                return -1;
              }
              return 0;
            });

            function getName(node) {
              let [name] = Object.keys(types.getOuterBindingIdentifiers(node));
              return name;
            }

            function getBody(node) {
              if (types.isExportDeclaration(node)) {
                return node.declaration.body;
              }
              if (types.isFunctionDeclaration(node)) {
                return node.body;
              }
              return null;
            }

            let map = new Map(sorted.map(f => [getName(f), f]));
            let edges = [];
            sorted.forEach((f, i) => {
              let fnName = getName(f);
              types.traverse(getBody(f), (node) => {
                if (types.isIdentifier(node) || types.isJSXIdentifier(node)) {
                  if (map.has(node.name)) {
                    edges.push([fnName, node.name]);
                  }
                }
              })
            });
            let ordered = toposort.array(Array.from(map.keys()), edges);

            let swaps = new Map();
            fns.forEach((f, i) => {
              swaps.set(getName(f), map.get(ordered[i]));
            });

            path.node.body.forEach((node, index) => {
              let name = getName(node);
              let replacement = swaps.get(name);
              if (replacement) {
                path.node.body[index] = replacement;
              }
            });
          },
        })
        return ast;
      },
    },
  },
};
