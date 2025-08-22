import React, { useEffect, useState } from "react";
import { BuilderComponent, builder } from "@builder.io/react";
import { builderConfig } from "../lib/builderConfig";

// Initialize the Builder SDK with your public API key
builder.init(builderConfig.apiKey);

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
          builder.get("header").promise(),
          builder.get("footer").promise(),
        ]);
        setHeaderContent(header);
        setFooterContent(footer);
      } catch (error) {
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
      {headerContent && <BuilderComponent model="header" content={headerContent} />}
      <main>{children}</main>
      {footerContent && <BuilderComponent model="footer" content={footerContent} />}
    </div>
  );
}
