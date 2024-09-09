setup failing state if payload cms get fails

setup posthog in production

Improve magnetic

- Fix magnetic items keeping on active state
- Magnetic to animate out only when the intersection between the icon and the round circle ends. This way I don't need the mouseleave listener. For that I need to understand better the intersection API
- improve sticky button

do this with header: https://gsap.com/community/forums/topic/39286-scrolltrigger-lenis-problem/

- setup header items animation on hover on both mobile and normal screens like https://minhpham.design/

About me related to who is reading https://billysweeney.com/
|- add a query parameter that defines who is reading
|- also copy the logic for the mobile menu, its very fluid

Responsiveness

- criar logica pra definir background to menu que abre
- copy margins and breakpoints of https://minhpham.design/
- decrease a bit max sisze width of screens
- fix and enable lenis in mobile
- Add animations support for firefox and safari

add another transition timing on :hover so it can close faster than it opens on both contact footter and what i do sections (like seen in the css video 5 tips)

Add scrolldown around the cursor

create # urls so I can jump right to the place I want

create a nice console.log signature like https://hontran.dev/
|-- something like "got you sneakyy, if you have any questions about something that was implemented here in this website, just drop me a message on linkein "

Improve Experience Clock

- Understand why sometimes minutes and seconds are stickying together
- show '0 seconds'

stop caching images with useFetch

- old note: understand the differnce between useFetch and $fetch because apperently I need to use $fetch after ssr is generated

change main deploy to nuxtHub
|--change cloudinary images to nuxtHub

Add on readme: This project is my experience lab, I just add things here for trying out stuff so that's why the structure and coding might not be as organized as you would expect in a real project. In real life we never to that much of different animations and try to repeat more stuff, here I just went crazy and did everything I always wanted! It's all about 1) How many maintainence is needed in the code (this project is not intended to keep changing), 2) how many developers are going to touch the code (only me) and 3) focus on what really matters (perfecsionism is not always a good thing)
If you want to check some nice code structures check my packages project, were I create some helper functions for my projects
