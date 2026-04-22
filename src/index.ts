import type { AstroIntegration } from "astro";

export interface GtmOptions {
  /** Your GTM container ID, e.g. GTM-XXXXXX */
  id: string;
  /** Whether to enable GTM injection. Default: true */
  enable?: boolean;
  /** Whether to inject snippets during `astro dev`. Default: false */
  devMode?: boolean;
  /** Custom dataLayer variable name. Default: "dataLayer" */
  dataLayerName?: string;
  /** Custom GTM script domain. Default: "https://www.googletagmanager.com" */
  domain?: string;
}

function escapeJsString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function validateGtmId(id: string): void {
  if (!id || !/^GTM-[A-Z0-9]+$/i.test(id)) {
    throw new Error(
      `[astro-gtm-lite] Invalid GTM ID: "${id}". It must match "GTM-XXXXXX" (e.g. GTM-ABC123).`,
    );
  }
}

function validateDomain(domain: string): void {
  try {
    const url = new URL(domain);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
  } catch {
    throw new Error(
      `[astro-gtm-lite] Invalid domain: "${domain}". It must be a valid HTTP/HTTPS URL.`,
    );
  }
}

function buildGtmScript(opts: Required<GtmOptions>): string {
  const { id, dataLayerName, domain } = opts;
  const safeDomain = escapeJsString(domain);
  const safeDataLayerName = escapeJsString(dataLayerName);
  const safeId = escapeJsString(id);

  return `
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='${safeDomain}/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','${safeDataLayerName}','${safeId}');
  `;
}

export default function gtmLite(options: GtmOptions): AstroIntegration {
  const opts: Required<GtmOptions> = {
    enable: true,
    devMode: false,
    dataLayerName: "dataLayer",
    domain: "https://www.googletagmanager.com",
    ...options,
  };

  if (!opts.enable) {
    return {
      name: "astro-gtm-lite",
      hooks: {},
    };
  }

  validateGtmId(opts.id);
  validateDomain(opts.domain);

  return {
    name: "astro-gtm-lite",
    hooks: {
      "astro:config:setup": ({ injectScript, command }) => {
        if (command === "dev" && !opts.devMode) return;

        injectScript("head-inline", buildGtmScript(opts));
      },
    },
  };
}
