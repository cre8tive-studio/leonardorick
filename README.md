# Leonardo Rick Personal Portifolio

<a style="font-size: 2rem" href="https://leonardorick.com">It's alive! 🔗</a>
| Home |
| ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/c5ade323-da52-4fcd-b999-50bced1655e8) |

## Setup

```bash
pnpm install
npm run dev
```

Make sure to check .env.example to check the necessary variables needed to run the probject.

### Note

This project is my experimental playground where I try out different things, so the structure and coding may not be as organized as you would expect in a real project. In real life, we don't usually use so many different animations and tend to repeat things more. But here, I went all out and did everything I've always wanted to do!

The main focus here is on three things:

1. the amount of maintenance required in the code (this project is not meant to be constantly changed);
2. the number of developers working on the code (just me), and;
3. concentrating on what truly matters (perfectionism isn't always necessary).

If you're interested in checking out some well-structured code, take a look at my github and the [js-libs](https://github.com/LeonardoRick/js-libs) project where I create helper functions for my projects.

### Supported Browswers

- Chrome
- Firefox
- Safari

### Language Logic

Using only i18n route logic to control the language was a little bit bad for experience because I didn't wanted the user to go back to the start of the page everytime the language changes. So what I did was to use a combination of both query and path parameters. The query parameters takes precedence if defined.

The URL might end up very weird as /pt-BR (being translated to english) or /?locale=pt-BR being translate but I prefered that beacuse I could take the benefits of both approaches. Using the path route I'm able to generate the SSR version of the website for all routes and using the query parameter I can refresh the page without scrolling top.

### Cloudlfare

Cloudflare currently do not support process.env in some vue contexts so be sure to always use useRuntimeConfig

- https://github.com/nuxt-hub/core/issues/297

For reidrect rules to work, your endpoints must be with proxy enabled

- https://community.cloudflare.com/t/301-redirect-page-rule-not-working/591595/10

#### Test Prouction Deploy

1. Make sure to add `NITRO_PRESET=cloudflare_pages` on .env
2. run `npx nuxt build && npx wrangler pages dev dist`

### Known Bugs

- If you run the app in a small screen theres a hydration missmatch warning in the console because the generated pages uses the desktop header that don't appear in small screens. I guess it's not a bug but it's worth mentioning that it's normal to happen.
