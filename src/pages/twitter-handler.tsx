import Page from '@/components/ui/Page/Page';
import Head from 'next/head';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Terms() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    console.log('Twitter Callback Params:', { code, state });

    if (!code) return;

    if (state === 'edit-profile') {
      window.location.href = `/profile?code=${code}`;
    }
    if (state === 'create-campaign') {
      window.location.href = `/create-campaign?code=${code}`;
    }
  }, []);
  return (
    <>
      <Head>
        <title>NiceApe</title>
      </Head>
      <Page>
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Redirecting ...
              </h1>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
