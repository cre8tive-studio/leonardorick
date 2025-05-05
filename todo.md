# FEATURES I REALLY WANT

Add disabled state for previews

- add corner lace

show all previews but disable the ones that should be disabled and add a tooltip saying that next month a new preview will be unlocked

add user property "lastReleasedPreview" so I can add some badge and border for the user to see it

Add tooltip indicating that more votes and demos will be available next month

Allow file downloads previews and instructions to add to spotify

setup covers

upload some previews

if for some reason I disable the preview, I need to remove the upvotes from the this preview

find a way to add some padding in the top of the scrollable area of the modal so it do not touch the border when scrollingL

// add party emoji if the value was reached. And a tooltip saying (new release comming soon)
fix transition on learn more button

- create full local mocked envrionment for development!!!!!
-
- multple language emails?
- Setup staging and production environments on appwrite
- Add Qonto experience
- Add google login

Add some sort of donate button in the profile

===============================================

### Migrate playwrite db

Since playwrite has a lower bandwidth on the free plan, this project uses multiple replicated projects in different accounts.

The migration script contains the required info for them to work properly

to run it you need to have playwrite installed globally:

`pnpm install -g appwrite-cli`

=============================================

Add donate button functionality

- drag and drop the bar to reach the 4000 target and open stripe
- Single payment of 1000 to unlock all previews and free access forever

Create a single file centralizing the configurations in staging 1 Password

automate the process of blocking a ip that is making too much requests

setup colormode (https://color-mode.nuxtjs.org/)

set language based on browsers preference
|-- https://stackoverflow.com/questions/77430938/nuxt-3-i18n-browser-detection-not-working

// todo: replace with @nuxtjs/localforage when compatible with composition: https://nuxt.com/modules/localforage
|--- can't use nuxt-3-localforage because it gives problem on the global imports such as $t so i'm using localforage npm package directly

Add pnpm and mono repo setup
Change cloudinary images to nuxtHub

Check if scss is being cleaned up

Create a page similar to that pages that serves as presentation card (for instagram link)

Change lang logic to be a path /pt-BR so all routes can be generated properly without needing to go to backend

# FEATURES FOR LATER

- understand how can I properly set posthog api key to only accept requests from specific hosts

add music section and login once appwrite allow transactions

- https://github.com/appwrite/appwrite/issues/2788
- https://appwrite.io/threads/1096798213350109184
- remember that cloudflare proxy might affect the url in staging if it's not working

- Understand why sometimes minutes and seconds are stickying together (very odd bug probably going to leave like this)

- better SEO https://nuxtseo.com/nuxt-seo/getting-started/installation

- Limit IP's that can call Payload CMS
