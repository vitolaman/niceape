import Page from '@/components/ui/Page/Page';
import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - NiceApe</title>
      </Head>
      <Page>
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: January 2025</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="space-y-8 text-gray-600 dark:text-gray-400">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p>
                    By accessing and using NiceApe, you accept and agree to be bound by the terms
                    and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    2. Use License
                  </h2>
                  <p>
                    Permission is granted to temporarily use NiceApe for personal, non-commercial
                    transitory viewing only. This is the grant of a license, not a transfer of
                    title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on NiceApe</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    3. Disclaimer
                  </h2>
                  <p>
                    The materials on NiceApe are provided on an 'as is' basis. NiceApe makes no
                    warranties, expressed or implied, and hereby disclaim and negate all other
                    warranties including, without limitation, implied warranties or conditions of
                    merchantability, fitness for a particular purpose, or non-infringement of
                    intellectual property or other violation of rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    4. Limitations
                  </h2>
                  <p>
                    In no event shall NiceApe or its suppliers be liable for any damages (including,
                    without limitation, damages for loss of data or profit, or due to business
                    interruption) arising out of the use or inability to use the materials on
                    NiceApe, even if NiceApe or a NiceApe authorized representative has been
                    notified orally or in writing of the possibility of such damage. Because some
                    jurisdictions do not allow limitations on implied warranties, or limitations of
                    liability for consequential or incidental damages, these limitations may not
                    apply to you.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    5. Accuracy of Materials
                  </h2>
                  <p>
                    The materials appearing on NiceApe could include technical, typographical, or
                    photographic errors. NiceApe does not warrant that any of the materials on its
                    website are accurate, complete, or current. NiceApe may make changes to the
                    materials contained on its website at any time without notice. However, NiceApe
                    does not make any commitment to update the materials.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Links
                  </h2>
                  <p>
                    NiceApe has not reviewed all of the sites linked to our website and is not
                    responsible for the contents of any such linked site. The inclusion of any link
                    does not imply endorsement by NiceApe of the site. Use of any such linked
                    website is at the user's own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    7. Modifications
                  </h2>
                  <p>
                    NiceApe may revise these terms of service for its website at any time without
                    notice. By using this website, you are agreeing to be bound by the then current
                    version of these terms of service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Governing Law
                  </h2>
                  <p>
                    These terms and conditions are governed by and construed in accordance with the
                    laws of the jurisdiction in which NiceApe operates and you irrevocably submit to
                    the exclusive jurisdiction of the courts in that state or location.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    If you have any questions about these Terms of Service, please contact us at
                    legal@niceape.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
