let prettier = require('prettier');

test('basic formatting', () => {
  let expected = prettier.format(`
    import Math from './Math';
    let state = {};
    type State = {a: number};
    export default function aaa(): State {
      return state;
    }
    export const TAU = Math.PI * 2;
    export function smth() {
      return main();
    }
    function main() {
      return a() + b() + c();
    }
    function a(n, m) {}
    function c() { return b(); }
    function b() {}
    function Aaa() { return <Bb /> }
    function Bb() { return <div />; }
  `, {
    parser: 'babel'
  });

  let actual = prettier.format(`
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

  expect(actual).toEqual(expected);
});
