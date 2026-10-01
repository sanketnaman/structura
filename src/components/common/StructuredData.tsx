import React, { useEffect } from 'react';
import { buildStructuredDataSchemas } from '../../lib/structuredData';

interface StructuredDataProps {
  pathname: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ pathname }) => {
  useEffect(() => {
    // Remove any existing dynamic mixtally json-ld scripts on route change
    const existingScripts = document.querySelectorAll('script[data-mixtally-ld="true"]');
    existingScripts.forEach((script) => script.remove());

    // Same pure builder the build-time renderer serializes — schema content
    // is shared, only the injection mechanism differs (effect vs prerender).
    buildStructuredDataSchemas(pathname).forEach((schemaObj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-mixtally-ld', 'true');
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });

    return () => {
      const cleanupScripts = document.querySelectorAll('script[data-mixtally-ld="true"]');
      cleanupScripts.forEach((script) => script.remove());
    };
  }, [pathname]);

  return null;
};
