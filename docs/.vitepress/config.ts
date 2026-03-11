import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/flex-rest/',
  title: 'flex-rest',
  description: 'Unified REST API client for Axios, CodeceptJS, Playwright & Supertest',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/flex-rest/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Integrations', items: [
        { text: 'BaseApi (Axios)', link: '/integrations/base-api' },
        { text: 'Playwright', link: '/integrations/playwright' },
        { text: 'Supertest', link: '/integrations/supertest' },
        { text: 'CodeceptJS', link: '/integrations/codeceptjs' }
      ]},
      { text: 'API Reference', link: '/api/' },
      {
        text: 'v1.1.3',
        items: [
          { text: 'Changelog', link: 'https://github.com/kobenguyent/flex-rest/releases' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is flex-rest?', link: '/guide/what-is-flex-rest' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        },
        {
          text: 'Essentials',
          items: [
            { text: 'Unified Response', link: '/guide/unified-response' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'TypeScript', link: '/guide/typescript' }
          ]
        }
      ],
      '/integrations/': [
        {
          text: 'Integrations',
          items: [
            { text: 'BaseApi (Axios)', link: '/integrations/base-api' },
            { text: 'Playwright', link: '/integrations/playwright' },
            { text: 'Supertest', link: '/integrations/supertest' },
            { text: 'CodeceptJS', link: '/integrations/codeceptjs' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'HttpResponse', link: '/api/http-response' },
            { text: 'BaseApi', link: '/api/base-api' },
            { text: 'PlaywrightApi', link: '/api/playwright-api' },
            { text: 'SupertestApi', link: '/api/supertest-api' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kobenguyent/flex-rest' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present kobenguyent'
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/kobenguyent/flex-rest/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
