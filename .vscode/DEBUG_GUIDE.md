# VS Code Debugging Guide for Nice Ape Full-Stack Application

This guide explains how to debug your full-stack application using VS Code's integrated debugger.

## Available Debug Configurations

### 1. Frontend Debugging

#### Next.js Server-Side Debugging

- **Configuration**: "Next.js: debug server-side"
- **Purpose**: Debug server-side Next.js code (API routes, server components, SSR)
- **Port**: 9229
- **Usage**: Set breakpoints in your server-side code and start this configuration

#### Next.js Client-Side Debugging

- **Configuration**: "Next.js: debug client-side"
- **Purpose**: Debug client-side React code in Chrome browser
- **Usage**: Set breakpoints in your React components and start this configuration

### 2. Backend Debugging

#### Cloudflare Worker Local Debugging

- **Configuration**: "Cloudflare Worker: debug local"
- **Purpose**: Debug your Cloudflare Worker running locally
- **Port**: 8787 (worker), 9230 (debugger)
- **Usage**: Set breakpoints in your worker code (`worker/index.ts`, API controllers)

#### Cloudflare Worker Remote Debugging

- **Configuration**: "Cloudflare Worker: debug remote"
- **Purpose**: Debug your worker running on Cloudflare's edge (limited debugging)
- **Usage**: For testing against real Cloudflare environment

### 3. Full-Stack Debugging (Compound Configurations)

#### Complete Full Stack Debug

- **Configuration**: "Complete Full Stack Debug"
- **Purpose**: Debug frontend (both server & client) + backend simultaneously
- **Includes**: Next.js server-side + client-side + Worker local

#### Full Stack: Next.js + Worker (Local)

- **Configuration**: "Full Stack: Next.js + Worker (Local)"
- **Purpose**: Debug server-side and worker together
- **Includes**: Next.js server-side + Worker local

## How to Debug

### Setting Up for Debugging

1. **Install Required Extensions** (if not already installed):
   - JavaScript Debugger (built-in)
   - TypeScript support (built-in)

2. **Start Debug Session**:
   - Open the Debug panel (`Cmd+Shift+D` on macOS)
   - Select your desired configuration from the dropdown
   - Press F5 or click the green play button

### Debugging Workflow

#### For Frontend Issues (React Components, Client-Side):

1. Set breakpoints in your React components
2. Use "Next.js: debug client-side" configuration
3. Browser will open automatically
4. Navigate to the page you want to debug
5. Breakpoints will hit when the code executes

#### For API Route Issues:

1. Set breakpoints in your API routes (`worker/api/*`)
2. Use "Next.js: debug server-side" configuration
3. Make API calls from your frontend or use tools like Postman
4. Breakpoints will hit in the API code

#### For Worker/Backend Issues:

1. Set breakpoints in your worker code (`worker/*`)
2. Use "Cloudflare Worker: debug local" configuration
3. Make API calls to `http://localhost:8787`
4. Breakpoints will hit in the worker code

#### For Full-Stack Issues:

1. Set breakpoints in both frontend and backend code
2. Use "Complete Full Stack Debug" configuration
3. Both servers will start automatically
4. Debug end-to-end functionality

### Debugging Your Current Code (`createCampaign.ts`)

To debug the `createCampaign` function:

1. **Set breakpoints** in `src/actions/createCampaign.ts`:
   - Line 105: Before API call
   - Line 119: After getting create result
   - Line 125: Before signing transaction
   - Line 128: After sending transaction

2. **Set breakpoints** in worker code:
   - `worker/api/create-campaign/create-campaign.controller.ts`
   - `worker/api/finalize-campaign/finalize-campaign.controller.ts`

3. **Start debugging**:
   - Use "Complete Full Stack Debug" configuration
   - Navigate to your create campaign page
   - Fill out the form and submit
   - Step through the code execution

### Debug Console Commands

While debugging, you can use the Debug Console to:

```javascript
// Inspect variables
console.log(formData);
console.log(tokenMint);

// Check transaction state
console.log(transaction.instructions);

// Verify wallet connection
console.log(userWallet);
```

### Common Debugging Scenarios

#### Transaction Issues:

- Set breakpoints before and after transaction signing
- Inspect transaction object structure
- Check for proper base64 encoding/decoding

#### API Communication Issues:

- Set breakpoints in both client and worker API handlers
- Check request/response data
- Verify CORS headers

#### File Upload Issues:

- Debug file-to-base64 conversion
- Check file sizes and formats
- Verify upload to storage

### Tips for Effective Debugging

1. **Use Conditional Breakpoints**: Right-click on a breakpoint to add conditions
2. **Watch Variables**: Add variables to the Watch panel for continuous monitoring
3. **Call Stack**: Use the call stack to understand execution flow
4. **Step Through Code**: Use F10 (step over), F11 (step into), Shift+F11 (step out)
5. **Debug Console**: Evaluate expressions and run code in the current context

### Troubleshooting

#### Breakpoints Not Hitting:

- Check if source maps are enabled
- Verify the code is actually being executed
- Make sure you're using the correct debug configuration

#### Cannot Connect to Debugger:

- Check if ports 9229/9230 are available
- Restart the debug session
- Verify Node.js inspector is enabled

#### Worker Debugging Issues:

- Use local worker configuration for better debugging support
- Remote worker debugging has limitations
- Check wrangler.toml configuration

### Performance Debugging

For performance issues:

- Use Chrome DevTools Performance tab (when debugging client-side)
- Add timing logs in your code
- Monitor network requests in the Network tab
- Use React DevTools Profiler for component performance

### Environment Variables

Make sure your environment variables are set up correctly for debugging:

- Check `.env.local` file
- Verify Cloudflare Worker environment variables
- Ensure database connections are properly configured

## Quick Reference

| Task                   | Configuration                  | Port      |
| ---------------------- | ------------------------------ | --------- |
| Debug React components | Next.js: debug client-side     | Browser   |
| Debug API routes       | Next.js: debug server-side     | 9229      |
| Debug Worker locally   | Cloudflare Worker: debug local | 8787/9230 |
| Debug everything       | Complete Full Stack Debug      | Multiple  |

Remember to stop all debugging sessions when done to free up ports and resources.
