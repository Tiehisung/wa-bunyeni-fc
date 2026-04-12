'use client'

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function useSEO({ title, description, ogImage, ogUrl }: SEOProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tags
    const updateMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const updateName = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Set meta tags
    if (description) {
      updateName("description", description);
      updateMeta("og:description", description);
    }

    if (ogImage) {
      updateMeta("og:image", ogImage);
      updateMeta("og:image:width", "1200");
      updateMeta("og:image:height", "630");
    }

    if (title) {
      updateMeta("og:title", title);
    }

    if (ogUrl) {
      updateMeta("og:url", ogUrl);
    }

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", ogUrl || window.location.href);
  }, [title, description, ogImage, ogUrl]);
}
