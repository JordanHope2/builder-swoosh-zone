// client/components/Navigation/index.tsx
import React from 'react';

export default function Navigation() {
  return (
    <nav style={{ padding: 12, display: 'flex', gap: 12 }}>
      <a href="/">Home</a>
      <a href="/jobs">Jobs</a>
      <a href="/about">About</a>
    </nav>
  );
}
