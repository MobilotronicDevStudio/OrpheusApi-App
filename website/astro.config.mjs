import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://mobilotronicdevstudio.github.io',
  base: '/OrpheusApi-App',
  trailingSlash: 'ignore',
  redirects: {
    '/docs': '/OrpheusApi-App/docs/getting-started/install/',
  },
  integrations: [
    starlight({
      title: 'Orpheus API',
      description: 'A desktop API client with an assistant that never sees your secrets.',
      logo: { src: './src/assets/orpheus-app.png', alt: '' },
      favicon: '/favicon.png',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/MobilotronicDevStudio/OrpheusApi-App' },
      ],
      customCss: ['./src/styles/Fonts.css', './src/styles/Docs.css'],
      lastUpdated: false,
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Install', slug: 'docs/getting-started/install' },
            { label: 'Your first request', slug: 'docs/getting-started/first-request' },
            { label: 'Where your data lives', slug: 'docs/getting-started/data' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Collections and folders', slug: 'docs/guides/collections' },
            { label: 'Variables and environments', slug: 'docs/guides/variables' },
            { label: 'Body versions', slug: 'docs/guides/body-versions' },
            { label: 'Authentication', slug: 'docs/guides/authentication' },
            { label: 'Scripts and tests', slug: 'docs/guides/scripts' },
            { label: 'Collection runner', slug: 'docs/guides/runner' },
            { label: 'Execution plans', slug: 'docs/guides/execution-plans' },
            { label: 'Invariant testing', slug: 'docs/guides/invariant-testing' },
            { label: 'Command line', slug: 'docs/guides/command-line' },
            { label: 'Import and export', slug: 'docs/guides/import-export' },
            { label: 'Code snippets', slug: 'docs/guides/snippets' },
          ],
        },
        {
          label: 'Assistant',
          items: [
            { label: 'Overview and setup', slug: 'docs/assistant/overview' },
            { label: 'How your secrets stay safe', slug: 'docs/assistant/safety' },
            { label: 'Use it from your editor', slug: 'docs/assistant/external' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Script API', slug: 'docs/reference/script-api' },
            { label: 'Keyboard shortcuts', slug: 'docs/reference/shortcuts' },
            { label: 'Known limitations', slug: 'docs/reference/limitations' },
          ],
        },
      ],
    }),
  ],
})
