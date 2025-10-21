# ASSORT site

This repository contains the code for the site informing on the ASSORT humanitarian aid standard and associated standard products.

## Credits

The repository was created from [this amazing template](https://github.com/gregrickaby/nextjs-github-pages).

# Next.js GitHub Pages

Deploy Next.js to GitHub Pages with GitHub Actions. [View the deployed app](https://gregrickaby.github.io/nextjs-github-pages/) 🚀

> ⚠️ Heads up! GitHub Pages _does not_ support serverless or edge functions. This means dynamic functionality will be disabled. See all the [unsupported features](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features).

---

## Configure Github repo

### Setup GitHub Action

This is where the magic happens! This [workflow file](https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml) will automatically build and deploy the app when you push to the `main` branch.

1. Create `.github/workflows/deploy.yml` file
2. Paste the contents of <https://github.com/gregrickaby/nextjs-github-pages/blob/main/.github/workflows/deploy.yml>
3. Save the `deploy.yml` file

### Enable GitHub Pages

1. Go to your repository's **Settings** tab
2. Click "Pages" in the sidebar
3. Under "Build and Deployment", select "GitHub Actions" as the source:
