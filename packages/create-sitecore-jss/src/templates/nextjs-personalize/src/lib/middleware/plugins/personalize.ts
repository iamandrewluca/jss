import { NextRequest, NextResponse } from 'next/server';
import { PersonalizeMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import { MiddlewarePlugin } from '..';
import config from 'temp/config';
import { PosResolver } from 'lib/pos-resolver';

/**
 * This is the personalize middleware plugin for Next.js.
 * It is used to enable Sitecore personalization of pages in Next.js.
 *
 * The `PersonalizeMiddleware` will
 *  1. Make a call to the Sitecore Experience Edge to get the personalization information about the page.
 *  2. Based on the response, make a call to the Sitecore CDP (with request/user context) to determine the page variant.
 *  3. Rewrite the response to the specific page variant.
 */
class PersonalizePlugin implements MiddlewarePlugin {
  private personalizeMiddleware: PersonalizeMiddleware;

  // Using 1 to leave room for things like redirects to occur first
  order = 1;

  constructor() {

    this.personalizeMiddleware = new PersonalizeMiddleware({
      // Configuration for your Sitecore Experience Edge endpoint
      edgeConfig: {
        endpoint: config.graphQLEndpoint,
        apiKey: config.sitecoreApiKey,
        siteName: config.jssAppName,
        timeout:
          (process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT &&
            parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT)) ||
          250,
      },
      // Configuration for your Sitecore CDP endpoint
      cdpConfig: {
        endpoint: process.env.NEXT_PUBLIC_CDP_TARGET_URL || '',
        clientKey: process.env.NEXT_PUBLIC_CDP_CLIENT_KEY || '',
        timeout:
          (process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT &&
            parseInt(process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT)) ||
          250,
      },
      // This function determines if the middleware should be turned off.
      // IMPORTANT: You should implement based on your cookie consent management solution of choice.
      // You may wish to keep it disabled while in development mode.
      disabled: () => process.env.NODE_ENV === 'development',
      // This function determines if a route should be excluded from personalization.
      // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to exclude more.
      // This is an important performance consideration since Next.js Edge middleware runs on every request.
      excludeRoute: () => false,
      // This function resolves point of sale for cdp calls.
      // Point of sale may differ by locale and middleware will use request language to get the correct value every time it's invoked
      getPointOfSale: PosResolver.resolve,
    });
  }

  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    return this.personalizeMiddleware.getHandler()(req, res);
  }
}

export const personalizePlugin = new PersonalizePlugin();
