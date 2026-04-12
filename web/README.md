# 🌐 Kejasafe Web

Welcome to the **Kejasafe Web Application**, the frontend gateway for the **Kejasafe** ecosystem. This application is built with [Next.js](https://nextjs.org), providing a high-performance, responsive, and intuitive user experience.

---

## 🚀 Getting Started

Follow these steps to set up the frontend locally:

### Prerequisites

- **Node.js**: ^18.x or later
- **Package Manager**: pnpm (recommended), npm, or yarn

### Installation

1. **Install Dependencies**:

   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Environment Setup**:

   Copy the `.env.example` file to `.env.local` and configure your API connection settings.

   ```bash
   cp .env.example .env.local
   ```

3. **Local Run**:

   Launch the Next.js development server.

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in Browser**:

   Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## Seeding Sample Kenya Listings

The frontend now includes a Prisma seed that creates a small set of Kenya property listings and their image gallery records.

```bash
pnpm db:seed
```

If `STORAGE_DRIVER` is set to `r2` and the S3-compatible environment variables are configured, the seed will:

1. fetch the source listing images
2. upload them into your Cloudflare R2 bucket
3. store the resulting R2 public URLs in Prisma

If R2 is not configured yet, the seed falls back to the source image URLs so the dataset is still usable locally.

## Cloudflare R2 Configuration

This project uses the existing S3-style environment variables for R2:

```bash
STORAGE_DRIVER="r2"
S3_BUCKET="kejasafe-media"
S3_REGION="auto"
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_BASE_URL="https://pub-<public-bucket-id>.r2.dev"
S3_FORCE_PATH_STYLE="true"
```

`S3_PUBLIC_BASE_URL` should point to the public hostname that serves the uploaded files.

## 🛠️ Tech Stack & Features

- **Next.js**: Optimized server-side and client-side rendering.
- **Tailwind CSS**: Rapid UI development with modern utility classes.
- **TypeScript**: Static typing for a more predictable codebase.

## 📁 Repository Overview

- `app/`: Current Next.js App Router architecture.
- `public/`: Static assets and media.
- `package.json`: Project metadata and dependencies.

---

### © 2026 [Vinetech Digital Services](https://vinetech.co.ke)
