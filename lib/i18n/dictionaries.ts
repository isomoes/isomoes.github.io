import type { Locale } from './config'

export type Dictionary = {
  languageLabel: string
  siteDescription: string
  navigation: {
    home: string
    blog: string
    tags: string
    about: string
  }
  search: {
    label: string
    placeholder: string
  }
  home: {
    title: string
    noPosts: string
    readMore: string
    allPosts: string
    publishedOn: string
  }
  blog: {
    title: string
    allPosts: string
    noPosts: string
    previous: string
    next: string
    searchArticles: string
  }
  tags: {
    title: string
    description: string
    noTags: string
    allPosts: string
  }
  about: {
    title: string
  }
  post: {
    publishedOn: string
    authors: string
    tags: string
    previousArticle: string
    nextArticle: string
    backToBlog: string
    editOnGitHub: string
  }
  footer: {
    themeCredit: string
  }
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    languageLabel: 'English',
    siteDescription: 'Isomoes personal blog',
    navigation: {
      home: 'Home',
      blog: 'Blog',
      tags: 'Tags',
      about: 'About',
    },
    search: {
      label: 'Search',
      placeholder: 'Search articles',
    },
    home: {
      title: 'Latest',
      noPosts: 'No posts found.',
      readMore: 'Read more',
      allPosts: 'All Posts',
      publishedOn: 'Published on',
    },
    blog: {
      title: 'All Posts',
      allPosts: 'All Posts',
      noPosts: 'No posts found.',
      previous: 'Previous',
      next: 'Next',
      searchArticles: 'Search articles',
    },
    tags: {
      title: 'Tags',
      description: 'Things I blog about',
      noTags: 'No tags found.',
      allPosts: 'All Posts',
    },
    about: {
      title: 'About',
    },
    post: {
      publishedOn: 'Published on',
      authors: 'Authors',
      tags: 'Tags',
      previousArticle: 'Previous Article',
      nextArticle: 'Next Article',
      backToBlog: 'Back to the blog',
      editOnGitHub: 'Edit this page on GitHub, if have errors.',
    },
    footer: {
      themeCredit: 'Tailwind Nextjs Theme',
    },
  },
  zh: {
    languageLabel: '中文',
    siteDescription: 'Isomoes 的个人博客',
    navigation: {
      home: '首页',
      blog: '博客',
      tags: '标签',
      about: '关于',
    },
    search: {
      label: '搜索',
      placeholder: '搜索文章',
    },
    home: {
      title: '最新文章',
      noPosts: '还没有文章。',
      readMore: '继续阅读',
      allPosts: '全部文章',
      publishedOn: '发布时间',
    },
    blog: {
      title: '全部文章',
      allPosts: '全部文章',
      noPosts: '还没有文章。',
      previous: '上一页',
      next: '下一页',
      searchArticles: '搜索文章',
    },
    tags: {
      title: '标签',
      description: '我写过的一些主题',
      noTags: '还没有标签。',
      allPosts: '全部文章',
    },
    about: {
      title: '关于',
    },
    post: {
      publishedOn: '发布时间',
      authors: '作者',
      tags: '标签',
      previousArticle: '上一篇',
      nextArticle: '下一篇',
      backToBlog: '返回博客',
      editOnGitHub: '如果有错误，欢迎在 GitHub 上编辑此页。',
    },
    footer: {
      themeCredit: 'Tailwind Nextjs 主题',
    },
  },
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export function getDateLocale(locale: Locale) {
  return locale === 'zh' ? 'zh-CN' : 'en-US'
}
