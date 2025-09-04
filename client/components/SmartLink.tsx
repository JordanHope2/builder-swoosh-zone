import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

// TODO: This component is the key to the gradual migration.
// The logic needs to be completed once the next.config.js rewrites are in place.
//
// The goal is to intelligently render either a Next.js <Link> for migrated routes
// or a React Router <Link> for legacy routes.

type SmartLinkProps = React.PropsWithChildren<ReactRouterLinkProps & NextLinkProps>;

export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  // Define which paths have been migrated to Next.js
  const migratedPaths = ['/about', '/job'];

  // Determine if the link's destination is a migrated Next.js page.
  // The logic checks if the href starts with any of the migrated paths.
  const isMigrated = typeof href === 'string' && migratedPaths.some(path => href.startsWith(path));

  if (isMigrated) {
    // If the page is migrated, use the Next.js Link component.
    // The `to` prop from React Router is ignored here.
    const { to, ...nextLinkProps } = props;
    return (
      <NextLink href={href} {...nextLinkProps}>
        {children}
      </NextLink>
    );
  }

  // If the page is a legacy page, use the react-router-dom Link component.
  // The `href` prop from Next.js is ignored; we use the `to` prop instead.
  return (
    <ReactRouterLink to={href} {...props}>
      {children}
    </ReactRouterLink>
  );
}
