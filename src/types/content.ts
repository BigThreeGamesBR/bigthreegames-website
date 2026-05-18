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
  ui: {
    skipLinkLabel: string;
    brandHomeAriaLabel: string;
    primaryNavAriaLabel: string;
    menuButtonLabel: string;
    wishlistButtonLabel: string;
    footerLinksAriaLabel: string;
    footerCopyrightPrefix: string;
    adminPageTitle: string;
  };
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
    videoTitle: string;
    tags: string[];
    tagsAriaLabel: string;
    actions: Array<LinkItem & { variant: ButtonVariant }>;
    status: Array<{ label: string; value: string }>;
    statusAriaLabel: string;
  };
  games: {
    kicker: string;
    title: string;
    lede: string;
    keyArt: string;
    keyArtAlt: string;
    cardAriaLabel: string;
    logoAlt: string;
    intro: string;
    details: Array<{ label: string; value: string }>;
    detailsAriaLabel: string;
    tags: string[];
    tagsAriaLabel: string;
    actions: Array<LinkItem & { variant: ButtonVariant }>;
  };
  studioSection: {
    kicker: string;
    title: string;
    lede: string;
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
  };
  storySection: {
    kicker: string;
    title: string;
    lede: string;
  };
  memberCardAriaLabelPrefix: string;
  members: Array<{ name: string; role: string; bio: string; image: string; imageAlt: string }>;
  socialCta: {
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
  };
  aside: {
    kicker: string;
    heading: string;
    body: string;
    emailLabel: string;
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
    logoAlt: string;
    panelAriaLabel: string;
    panelStatLabels: string[];
  };
  stats: Array<{ label: string; value: string }>;
  media: {
    trailerMp4: string;
    sectionKicker: string;
    sectionTitle: string;
    galleryAriaLabel: string;
    trailerFrameTitle: string;
    trailerCaption: string;
    previousMediaAriaLabel: string;
    nextMediaAriaLabel: string;
    thumbnailsAriaLabel: string;
    trailerThumbAriaLabel: string;
    trailerThumbText: string;
    screenshotThumbAriaLabelPrefix: string;
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
