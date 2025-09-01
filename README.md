# 🍽️ Restaurant Offers Home Page

Create an engaging landing page that showcases **restaurant deals and promotions** with intuitive filtering and search capabilities, allowing users to quickly discover relevant dining offers.

---

## 🎯 Key Sections & Features

### ⭐ Featured Offers Section
- Display **visually appealing offer cards** in a responsive grid layout.  
- Each card should include:  
  - Restaurant **logo**  
  - **Discount percentage** (e.g., 30% OFF)  
  - **Validity dates** (e.g., Valid till Sept 30)  

---

### 🎛️ Interactive Filters
- Provide easy-to-use filters for refining offers:
  - **Cuisine Type** (e.g., Indian, Italian, Continental)  
  - **Location** (city/area based)  
  - **Offer Categories** (Buffet, Combo, Happy Hour, etc.)  
- Filters should be implemented as **dropdowns or toggle buttons**.  

---

### 🔍 Search Functionality
- Prominent **search bar** at the top of the page.  
- Support **auto-suggestions** based on:
  - Restaurant names  
  - Offer keywords (e.g., “Pizza”, “Drinks”, “Buffet”)  

---

### 🃏 Card Components
- Design offer cards with **consistent styling**:
  - **Discount badges** (e.g., `30% OFF`)  
  - **Price comparison**: original price (strikethrough) vs. discounted price (highlighted).  
  - Clean, **professional aesthetic** with:
    - Rounded corners  
    - Subtle shadows  
    - Clear typography  

---

### ⏳ Loading States
- When fetching offer data:
  - Display **skeleton loaders** in place of cards.  
  - Ensure a **smooth, non-jarring** user experience.  

---

✅ Goal: A professional, modern, and user-friendly home page that makes exploring restaurant offers **fast, intuitive, and visually appealing**.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
