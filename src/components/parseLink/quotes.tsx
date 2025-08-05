import React from "react";

interface QuoteProps {
  children: React.ReactNode;
  author?: string;
}

export default function Quote({ children, author }: QuoteProps) {
  return (
    <figure className="my-8 border-l-4 border-primary pl-6 bg-muted p-4 rounded-md shadow-sm">
      <blockquote className="text-lg italic text-muted-foreground">
        {children}
      </blockquote>
      {author && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-right">
          — {author}
        </figcaption>
      )}
    </figure>
  );
}
