import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically redirect the user to a default table page.
  redirect('/tables/legal-contracts');
}
