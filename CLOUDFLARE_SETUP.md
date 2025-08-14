# Cloudflare Setup Guide for jobequal.ch

This document outlines the recommended DNS and security settings for `jobequal.ch` in Cloudflare.

## 1. DNS Records

Log in to your Cloudflare dashboard, select your domain `jobequal.ch`, and go to the DNS section. Here are the records you should have. Please replace `SWIZ_HOSTING_IP` with the actual IP address of your hosting at Swizzonic.

| Type  | Name (Subdomain) | Content                               | Proxy Status | Notes                                                              |
| :---- | :--------------- | :------------------------------------ | :----------- | :----------------------------------------------------------------- |
| A     | `jobequal.ch`    | `SWIZ_HOSTING_IP`                     | Proxied      | This points your main domain to your web server.                   |
| CNAME | `www`            | `jobequal.ch`                         | Proxied      | This makes `www.jobequal.ch` work.                                 |
| MX    | `jobequal.ch`    | `mx.swizzonic.ch` (or your specific MX) | DNS Only     | This handles your email. It **must not** be proxied (grey cloud).  |
| TXT   | `jobequal.ch`    | `v=spf1 include:swizzonic-mail.ch ~all` | DNS Only     | SPF record for email. Verify the exact value with Swizzonic.       |
| TXT   | `_dmarc`         | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@jobequal.ch` | DNS Only | DMARC record for email. You can start with `p=none`. |
| TXT   | `default._domainkey` | (Your DKIM key from Swizzonic)      | DNS Only     | DKIM record for email. You need to get this from Swizzonic.      |

**Important:**
*   **Proxy Status:** The orange cloud (Proxied) means Cloudflare's security and performance features are active. The grey cloud (DNS Only) is for traffic that should not go through Cloudflare's proxy, like email.
*   **DNSSEC:** Once your DNS is configured, you can enable DNSSEC in the Cloudflare dashboard for added security.

## 2. SSL/TLS Settings

Go to the **SSL/TLS** section in your Cloudflare dashboard.

*   **Encryption Mode:** Set this to **Full (Strict)**. This provides the most secure connection. This requires that you have an SSL certificate on your Swizzonic hosting. If you don't have one, you can use **Full**, but it's less secure. You can often get a free SSL certificate (e.g., from Let's Encrypt) from your hosting provider.
*   **Always Use HTTPS:** Turn this **On**. This will redirect all `http` requests to `https`.
*   **HTTP Strict Transport Security (HSTS):** Enable this. A recommended starting value for `max-age` is `6 months` (15552000 seconds). Be cautious when enabling HSTS, as it can be difficult to undo.
*   **Minimum TLS Version:** Set this to **1.2**.

## 3. Security & Performance

*   **WAF (Web Application Firewall):** Go to the **Security > WAF** section. Enable the "Cloudflare Managed Ruleset" to protect against common vulnerabilities.
*   **HTTP/3:** Go to the **Network** section and enable **HTTP/3 (with QUIC)**.
*   **Brotli:** Go to the **Speed > Optimization** section and enable **Brotli** for faster compression.
*   **Auto Minify:** In the same section, you can enable Auto Minify for HTML, CSS, and JavaScript.

## 4. Cache Purging

The GitHub Actions workflow is configured to automatically purge the Cloudflare cache after each deployment. This requires you to create an API token with the `Zone.Cache Purge` permission and add it as a secret (`CF_API_TOKEN`) to your GitHub repository. You will also need your `CF_ZONE_ID`.
