import { defaultLocale, type Locale } from '@/lib/i18n/config'
import { withLocalePath } from '@/lib/i18n/paths'

interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

export function getProjectsData(locale: Locale = defaultLocale): Project[] {
  if (locale === 'zh') {
    return [
      {
        title: '搜索引擎实验',
        description: '一个围绕网页、图片和视频检索体验的练习项目。',
        imgSrc: '/static/images/google.png',
        href: 'https://www.google.com',
      },
      {
        title: '博客本地化',
        description: '为博客整理多语言路由、内容结构和界面文案。',
        imgSrc: '/static/images/time-machine.jpg',
        href: withLocalePath(locale, '/blog'),
      },
    ]
  }

  return [
    {
      title: 'A Search Engine',
      description: 'A small experiment around finding webpages, images, and videos with a cleaner experience.',
      imgSrc: '/static/images/google.png',
      href: 'https://www.google.com',
    },
    {
      title: 'Blog Localization',
      description: 'Locale-aware routes, content organization, and UI copy for the blog.',
      imgSrc: '/static/images/time-machine.jpg',
      href: withLocalePath(locale, '/blog'),
    },
  ]
}

export default getProjectsData()
