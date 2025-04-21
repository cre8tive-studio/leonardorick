import SvgoSpotify from '~/assets/icons/spotify.svg';
import SvgoGithub from '~/assets/icons/github.svg';
import SvgoLinkedin from '~/assets/icons/linkedin.svg';
import SvgoStackoverflow from '~/assets/icons/stackoverflow.svg';
import { useAppStore } from '~/store';
import type { PersonalInfoModel } from '~/types/personal-info.model';

const useLinks = () => {
  const { personalInfo } = toRefs(useAppStore());
  const linksUrls = personalInfo.value?.links || ({} as PersonalInfoModel['links']);

  const links = [
    {
      link: linksUrls.linkedin,
      svg: SvgoLinkedin,
      text: 'LinkedIn',
      funTitle: 'fun_title_linkedin',
    },
    {
      link: linksUrls.github,
      svg: SvgoGithub,
      text: 'GitHub',
      funTitle: 'fun_title_github',
    },
    {
      link: linksUrls.stackoverflow,
      svg: SvgoStackoverflow,
      text: 'StackOverflow',
      funTitle: 'fun_title_stackoverflow',
    },
    {
      link: linksUrls.spotify,
      svg: SvgoSpotify,
      text: 'Spotify',
      funTitle: 'fun_title_spotify',
    },
  ];

  const email = computed(() => personalInfo.value?.email || '');
  return {
    links,
    email,
  };
};
export default useLinks;
