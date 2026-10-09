// Expected under nextjs only:
//   next/no-img-element
//   next/no-sync-scripts
export const NextPage = () => (
  <main>
    <img src="/hero.png" alt="Hero" />
    <script src="/analytics.js" />
  </main>
);
