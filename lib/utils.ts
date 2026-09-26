import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely serialize an object for embedding in a <script type="application/ld+json">
 * tag. JSON.stringify alone does not escape "<", so if the payload contains
 * user- or admin-supplied text (e.g. an event description) with a literal
 * "</script>" in it, that text can terminate the script tag early and inject
 * arbitrary markup/script into the page. Escaping "<" as a unicode escape
 * neutralizes that while staying valid, parseable JSON.
 */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
