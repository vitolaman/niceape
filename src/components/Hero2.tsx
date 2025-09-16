import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import PixelBlast from './PixelBlast';
import { ArrowRight, Heart, Globe, Coins, Users, Shield, Zap, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button2 } from './ui/button2';

const Hero2 = () => {
  const { setShowModal } = useUnifiedWalletContext();
  const { publicKey } = useWallet();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnectWallet = () => {
    setShowModal(true);
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <PixelBlast
          variant="diamond"
          pixelSize={4}
          color="#F9C80E"
          patternScale={3}
          patternDensity={0.8}
          enableRipples={true}
          rippleIntensityScale={1.2}
          rippleThickness={0.08}
          rippleSpeed={0.4}
          pixelSizeJitter={0.3}
          edgeFade={0.3}
          speed={0.3}
          transparent={true}
          className="opacity-60"
        />

        {/* Subtle overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/40"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 text-black">
        <Badge
          variant="secondary"
          className={`mb-6 backdrop-blur-sm bg-primary/10 text-foreground border-primary/20 hover:scale-105 transition-all duration-300 ${
            mounted ? 'animate-in slide-in-from-top-5 duration-700' : ''
          }`}
        >
          🚀 Now Live
        </Badge>

        <h1
          className={`text-4xl md:text-6xl lg:text-7xl mb-6 text-balance ${
            mounted ? 'animate-in slide-in-from-bottom-10 duration-1000 delay-200' : ''
          }`}
        >
          <span className="inline-block">Trade Tokens,</span>
          <br />
          <span className="inline-block p-2">
            Fund <span className="font-semibold italic">World-Changing</span>
          </span>
          <br />
          <span className="inline-block">Causes.</span>
        </h1>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center ${
            mounted ? 'animate-in slide-in-from-bottom-5 duration-1000 delay-700' : ''
          }`}
        >
          {publicKey ? (
            <Link href="/create-campaign">
              <Button2
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {publicKey ? 'Launch Your Token' : 'Connect Wallet to Launch'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button2>
            </Link>
          ) : (
            <Button2
              size="lg"
              onClick={handleConnectWallet}
              className="bg-primary hover:bg-primary/90 text-primary-foreground group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {publicKey ? 'Launch Your Token' : 'Connect Wallet to Launch'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button2>
          )}

          {/* <Button2
            variant="outline"
            size="lg"
            className="hover:scale-105 transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 group backdrop-blur-sm bg-background/20"
          >
            Explore Causes
            <Globe className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          </Button2> */}
        </div>

        <div
          className={`mt-16 flex justify-center space-x-8 ${
            mounted ? 'animate-in fade-in duration-1000 delay-1000' : ''
          }`}
        >
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Trading</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-500"></div>
            <span>Instant Donations</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
            <span>Verified Impact</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
