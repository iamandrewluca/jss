import { NextRequest, NextResponse } from 'next/server';
import { RedirectsMiddleware } from '@sitecore-jss/sitecore-jss-nextjs/middleware';
import config from 'temp/config';
import { MiddlewarePlugin } from '..';

class RedirectsPlugin implements MiddlewarePlugin {
  private redirectsMiddleware: RedirectsMiddleware;
  order = 0;

  constructor() {
    this.redirectsMiddleware = new RedirectsMiddleware({
      endpoint: config.graphQLEndpoint,
      apiKey: config.sitecoreApiKey,
      siteName: config.jssAppName,
      // These are all the locales you support in your application.
      // These should match those in your next.config.js (i18n.locales).
      locales: ['en'],
      // This function determines if a route should be excluded from RedirectsMiddleware.
      // Certain paths are ignored by default (e.g. files and Next.js API routes), but you may wish to exclude more.
      // This is an important performance consideration since Next.js Edge middleware runs on every request.
      excludeRoute: () => false,
      // This function determines if the middleware should be turned off.
      // By default it is disabled while in development mode.
      disabled: () => process.env.NODE_ENV === 'development',
    });
  }

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(req: NextRequest): Promise<NextResponse> {
    return this.redirectsMiddleware.getHandler()(req);
  }
}

export const redirectsPlugin = new RedirectsPlugin();
