import { Content, fetchOneEntry } from "@builder.io/sdk-react";
import React, { useEffect, useState } from "react";

import { builderConfig } from "../lib/builderConfig";

interface SharedLayoutProps {
  children: React.ReactNode;
}

export function SharedLayout({ children }: SharedLayoutProps) {
  const [headerContent, setHeaderContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLayoutContent() {
      try {
        const [header, footer] = await Promise.all([
          fetchOneEntry({
            model: "header",
            apiKey: builderConfig.apiKey,
          }),
          fetchOneEntry({
            model: "footer",
            apiKey: builderConfig.apiKey,
          }),
        ]);
        setHeaderContent(header);
        setFooterContent(footer);
      } catch (err: unknown) {
        console.error("Error fetching Builder.io layout content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLayoutContent();
  }, []);

  // While fetching, we can show a loader or a fallback static header/footer
  if (loading) {
    // You can return a full-page loader here if you prefer
    return <div>{children}</div>;
  }

  return (
    <div>
      {headerContent && <Content model="header" content={headerContent} apiKey={builderConfig.apiKey} />}
      <main>{children}</main>
      {footerContent && <Content model="footer" content={footerContent} apiKey={builderConfig.apiKey} />}
    </div>
  );
}
