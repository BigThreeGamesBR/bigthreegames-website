import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const contentDir = path.join(rootDir, 'src', 'content', 'site', 'en');

const errors = [];

function readJsonFile(fileName) {
  const filePath = path.join(contentDir, fileName);
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function addError(message) {
  errors.push(message);
}

function normalizeRoute(route) {
  if (!route.startsWith('/')) {
    return `/${route}`;
  }

  if (route.length > 1 && route.endsWith('/')) {
    return route.slice(0, -1);
  }

  return route;
}

function distPathForRoute(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') {
    return path.join(distDir, 'index.html');
  }

  return path.join(distDir, normalized.slice(1), 'index.html');
}

function normalizeText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  if (!match) {
    return '';
  }

  return normalizeText(match[1]);
}

function validateRoute(route, expectedTitle, requiredMarkers) {
  const routePath = distPathForRoute(route);

  if (!existsSync(routePath)) {
    addError(`Missing generated route file for ${route}: ${routePath}`);
    return;
  }

  const html = readFileSync(routePath, 'utf8');
  const actualTitle = extractTitle(html);

  if (normalizeText(expectedTitle) !== actualTitle) {
    addError(`Route ${route} has unexpected <title>. Expected "${expectedTitle}", received "${actualTitle}".`);
  }

  requiredMarkers.forEach((marker) => {
    if (!html.includes(marker)) {
      addError(`Route ${route} is missing required rendered marker: ${marker}`);
    }
  });
}

function validateDist() {
  if (!existsSync(distDir)) {
    addError('dist directory not found. Run the build before smoke-dist.');
    return;
  }

  const global = readJsonFile('global.json');
  const home = readJsonFile('home.json');
  const about = readJsonFile('about.json');
  const contact = readJsonFile('contact.json');
  const heritage = readJsonFile('heritage.json');

  const expectedRoutes = [
    {
      route: '/',
      title: home.seo.title,
      markers: [home.hero.title, home.games.title, home.contactCta.title]
    },
    {
      route: '/about',
      title: about.seo.title,
      markers: [about.hero.title, about.storySection.title, about.socialCta.title]
    },
    {
      route: '/contact',
      title: contact.seo.title,
      markers: [contact.hero.title, contact.aside.heading, `mailto:${global.contactEmail}`]
    },
    {
      route: '/games/heritage',
      title: heritage.seo.title,
      markers: [heritage.hero.title, heritage.media.sectionTitle, heritage.cta.title]
    }
  ];

  expectedRoutes.forEach((entry) => {
    validateRoute(entry.route, entry.title, entry.markers);
  });

  (global.navigation ?? []).forEach((item, index) => {
    if (typeof item?.href !== 'string' || !item.href.startsWith('/')) {
      return;
    }

    const route = normalizeRoute(item.href);
    const routePath = distPathForRoute(route);
    if (!existsSync(routePath)) {
      addError(`global.navigation[${index}] points to missing built route: ${route}`);
    }
  });
}

validateDist();

if (errors.length > 0) {
  console.error(`dist smoke checks failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('dist smoke checks passed.');