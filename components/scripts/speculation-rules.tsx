// Document speculation rules for hard navigations (new tab, cmd/ctrl-click,
// first paint). Soft navigations still use Next.js `<Link>` prefetch.
// Unsupported browsers ignore `<script type="speculationrules">`.
//
// Two tiers, both capped at 2 in-flight by Chrome (FIFO):
// - prefetch `eager`: HTML only, ~10ms hover (viewport heuristics on mobile)
// - prerender `moderate`: full render after ~200ms hover / pointer down
const sameOriginNavigations = {
  and: [
    { href_matches: '/*' },
    { not: { href_matches: '/api/*' } },
    { not: { selector_matches: '.no-prerender' } },
    { not: { selector_matches: '[rel~=nofollow]' } },
  ],
};

const speculationRules = {
  prefetch: [
    {
      eagerness: 'eager',
      where: sameOriginNavigations,
    },
  ],
  prerender: [
    {
      eagerness: 'moderate',
      where: sameOriginNavigations,
    },
  ],
  tag: 'drop',
};

export function SpeculationRules() {
  return <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }} />;
}
