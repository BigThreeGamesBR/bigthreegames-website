import { readFileSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'src', 'content', 'site', 'en');

const baseUrl = process.env.PRODUCTION_BASE_URL;
const maxAttempts = Number.parseInt(process.env.SMOKE_MAX_ATTEMPTS ?? '20', 10);
const delayMs = Number.parseInt(process.env.SMOKE_DELAY_MS ?? '15000', 10);
const requestTimeoutMs = Number.parseInt(process.env.SMOKE_REQUEST_TIMEOUT_MS ?? '12000', 10);

function readJsonFile(fileName) {
  const filePath = path.join(contentDir, fileName);
  const raw = readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function normalizeBaseUrl(value) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
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

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchRoute(base, route) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${base}${route}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'cache-control': 'no-cache'
      },
      signal: controller.signal
    });

    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      body: '',
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function runSingleAttempt(base, checks) {
  const errors = [];

  for (const check of checks) {
    const result = await fetchRoute(base, check.route);
    if (!result.ok) {
      const errorPart = result.error ? ` (${result.error})` : '';
      errors.push(`${check.route} returned status ${result.status}${errorPart}`);
      continue;
    }

    const title = extractTitle(result.body);
    if (normalizeText(check.title) !== title) {
      errors.push(`${check.route} title mismatch. Expected "${check.title}", received "${title}".`);
    }

    for (const marker of check.markers) {
      if (!result.body.includes(marker)) {
        errors.push(`${check.route} missing marker: ${marker}`);
      }
    }
  }

  return errors;
}

async function main() {
  if (!baseUrl) {
    console.error('PRODUCTION_BASE_URL is required (for example: https://example.com).');
    process.exit(1);
  }

  const normalizedBase = normalizeBaseUrl(baseUrl);
  const global = readJsonFile('global.json');
  const home = readJsonFile('home.json');
  const about = readJsonFile('about.json');
  const contact = readJsonFile('contact.json');
  const heritage = readJsonFile('heritage.json');

  const checks = [
    {
      route: '/',
      title: home.seo.title,
      markers: [home.hero.title, home.games.title]
    },
    {
      route: '/about',
      title: about.seo.title,
      markers: [about.hero.title, about.storySection.title]
    },
    {
      route: '/contact',
      title: contact.seo.title,
      markers: [contact.hero.title, `mailto:${global.contactEmail}`]
    },
    {
      route: '/games/heritage',
      title: heritage.seo.title,
      markers: [heritage.hero.title, heritage.media.sectionTitle]
    }
  ];

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const errors = await runSingleAttempt(normalizedBase, checks);
    if (errors.length === 0) {
      console.log(`Production smoke checks passed on attempt ${attempt}.`);
      return;
    }

    console.log(`Attempt ${attempt}/${maxAttempts} failed with ${errors.length} issue(s).`);
    errors.forEach((error) => console.log(`- ${error}`));

    if (attempt < maxAttempts) {
      console.log(`Waiting ${delayMs}ms before retrying...`);
      await wait(delayMs);
    }
  }

  console.error('Production smoke checks failed after all retries.');
  process.exit(1);
}

main();