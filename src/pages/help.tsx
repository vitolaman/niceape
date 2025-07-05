import Page from '@/components/ui/Page/Page';

export default function Help() {
  return (
    <Page>
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <p className="text-xl text-gray-600">Get help with using NiceApe</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How do I create a campaign?
                    </h3>
                    <p className="text-gray-600">
                      Connect your wallet and click "Launch Campaign" to create a token for your
                      cause. You'll need to provide campaign details, set a fundraising goal, and
                      submit it for review.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How are donations distributed?
                    </h3>
                    <p className="text-gray-600">
                      A percentage of each trade goes directly to the campaign's designated charity
                      wallet. All transactions are recorded on the blockchain for full transparency.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What wallets are supported?
                    </h3>
                    <p className="text-gray-600">
                      We support all major Solana wallets including Phantom, Solflare, and Backpack.
                      Make sure you have SOL for transaction fees.
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How do I verify a campaign is legitimate?
                    </h3>
                    <p className="text-gray-600">
                      All campaigns go through a verification process. Look for the verified badge
                      and check the campaign's social media and documentation links.
                    </p>
                  </div>

                  <div className="pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What are the trading fees?
                    </h3>
                    <p className="text-gray-600">
                      Trading fees vary by campaign but typically range from 1-5% of the trade
                      value. These fees go directly to the charitable cause.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Help?</h2>
                <p className="text-gray-600 mb-4">
                  Can't find what you're looking for? Reach out to our support team:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>📧 Email: support@niceape.com</p>
                  <p>💬 Discord: discord.gg/niceape</p>
                  <p>🐦 Twitter: @NiceApeDeFi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
