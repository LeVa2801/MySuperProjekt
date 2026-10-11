export type RequestSnippets = { fetch: string; curl: string };

type RequestInput = { method: string; endpoint: string; token: string; body: string };

export function buildRequestSnippets({ method, endpoint, token, body }: RequestInput): RequestSnippets {
  const supportsBody = ["POST", "PUT", "PATCH"].includes(method);
  let parsedBody: unknown = {};
  if (supportsBody && body.trim()) {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return { fetch: "", curl: "" };
    }
  }
  const headers = `  headers: {\n${[
    '    "Accept": "application/json",',
    ...(token.trim() ? [`    "Authorization": ${JSON.stringify(`Bearer ${token.trim()}`)},`] : []),
    ...(supportsBody ? ['    "Content-Type": "application/json",'] : []),
  ].join("\n")}\n  },`;
  const requestBody = supportsBody ? `\n  body: JSON.stringify(${JSON.stringify(parsedBody, null, 2).replace(/\n/g, "\n  ")}),` : "";
  const fetchCode = `const response = await fetch(${JSON.stringify(endpoint.trim())}, {\n  method: ${JSON.stringify(method)},\n${headers}${requestBody}\n});\n\nif (!response.ok) {\n  throw new Error(\`Request failed: \${response.status}\`);\n}\n\nconst data = await response.json();\nconsole.log(data);`;
  const shellQuote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`;
  const curlHeaders = token.trim() ? ` \\\n  -H ${shellQuote(`Authorization: Bearer ${token.trim()}`)}` : "";
  const curlBody = supportsBody ? ` \\\n  -H 'Content-Type: application/json' \\\n  -d ${shellQuote(JSON.stringify(parsedBody))}` : "";
  return { fetch: fetchCode, curl: `curl -X ${method} ${shellQuote(endpoint.trim())} \\\n  -H 'Accept: application/json'${curlHeaders}${curlBody}` };
}
