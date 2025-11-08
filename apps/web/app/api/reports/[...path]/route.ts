const LEGACY_ABSENSI_BASE_URL = process.env.LEGACY_ABSENSI_BASE_URL ?? 'http://absensi';

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  const search = new URL(request.url).search;
  const targetPath = params.path?.join('/') ?? '';
  const targetUrl = `${LEGACY_ABSENSI_BASE_URL.replace(/\/$/, '')}/${targetPath}${search}`;

  const legacyResponse = await fetch(targetUrl, {
    headers: {
      'X-Forwarded-Host': request.headers.get('host') ?? '',
    },
  });

  const contentType = legacyResponse.headers.get('content-type') ?? 'text/html';
  const body = await legacyResponse.text();

  return new Response(body, {
    status: legacyResponse.status,
    headers: {
      'content-type': contentType,
    },
  });
}

