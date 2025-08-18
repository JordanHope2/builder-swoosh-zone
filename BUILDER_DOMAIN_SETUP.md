# Builder.io Domain Configuration for JobEqual

## Overview

This guide explains how to configure Builder.io project settings to allow your production domains: `https://jobequal.ch` and `https://www.jobequal.ch`.

## Steps to Configure Builder.io Project Settings

### 1. Access Builder.io Dashboard

1. Go to [Builder.io Dashboard](https://builder.io/models)
2. Log in with your Builder.io account
3. Select your JobEqual project

### 2. Configure Allowed Hostnames/Preview Settings

#### Option A: Through Builder.io Dashboard UI

1. Navigate to **Settings** → **General** in your Builder.io project
2. Find the **"Allowed Hostnames"** or **"Preview URLs"** section
3. Add the following domains:
   ```
   https://jobequal.ch
   https://www.jobequal.ch
   http://localhost:8080
   https://preview-*.netlify.app
   ```

#### Option B: Through Space Settings

1. In Builder.io dashboard, go to **Space Settings**
2. Click on **"Hosts"** or **"Preview Configuration"**
3. Add your production domains:
   - Primary: `https://jobequal.ch`
   - Secondary: `https://www.jobequal.ch`
4. Set preview URL to: `https://jobequal.ch`

### 3. Configure API Keys and Environment

Your current Builder.io configuration:

```javascript
VITE_PUBLIC_BUILDER_KEY = a8a771bec0f40debf22ee94a25cce67;
NEXT_PUBLIC_BUILDER_API_KEY = ea8a771bec0f40debf22ee94a25cce67;
```

### 4. Set Up Content Models (if needed)

If you're using Builder.io for content management, ensure these models are configured:

- **Page**: For general pages
- **Header**: For navigation content
- **Footer**: For footer content
- **Blog**: For blog posts
- **Job Listing**: For job content

### 5. Preview Configuration

1. In Builder.io dashboard, go to **Models** → **Page**
2. Click **"Preview"** or **"Configure Preview"**
3. Set the preview URL to: `https://jobequal.ch`
4. Add preview paths:
   ```
   /
   /jobs
   /about
   /contact
   /dashboard
   ```

### 6. CORS and Security Settings

Ensure your Builder.io space allows:

- **Origin**: `https://jobequal.ch`, `https://www.jobequal.ch`
- **Methods**: GET, POST, OPTIONS
- **Headers**: Content-Type, Authorization

### 7. Test Configuration

After setup, test by:

1. Visiting `https://jobequal.ch` (when deployed)
2. Checking Builder.io preview functionality
3. Verifying content loads correctly
4. Testing edit mode in Builder.io

## Environment Variables

Make sure these are set in your production environment:

```bash
# Builder.io
VITE_PUBLIC_BUILDER_KEY=a8a771bec0f40debf22ee94a25cce67

# Production URLs
VITE_APP_URL=https://jobequal.ch
VITE_API_URL=https://jobequal.ch/api
```

## Deployment Notes

When deploying to production:

1. **Netlify**: Configure environment variables in Netlify dashboard
2. **Vercel**: Add environment variables in Vercel project settings
3. **Custom Server**: Ensure environment variables are set

## Verification Checklist

- [ ] Builder.io project allows `https://jobequal.ch`
- [ ] Builder.io project allows `https://www.jobequal.ch`
- [ ] Preview URL is set to `https://jobequal.ch`
- [ ] API keys are correctly configured
- [ ] Content models are set up (if using)
- [ ] CORS settings allow your domains
- [ ] Environment variables are set in production

## Troubleshooting

### Common Issues:

1. **"Domain not allowed" error**

   - Check allowed hostnames in Builder.io settings
   - Verify domain spelling and protocol (https/http)

2. **Preview not working**

   - Ensure preview URL is set correctly
   - Check that your site is accessible publicly

3. **Content not loading**
   - Verify API key is correct
   - Check network requests for CORS errors

### Support

If you encounter issues:

1. Check Builder.io documentation: https://www.builder.io/c/docs
2. Contact Builder.io support
3. Verify your domain configuration

## Security Considerations

- Only add trusted domains to allowed hostnames
- Use HTTPS for all production domains
- Regularly review and update allowed domains
- Monitor for unauthorized access attempts

---

**Last Updated**: January 2024
**Project**: JobEqual Platform
**Domains**: jobequal.ch, www.jobequal.ch
