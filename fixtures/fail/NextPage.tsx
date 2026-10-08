// Trips nextjs/no-img-element and nextjs/no-sync-scripts under the nextjs entry.
export const NextPage = () => (
  <main>
    <img src="/hero.png" alt="Hero" />
    <script src="/analytics.js" />
  </main>
);
