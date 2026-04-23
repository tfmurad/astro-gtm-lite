# astro-gtm-lite

> A zero-component Astro integration for **Google Tag Manager (GTM)**.

Easily inject Google Tag Manager snippets into your Astro site. Supports Astro v4, v5, and **v6**. Works seamlessly with **View Transitions (clientRouter)**.

Instead of manually adding GTM `<script>` and `<noscript>` tags to every page, `astro-gtm-lite` hooks into Astro's build pipeline and injects the official Google Tag Manager snippets automatically — no layout edits required.

---

## Install

```bash
npm install astro-gtm-lite
```

## Usage — Integration (recommended)

Add it once in `astro.config.mjs` and forget about it:

```js
import { defineConfig } from "astro/config";
import gtm from "astro-gtm-lite";

export default defineConfig({
  integrations: [
    gtm({
      id: "GTM-XXXXXX",
    }),
  ],
});
```

The script is injected automatically into every page — no layout edits required.

> **Note:** GTM is **disabled during `astro dev`** by default. Set `devMode: true` if you want to test GTM in development.

### Astro View Transitions

`astro-gtm-lite` works seamlessly with and without [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/).

On each client-side navigation, a `virtualPageview` event is pushed to `dataLayer` with the updated page path and title. The `astro:after-swap` event is used, which fires immediately after the DOM is swapped — perfect for analytics tracking.

To track these virtual page views in GTM, create a **Custom Event** trigger with event name `virtualPageview`, and use **Data Layer Variables** for `virtualPagePath` and `virtualPageTitle` to populate your GA4 / Universal Analytics tags.

### Options

| Option          | Type      | Default                              | Description                            |
| --------------- | --------- | ------------------------------------ | -------------------------------------- |
| `id`            | `string`  | **required**                         | Your GTM container ID (`GTM-XXXXXX`)   |
| `enable`        | `boolean` | `true`                               | Globally toggle GTM injection on/off   |
| `devMode`       | `boolean` | `false`                              | Inject snippets during `astro dev`     |
| `dataLayerName` | `string`  | `"dataLayer"`                        | Rename the global `dataLayer` variable |
| `domain`        | `string`  | `"https://www.googletagmanager.com"` | Self-hosting or proxy domain           |

### Validation

- `id` is strictly validated and must match the pattern `GTM-XXXXXX` (alphanumeric suffix, case-insensitive).
- `domain` must be a valid URL with `http:` or `https:` protocol.

## Usage — Component (optional)

If you prefer the classic component approach, import it directly:

```astro
---
import Gtm from "astro-gtm-lite/component";
---

<head>
  <Gtm id="GTM-XXXXXX" />
</head>
```

You can also conditionally disable it:

```astro
<Gtm id="GTM-XXXXXX" enable={false} />
```

## License

[MIT](LICENSE) © [Al Murad Uzzaman](https://github.com/tfmurad)
