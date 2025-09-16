import Head from 'next/head';
import Hero2 from '@/components/Hero2';
import Page2 from '@/components/ui/Page/Page2';
import ActiveCampaigns2 from '@/components/ActiveCampaigns2';

export default function Index() {
  return (
    <>
      <Head>
        <title>NiceApe - Trade to Donate</title>
      </Head>
      <Page2>
        <Hero2 />
        <ActiveCampaigns2 />
        {/* <PlatformStats /> */}
      </Page2>
    </>
  );
}
