# prettier-plugin-declaration-order

Order module level functions by their usage.

## Rules

Keywords order:

1. `import`
2. `export default`
3. `export let/const`
4. `export function`
5. `let/const/function`

Each function has its direct scope dependencies placed above and functions used
below.
