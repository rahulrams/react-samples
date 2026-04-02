# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])


Memorization

In react, memoization is all about performance optimization. At its core, its a strategy to avoid doing the same work twice. By "remembering" the results of expensive calculations or preventing unnecessary component re-renders, the application is kept snappy.

  1. React.memo: Component Memoization
	  By Default: when a parent component re-renders too - even if their props haven't 	changed. React.memo is a higher order component (HOC) that prevents his. React 	performs a shallow comparison of the props.
	  If the props are the same as last time, React skips rendering the component and 	reuses the last rendered result.
	2.useMemo: Value Memoization
	  useMemo is a hook that lets us cache the result of a calculation between re-renders.
	
	3. useCallback: function Memoization
	  useCallback is a hook that lets you cache a function definition itself between re-	renders.
	
	  In JavaScript function(){}===function(){} is false. Every time a component re-renders, any function defined inside is a 'new' function. THis causes child components wrapped in React.memo to re-render anyway because their 'prop' (function) looks different.

The solution is useCallback which ensures that the function reference stays the same unless its dependencies change.

For example:
	Unoptimized version
	
    const ItemList = ({ items, onItemClick }) => {
      console.log("Itemlist rendered");
      return (
        <ul>
          {items.map(i => <li key={i.id} onClick={onItemClick}>{i.name}</li>)}
        </ul>
      )
    };

    const ProductPage = ({ items, theme }) => {
      const [count, setCount] = useState(0);

      //1. Expensive calculation run on EVERY click of "Increment"
      const visibleItems = items.filter(item => item.proce < 100);

      //2. This function is "new" on every render, breaking child memoization
      const addToCard = () => {
        console.log("Added');
      }

      return (
        <div className={theme}>
          <h1>Count: {count}</h1>
          <button onClick = {()=> setCount(count+1)}>Increment</button>
          <ItemList items={visibleItems} onItemClick={addToCart} />
        </div>
      )
    }
  Unoptimized version
    // 1. Wrap the child in React.memo
    const ItemList = React.memo({ items, onItemClick } => {
      //Only logs when items or onItemClick change
      console.log("ItemList Rendered");

      return (
        <ul>
          {items.map(i => <li key={i.id} onClick={onItemCLick}>{i.name}</i>)}
        </ul>
      );
    });

    function ProductPage ({ items, theme }) => {
      const [count, setCount] = useState(0);

      //2. Memoize the filtered list
      const visibleItems = useMemo(()=> {
        retuen items.filter(item => item.price < 100);
      }, [items]); //Only re-runs if 'items' prop changes

      //Memoize the function reference
      const addToCard = useCallback(() => {
        console.log("Added');
      }, []); //Reference stays the same forever

      return (
        <div className={theme}>
          <h1>Count: {count}</h1>
          <button onClick = {()=> setCount(count+1)}>Increment</button>
          <ItemList items={visibleItems} onItemClick={addToCart} />
        </div>
      )
    }
```
