# Email Setup Guide for jobequal.ch

This guide provides a focused overview of the DNS records required to ensure your email continues to work correctly after switching your DNS to Cloudflare. These records should be added to your DNS settings in the Cloudflare dashboard.

## Email DNS Records

It is critical that the following DNS records are configured correctly in Cloudflare to ensure uninterrupted email service with Swizzonic.

| Type  | Name (Subdomain) | Content                               | Proxy Status |
| :---- | :--------------- | :------------------------------------ | :----------- |
| MX    | `jobequal.ch`    | `mx.swizzonic.ch` (or your specific MX) | DNS Only     |
| TXT   | `jobequal.ch`    | `v=spf1 include:swizzonic-mail.ch ~all` | DNS Only     |
| TXT   | `_dmarc`         | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@jobequal.ch` | DNS Only |
| TXT   | `default._domainkey` | (Your DKIM key from Swizzonic)      | DNS Only     |

### Key Points:

*   **Proxy Status:** All email-related records **must** be set to "DNS Only" (grey cloud). If they are proxied (orange cloud), your email will not work.
*   **Verification:** Please double-check the exact values for your MX, SPF, and DKIM records with Swizzonic's documentation or support. The values above are common examples but may differ for your specific account.
*   **DMARC:** The `p=quarantine` policy is a good middle ground. You can start with `p=none` to monitor reports before moving to `quarantine` or `reject`.

### Testing

After you have configured these records in Cloudflare, you can use a tool like [MXToolbox](https://mxtoolbox.com/) to verify that your MX, SPF, DKIM, and DMARC records are set up correctly.
