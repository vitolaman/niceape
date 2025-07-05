import Page from '@/components/ui/Page/Page';
import Hero from '@/components/Hero';
import ActiveCampaigns from '@/components/ActiveCampaigns';
import LaunchCampaign from '@/components/LaunchCampaign';
import PlatformStats from '@/components/PlatformStats';
import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>NiceApe - Trade to Donate</title>
      </Head>
      <Page>
        <Hero />
        <ActiveCampaigns />
        <PlatformStats />
      </Page>
    </>
  );
}
