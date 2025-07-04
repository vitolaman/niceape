import Page from '@/components/ui/Page/Page';
import Hero from '@/components/Hero';
import ActiveCampaigns from '@/components/ActiveCampaigns';
import LaunchCampaign from '@/components/LaunchCampaign';
import PlatformStats from '@/components/PlatformStats';

export default function Index() {
  return (
    <Page>
      <Hero />
      <LaunchCampaign />
      <ActiveCampaigns />
      <PlatformStats />
    </Page>
  );
}
