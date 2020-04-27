let prettier = require('prettier')

let result = prettier.format(`
import Math from './Math';

function a(n, m) {}

function b() {}

function c() { return b(); }

function main() {
  return a() + b() + c();
}

function Bb() { return <div />; }

function Aaa() { return <Bb /> }

export function smth() {
  return main();
}

let state = {};


type State = {a: number};

export const TAU = Math.PI * 2;

export default function aaa(): State {
  return state;
}
`, {
  parser: 'babel',
  plugins: ['./plugin'],
});

console.log(result);
