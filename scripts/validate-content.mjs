import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'src', 'content', 'site', 'en');
const pagesDir = path.join(rootDir, 'src', 'pages');
const publicDir = path.join(rootDir, 'public');

const errors = [];

const allowedNavIds = new Set(['home', 'heritage', 'about', 'contact']);
const allowedButtonVariants = new Set(['primary', 'ghost', 'soft']);

function readJsonFile(fileName) {
  const filePath = path.join(contentDir, fileName);
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function normalizeRoute(href) {
  const [pathOnly] = href.split(/[?#]/, 1);
  if (!pathOnly) {
    return '/';
  }

  if (!pathOnly.startsWith('/')) {
    return pathOnly;
  }

  if (pathOnly.length > 1 && pathOnly.endsWith('/')) {
    return pathOnly.slice(0, -1);
  }

  return pathOnly;
}

function collectPageRoutes(directory, nestedPath = '') {
  const entries = readdirSync(path.join(directory, nestedPath), { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const relativePath = nestedPath ? `${nestedPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (entry.name.startsWith('[')) {
        continue;
      }

      routes.push(...collectPageRoutes(directory, relativePath));
      continue;
    }

    if (!entry.name.endsWith('.astro') || entry.name.startsWith('[')) {
      continue;
    }

    const withoutExtension = relativePath.slice(0, -'.astro'.length);
    let route = '';

    if (withoutExtension === 'index') {
      route = '/';
    } else if (withoutExtension.endsWith('/index')) {
      route = `/${withoutExtension.slice(0, -'/index'.length)}`;
    } else {
      route = `/${withoutExtension}`;
    }

    routes.push(route.replace(/\/+/g, '/'));
  }

  return routes;
}

function addError(message) {
  errors.push(message);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertNonEmptyString(value, fieldName) {
  if (!isNonEmptyString(value)) {
    addError(`${fieldName} must be a non-empty string.`);
  }
}

function assertArrayWithItems(value, fieldName) {
  if (!Array.isArray(value) || value.length === 0) {
    addError(`${fieldName} must contain at least one item.`);
  }
}

function isExternalHref(href) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function isHttpHref(href) {
  return /^https?:\/\//i.test(href);
}

function validateLink(link, fieldName, knownRoutes) {
  if (!link || typeof link !== 'object') {
    addError(`${fieldName} must be an object.`);
    return;
  }

  assertNonEmptyString(link.label, `${fieldName}.label`);
  assertNonEmptyString(link.href, `${fieldName}.href`);

  if (!isNonEmptyString(link.href)) {
    return;
  }

  const href = link.href.trim();

  if (isHttpHref(href) && link.external !== true) {
    addError(`${fieldName}.external should be true for external HTTP(S) links (${href}).`);
  }

  if (link.external === true && !isHttpHref(href)) {
    addError(`${fieldName}.external can only be true for HTTP(S) links (${href}).`);
  }

  if (!isExternalHref(href)) {
    const normalized = normalizeRoute(href);
    if (!knownRoutes.has(normalized)) {
      addError(`${fieldName}.href references missing route: ${normalized}`);
    }
  }
}

function validateAction(action, fieldName, knownRoutes) {
  validateLink(action, fieldName, knownRoutes);

  if (!allowedButtonVariants.has(action?.variant)) {
    addError(`${fieldName}.variant must be one of ${Array.from(allowedButtonVariants).join(', ')}.`);
  }
}

function collectAssetPaths(value, location, output) {
  if (typeof value === 'string' && value.startsWith('/assets/')) {
    output.push({ location, path: value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectAssetPaths(item, `${location}[${index}]`, output);
    });
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nested]) => {
      collectAssetPaths(nested, `${location}.${key}`, output);
    });
  }
}

function validateAssetPaths(references) {
  for (const reference of references) {
    const normalized = reference.path.startsWith('/') ? reference.path.slice(1) : reference.path;

    let decodedPath = normalized;
    try {
      decodedPath = decodeURIComponent(normalized);
    } catch {
      addError(`${reference.location} has an invalid URL-encoded asset path: ${reference.path}`);
      continue;
    }

    const filePath = path.join(publicDir, decodedPath);
    if (!existsSync(filePath)) {
      addError(`${reference.location} references missing asset: ${reference.path}`);
    }
  }
}

function validateContent() {
  const knownRoutes = new Set(collectPageRoutes(pagesDir));

  const global = readJsonFile('global.json');
  const home = readJsonFile('home.json');
  const about = readJsonFile('about.json');
  const contact = readJsonFile('contact.json');
  const heritage = readJsonFile('heritage.json');

  assertNonEmptyString(global.locale, 'global.locale');
  if (global.locale !== 'en') {
    addError('global.locale must be en for the current English-first launch setup.');
  }

  assertNonEmptyString(global.siteName, 'global.siteName');
  assertNonEmptyString(global.tagline, 'global.tagline');
  assertNonEmptyString(global.contactEmail, 'global.contactEmail');
  assertNonEmptyString(global.wishlistUrl, 'global.wishlistUrl');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(global.contactEmail ?? '')) {
    addError('global.contactEmail must be a valid email address.');
  }

  assertArrayWithItems(global.navigation, 'global.navigation');
  assertArrayWithItems(global.footerLinks, 'global.footerLinks');

  if (Array.isArray(global.navigation)) {
    const seenIds = new Set();

    global.navigation.forEach((item, index) => {
      const fieldName = `global.navigation[${index}]`;
      validateLink(item, fieldName, knownRoutes);

      if (!allowedNavIds.has(item?.id)) {
        addError(`${fieldName}.id must be one of ${Array.from(allowedNavIds).join(', ')}.`);
      }

      if (seenIds.has(item?.id)) {
        addError(`${fieldName}.id is duplicated (${item.id}).`);
      }

      seenIds.add(item?.id);
    });

    for (const requiredId of allowedNavIds) {
      if (!seenIds.has(requiredId)) {
        addError(`global.navigation is missing required id: ${requiredId}`);
      }
    }
  }

  if (Array.isArray(global.footerLinks)) {
    global.footerLinks.forEach((link, index) => {
      validateLink(link, `global.footerLinks[${index}]`, knownRoutes);
    });
  }

  assertNonEmptyString(home.seo?.title, 'home.seo.title');
  assertNonEmptyString(home.seo?.description, 'home.seo.description');
  assertNonEmptyString(home.hero?.title, 'home.hero.title');
  assertNonEmptyString(home.hero?.summary, 'home.hero.summary');
  assertNonEmptyString(home.hero?.videoMp4, 'home.hero.videoMp4');
  assertArrayWithItems(home.hero?.tags, 'home.hero.tags');
  assertArrayWithItems(home.hero?.actions, 'home.hero.actions');
  assertArrayWithItems(home.hero?.status, 'home.hero.status');
  assertNonEmptyString(home.games?.title, 'home.games.title');
  assertArrayWithItems(home.games?.details, 'home.games.details');
  assertArrayWithItems(home.games?.actions, 'home.games.actions');
  assertArrayWithItems(home.values, 'home.values');
  assertArrayWithItems(home.contactCta?.actions, 'home.contactCta.actions');

  home.hero?.actions?.forEach((action, index) => {
    validateAction(action, `home.hero.actions[${index}]`, knownRoutes);
  });

  home.games?.actions?.forEach((action, index) => {
    validateAction(action, `home.games.actions[${index}]`, knownRoutes);
  });

  home.contactCta?.actions?.forEach((action, index) => {
    validateAction(action, `home.contactCta.actions[${index}]`, knownRoutes);
  });

  assertNonEmptyString(about.seo?.title, 'about.seo.title');
  assertNonEmptyString(about.seo?.description, 'about.seo.description');
  assertNonEmptyString(about.hero?.title, 'about.hero.title');
  assertNonEmptyString(about.hero?.image, 'about.hero.image');
  assertArrayWithItems(about.members, 'about.members');
  assertArrayWithItems(about.socialCta?.actions, 'about.socialCta.actions');

  about.members?.forEach((member, index) => {
    assertNonEmptyString(member?.name, `about.members[${index}].name`);
    assertNonEmptyString(member?.role, `about.members[${index}].role`);
    assertNonEmptyString(member?.bio, `about.members[${index}].bio`);
    assertNonEmptyString(member?.image, `about.members[${index}].image`);
    assertNonEmptyString(member?.imageAlt, `about.members[${index}].imageAlt`);
  });

  about.socialCta?.actions?.forEach((action, index) => {
    validateAction(action, `about.socialCta.actions[${index}]`, knownRoutes);
  });

  assertNonEmptyString(contact.seo?.title, 'contact.seo.title');
  assertNonEmptyString(contact.seo?.description, 'contact.seo.description');
  assertNonEmptyString(contact.hero?.title, 'contact.hero.title');
  assertNonEmptyString(contact.hero?.image, 'contact.hero.image');
  assertNonEmptyString(contact.aside?.heading, 'contact.aside.heading');
  assertNonEmptyString(contact.aside?.body, 'contact.aside.body');

  assertNonEmptyString(heritage.seo?.title, 'heritage.seo.title');
  assertNonEmptyString(heritage.seo?.description, 'heritage.seo.description');
  assertNonEmptyString(heritage.hero?.title, 'heritage.hero.title');
  assertNonEmptyString(heritage.hero?.image, 'heritage.hero.image');
  assertNonEmptyString(heritage.hero?.logo, 'heritage.hero.logo');
  assertArrayWithItems(heritage.hero?.panelStatLabels, 'heritage.hero.panelStatLabels');
  assertArrayWithItems(heritage.stats, 'heritage.stats');
  assertNonEmptyString(heritage.media?.trailerMp4, 'heritage.media.trailerMp4');
  assertArrayWithItems(heritage.media?.screenshots, 'heritage.media.screenshots');
  assertArrayWithItems(heritage.cta?.actions, 'heritage.cta.actions');

  heritage.cta?.actions?.forEach((action, index) => {
    validateAction(action, `heritage.cta.actions[${index}]`, knownRoutes);
  });

  const statLabels = new Set((heritage.stats ?? []).map((stat) => stat.label));
  heritage.hero?.panelStatLabels?.forEach((label, index) => {
    if (!statLabels.has(label)) {
      addError(`heritage.hero.panelStatLabels[${index}] references missing stat label: ${label}`);
    }
  });

  const assetReferences = [];
  collectAssetPaths(home, 'home', assetReferences);
  collectAssetPaths(about, 'about', assetReferences);
  collectAssetPaths(contact, 'contact', assetReferences);
  collectAssetPaths(heritage, 'heritage', assetReferences);
  validateAssetPaths(assetReferences);
}

validateContent();

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Content validation passed.');