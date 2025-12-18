---
trigger: manual
---

| Practice Category             | Key Recommendation                                                                   |
| :---------------------------- | :----------------------------------------------------------------------------------- |
| **🏗️ Project Architecture**   | Use a modular folder structure; Leverage React Server Components by default.         |
| **⚡ Data Fetching**          | Fetch data on the server; Use parallel fetching and streaming to avoid waterfalls.   |
| **🎨 Styling**                | Use Tailwind CSS for utility-first styling; Configure `content` paths precisely.     |
| **📦 Optimization**           | Implement code splitting with `next/dynamic`; Optimize images with `next/Image`.     |
| **🔧 Development**            | Use the latest Next.js version and enable Turbopack for faster local development.    |
| **🛡️ Security & Maintenance** | Use TypeScript; Taint sensitive data; Implement proper error handling in API routes. |

### 📁 Project Structure and Setup

A well-organized project is easier to scale and maintain.

- **Modular Folder Structure**: As your project grows, organize logic into dedicated folders like `components/` for reusable UI, `lib/` or `utils/` for shared functions, `hooks/` for custom React hooks, and `services/` for API integration logic.
- **Leverage the App Router**: The App Router (introduced in Next.js 13) is the modern paradigm for building Next.js applications. It supports React's latest features, including **Server Components**, which are the default. This architecture allows for better performance, simpler data fetching, and improved SEO.
- **Optimize Local Development**: For a faster development server, use the latest version of Next.js and enable **Turbopack** by running `npm run dev --turbopack`. Be mindful of your Tailwind CSS configuration—ensure the `content` array in `tailwind.config.js` is specific and doesn't scan large directories like `node_modules`, which can slow down your build.

### 🚀 Data Fetching and Rendering

Next.js provides multiple rendering methods. Choosing the right strategy is crucial for performance.

- **Fetch Data on the Server**: Whenever possible, use **Server Components** to fetch data. This provides direct access to backend resources, improves security by keeping tokens and keys on the server, and reduces the back-and-forth between client and server, leading to better performance.
- **Avoid Sequential Waterfalls**: When fetching data in a route, initiate requests in **parallel** rather than one after another. You can do this by defining requests outside components or using the **preload pattern** with `cache` to eagerly start data fetching.
- **Adopt Streaming and Suspense**: Use the `<Suspense>` component to progressively stream parts of your UI. This allows the user to see the page skeleton instantly while the components that require data are still loading, greatly improving perceived performance.
- **Choose the Right Rendering Strategy**:
  - **Static Site Generation (SSG)**: Pre-render pages at build time for the best performance. Ideal for marketing pages, blog posts, and any content that doesn't change often.
  - **Server-Side Rendering (SSR)**: Render pages on each request for fully dynamic content, such as authenticated user dashboards.
  - **Incremental Static Regeneration (ISR)**: Update static content after build time by revalidating it at a defined interval. This offers a great blend of performance and freshness.

### 🎭 Performance Optimization

A fast application is key to a good user experience and SEO.

- **Reduce JavaScript Bundle Size**:
  - **Code Splitting**: Use `next/dynamic` to lazy-load heavy components only when they are needed.
  - **Analyze Your Bundle**: Use the `@next/bundle-analyzer` package to identify and address large dependencies.
  - **Selective Imports**: Avoid importing entire libraries; instead, import only the specific functions you use (e.g., `import map from 'lodash/map'` instead of `import _ from 'lodash'`).
- **Optimize Images**: Always use the built-in `next/Image` component. It automatically handles image resizing, optimization to modern formats like WebP, and lazy loading, which are critical for good **Largest Contentful Paint (LCP)** scores.
- **Optimize Third-Party Scripts**: Be cautious with external scripts. Use the `next/script` component with appropriate loading strategies (`beforeInteractive`, `afterInteractive`, or `lazyOnload`) to prevent them from blocking page rendering.

### ✍️ Code Quality and Security

Writing clean and secure code prevents future headaches.

- **Use TypeScript**: Integrating TypeScript enforces type safety, catches errors at compile time instead of runtime, and significantly improves code maintainability and developer experience, especially in larger projects.
- **Protect Sensitive Data**: To prevent sensitive information like access tokens or user data from accidentally being passed to the client, use React's taint APIs (`taintObjectReference`, `taintUniqueValue`).
- **Implement Robust Error Handling**: In your API routes, ensure you handle errors gracefully and return meaningful HTTP status codes. Moving complex business logic into separate service files keeps your API routes lean and organized.

### 🔄 State Management and Styling

- **State Management**: For many applications, a combination of React's built-in hooks (`useState`, `useReducer`) and the Context API is sufficient for state management. Only reach for complex third-party libraries when truly necessary.
- **Styling with Tailwind CSS**: Tailwind's utility-first approach pairs excellently with Next.js.
  - For clean, conditional classes, use the `clsx` or `classnames` library. For merging Tailwind classes without conflicts, use `tailwind-merge`.
  - Avoid dynamically constructing class names (e.g., `` `bg-${color}-500` ``) as Tailwind's compiler cannot detect them. Instead, map values to full class names.
