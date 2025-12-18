---
trigger: manual
---

### 🎯 Understanding SEO & Why Next.js Excels

Search Engine Optimization (SEO) is the strategy of improving your website's ranking in search engine results to increase organic traffic . Next.js is particularly well-suited for SEO due to its built-in rendering methods that ensure content is readily available for search engines to crawl and index .

| **Feature**                               | **SEO Benefit**                                                                                    |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **Static Site Generation (SSG)**          | Pre-renders HTML at build time, offering the best performance and reliability for crawlers .       |
| **Server-Side Rendering (SSR)**           | Generates HTML on each request, perfect for dynamic content that needs to be fresh and crawlable . |
| **Incremental Static Regeneration (ISR)** | Updates static pages after build, enabling SEO at scale for millions of pages .                    |
| **Built-in Image Optimization**           | Automatically serves optimized, modern formats with lazy loading, improving Core Web Vitals .      |

> ⚠️ **Avoid Client-Side Rendering (CSR) for public content**: Pages rendered only on the client can appear empty to search engine crawlers, hindering indexing. Reserve CSR for private, logged-in areas like dashboards .

### 📝 Essential On-Page SEO & Metadata

#### Configuring Metadata

Next.js provides a powerful Metadata API to manage your `<head>` tags. You can define metadata statically or dynamically .

- **Static Metadata**: For pages with fixed metadata, export a static `metadata` object .

  ```jsx
  // In your layout.js or page.js
  import { Metadata } from 'next';

  export const metadata: Metadata = {
    title: 'My Product Page',
    description: 'Learn all about our amazing new product.',
    keywords: 'product, amazing, buy now',
  };

  export default function Page() { ... }
  ```

- **Dynamic Metadata**: For pages that depend on external data, use the `generateMetadata` function .

  ```jsx
  // app/blog/[slug]/page.js
  import { Metadata, ResolvingMetadata } from 'next'

  export async function generateMetadata({ params }, parent) {
    const post = await fetch(`https://.../posts/${params.slug}`).then(res => res.json())

    return {
      title: post.title,
      description: post.description,
    }
  }
  ```

#### Implementing Canonical URLs

Canonical tags prevent duplicate content issues by telling search engines which URL is the "master copy" . This is crucial when the same content is accessible via multiple paths or published on different domains .

Set a `metadataBase` in your root layout and define the `canonical` URL for each page :

```jsx
// In your root layout.js
export const metadata = {
  metadataBase: new URL('https://www.yourdomain.com'),
}

// In a page's generateMetadata function
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `/posts/${params.id}`, // Resolves to https://www.yourdomain.com/posts/123
    },
  }
}
```

### 🚀 Advanced SEO Strategies

#### Adding Structured Data (JSON-LD)

Structured data helps search engines understand your content's context, enabling **rich results** like FAQs, recipes, and product information . Google recommends the JSON-LD format .

Add it as a `<script>` tag within your page component :

```jsx
// app/products/[id]/page.js
export default async function Page({ params }) {
  const product = await getProduct(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* The rest of your page UI */}
      <h1>{product.name}</h1>
    </section>
  )
}
```

#### Optimizing for Social Sharing with Open Graph

Open Graph (OG) tags control how your content appears when shared on social platforms. You can define them within the `metadata` object and even **generate OG images dynamically** .

```jsx
// In your generateMetadata or metadata object
export const metadata: Metadata = {
  openGraph: {
    title: 'My Article',
    description: 'A fascinating article about Next.js SEO.',
    url: 'https://yourdomain.com/article',
    siteName: 'Your Site Name',
    images: [
      {
        url: '/og-image.jpg', // Or a dynamically generated URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
};
```

### 📊 Technical SEO & Performance

#### Sitemaps and `robots.txt`

A sitemap helps search engines discover all your pages. Use a package like `next-sitemap` to automate this process .

1.  Install the package: `npm install next-sitemap`
2.  Create a `next-sitemap.config.js` file in your project root.
3.  Add the postbuild script to your `package.json`:
    ```json
    "scripts": {
      "postbuild": "next-sitemap"
    }
    ```

#### Optimizing Core Web Vitals

Core Web Vitals are real-world user experience metrics that are a direct Google ranking factor .

- **Use the Next.js Image Component**: It provides automatic image optimization, lazy loading, and modern format serving (like WebP) .
  ```jsx
  import Image from 'next/image'
  ;<Image src="/your-image.jpg" alt="Descriptive alt text" width={800} height={600} />
  ```
- **Optimize Script Loading**: Use `next/script` with the `lazyOnload` strategy for third-party scripts to prevent them from blocking your core content .
- **Leverage Caching and CDNs**: Using SSG/SSR and deploying with a global CDN ensures fast content delivery worldwide .

### ✅ Your Next.js SEO Checklist

Use this actionable list to ensure you've covered the basics:

| **Category**        | **Task**                                                   | **Status** |
| :------------------ | :--------------------------------------------------------- | :--------- |
| **Rendering**       | Use SSG or SSR for public pages                            | ☐          |
| **Metadata**        | Unique `title` and `description` for every page            | ☐          |
| **Metadata**        | `metadataBase` and canonical URLs set                      | ☐          |
| **Metadata**        | Open Graph tags configured                                 | ☐          |
| **Structured Data** | Relevant JSON-LD implemented                               | ☐          |
| **Content**         | Semantic HTML (`<article>`, `<h1>`, etc.) used             | ☐          |
| **Performance**     | `next/image` used for all images                           | ☐          |
| **Performance**     | Non-critical scripts load with `lazyOnload`                | ☐          |
| **Technical**       | `sitemap.xml` and `robots.txt` generated                   | ☐          |
| **Testing**         | Metadata and structured data validated with relevant tools | ☐          |
