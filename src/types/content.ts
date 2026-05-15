export type Locale = 'en';

export type NavId = 'home' | 'heritage' | 'about' | 'contact';

export type ButtonVariant = 'primary' | 'ghost' | 'soft';

export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationItem extends LinkItem {
  id: NavId;
}

export interface GlobalContent {
  locale: Locale;
  siteName: string;
  tagline: string;
  contactEmail: string;
  wishlistUrl: string;
  steamUrl: string;
  steamDemoUrl: string;
  navigation: NavigationItem[];
  footerLinks: LinkItem[];
}

export interface HomeContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    videoMp4: string;
    parallaxSpeed: number;
    tags: string[];
    actions: Array<LinkItem & { variant: ButtonVariant }>;
    status: Array<{ label: string; value: string }>;
  };
  games: {
    kicker: string;
    title: string;
    lede: string;
    keyArt: string;
    keyArtAlt: string;
    intro: string;
    details: Array<{ label: string; value: string }>;
    tags: string[];
  };
  values: Array<{ title: string; body: string }>;
  contactCta: {
    kicker: string;
    title: string;
    body: string;
    actions: Array<LinkItem & { variant: ButtonVariant }>;
  };
}

export interface AboutContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    image: string;
    imageAlt: string;
    parallaxSpeed: number;
  };
  storyTitle: string;
  storyCards: Array<{ title: string; body: string }>;
  members: Array<{ name: string; role: string; bio: string; image: string; imageAlt: string }>;
  cta: {
    kicker: string;
    title: string;
    body: string;
    actions: Array<LinkItem & { variant: ButtonVariant }>;
  };
}

export interface ContactContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    image: string;
    imageAlt: string;
    parallaxSpeed: number;
  };
  form: {
    heading: string;
    purpose: string;
    responseTime: string;
    topics: Array<{ value: string; label: string }>;
    privacyNote: string;
  };
  aside: {
    heading: string;
    body: string;
    servicesNote: string;
  };
}

export interface HeritageContent {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    image: string;
    imageAlt: string;
    logo: string;
    parallaxSpeed: number;
  };
  stats: Array<{ label: string; value: string }>;
  features: Array<{ title: string; body: string; tag?: string }>;
  media: {
    trailerMp4: string;
    screenshots: Array<{ image: string; alt: string; caption: string }>;
  };
  cta: {
    kicker: string;
    title: string;
    body: string;
    actions: Array<LinkItem & { variant: ButtonVariant }>;
  };
}

export interface SiteContentBundle {
  global: GlobalContent;
  home: HomeContent;
  about: AboutContent;
  contact: ContactContent;
  heritage: HeritageContent;
}
