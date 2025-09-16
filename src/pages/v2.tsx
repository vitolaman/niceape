import Page from '@/components/ui/Page/Page';
import ActiveCampaigns from '@/components/ActiveCampaigns';
import LaunchCampaign from '@/components/LaunchCampaign';
import PlatformStats from '@/components/PlatformStats';
import Head from 'next/head';
import Hero2 from '@/components/Hero2';

export default function Index() {
  return (
    <>
      <Head>
        <title>NiceApe - Trade to Donate</title>
      </Head>
      <Page>
        <Hero2 />
        <ActiveCampaigns />
        {/* <PlatformStats /> */}
      </Page>
    </>
  );
}
