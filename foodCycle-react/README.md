# React + TypeScript + Vite

## Backend authentication

The login and registration screens use the FoodCycle Spring Boot API. By default,
the frontend sends requests to `http://localhost:8080/api`. Set
`VITE_API_BASE_URL` in a local `.env` file if the backend is running elsewhere,
for example:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the backend before using login or registration. Successful login stores
the JWT in browser storage (session storage by default; local storage when
“Remember me” is selected). Sign out removes the stored token. The current
backend uses stateless JWT authentication and does not provide a server-side
logout or password-reset endpoint.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
