interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

interface HandlerContext {
  request: Request;
  env: Env;
}

interface ContactPayload {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
  website: string;
  turnstileToken: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8'
};

export const onRequestPost = async (context: HandlerContext): Promise<Response> => {
  const { request, env } = context;

  if (
    !env.TURNSTILE_SECRET_KEY ||
    !env.RESEND_API_KEY ||
    !env.CONTACT_RECIPIENT_EMAIL ||
    !env.CONTACT_FROM_EMAIL
  ) {
    return json(
      {
        ok: false,
        error:
          'Server is missing email or verification configuration. Set required environment variables first.'
      },
      500
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request payload.' }, 400);
  }

  const payload = normalizePayload(rawBody);

  if (payload.website) {
    return json({ ok: true });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return json({ ok: false, error: validationError }, 400);
  }

  const turnstileOk = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    payload.turnstileToken,
    request.headers.get('CF-Connecting-IP')
  );

  if (!turnstileOk) {
    return json({ ok: false, error: 'Verification failed. Please try again.' }, 400);
  }

  const delivered = await sendWithResend(payload, env);
  if (!delivered.ok) {
    return json({ ok: false, error: delivered.error }, 502);
  }

  return json({ ok: true });
};

function normalizePayload(value: unknown): ContactPayload {
  const data = asRecord(value);

  return {
    name: normalizeSingleLine(data.name, 90),
    email: normalizeSingleLine(data.email, 130),
    company: normalizeSingleLine(data.company, 120),
    topic: normalizeSingleLine(data.topic, 40),
    message: normalizeMultiline(data.message, 3000),
    website: normalizeSingleLine(data.website, 200),
    turnstileToken: normalizeSingleLine(data.turnstileToken, 2000)
  };
}

function validatePayload(payload: ContactPayload): string | null {
  if (payload.name.length < 2) {
    return 'Please provide your name.';
  }

  if (!isValidEmail(payload.email)) {
    return 'Please provide a valid email address.';
  }

  if (!payload.topic) {
    return 'Please select a topic.';
  }

  if (payload.message.length < 20) {
    return 'Please provide a more detailed message.';
  }

  if (!payload.turnstileToken) {
    return 'Missing verification token.';
  }

  return null;
}

async function verifyTurnstile(
  secret: string,
  token: string,
  remoteIp: string | null
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);

  if (remoteIp) {
    body.set('remoteip', remoteIp);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

async function sendWithResend(
  payload: ContactPayload,
  env: Required<Env>
): Promise<{ ok: boolean; error?: string }> {
  const subject = `[Website Contact] ${formatTopic(payload.topic)} | ${payload.name}`;

  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Organization: ${payload.company || 'Not provided'}`,
    `Topic: ${formatTopic(payload.topic)}`,
    '',
    'Message:',
    payload.message
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_RECIPIENT_EMAIL],
      reply_to: payload.email,
      subject,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      ok: false,
      error: `Email delivery failed (${response.status}). ${body.slice(0, 240)}`
    };
  }

  return { ok: true };
}

function formatTopic(topic: string): string {
  switch (topic) {
    case 'press':
      return 'Press / Creator Coverage';
    case 'community':
      return 'Community / Feedback';
    case 'gameplay':
      return 'Heritage Gameplay Question';
    case 'bug':
      return 'Heritage Bug Report';
    default:
      return topic || 'Other';
  }
}

function normalizeSingleLine(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizeMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\r/g, '').trim().slice(0, maxLength);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}
