# NiceApe - Trade to Donate Platform

🦍💚 **Trade tokens, fund causes!**

NiceApe is a revolutionary blockchain platform that combines cryptocurrency trading with charitable giving. Every trade generates fees that go directly to verified charitable causes, making every transaction a force for good.

## ✨ Features

### 🎯 Core Features

- **Charity-focused Trading**: Trade tokens while automatically donating to causes
- **Campaign Creation**: Launch custom tokens for charitable campaigns
- **Transparent Donations**: All transactions recorded on blockchain
- **Real-time Stats**: Track donations, trades, and campaign progress
- **Mobile Responsive**: Works seamlessly on all devices

### 📱 Pages & Components

- **Homepage**: Hero section, active campaigns, launch section, platform stats
- **Campaign Pages**: Detailed campaign info with trading interface
- **Create Campaign**: Form to launch new charitable campaigns
- **About/Help/Terms**: Support and information pages

### 🛠 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana integration with wallet adapters
- **State Management**: Jotai for state management
- **UI Components**: Custom components with Radix UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nice-ape
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for production

```bash
pnpm build
pnpm start
```

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Base UI components
│   ├── Hero.tsx         # Homepage hero section
│   ├── ActiveCampaigns.tsx  # Campaign grid display
│   ├── CampaignCard.tsx     # Individual campaign cards
│   ├── LaunchCampaign.tsx   # Campaign creation CTA
│   ├── TradingInterface.tsx # Token trading component
│   ├── CreateCampaignForm.tsx # Campaign creation form
│   ├── PlatformStats.tsx    # Platform statistics
│   ├── Header.tsx       # Navigation header
│   └── Footer.tsx       # Site footer
├── pages/               # Next.js pages
│   ├── index.tsx        # Homepage
│   ├── about.tsx        # About page
│   ├── help.tsx         # Help/FAQ page
│   ├── terms.tsx        # Terms of service
│   ├── create-campaign.tsx  # Campaign creation page
│   └── campaign/[id].tsx    # Individual campaign pages
├── styles/              # Global styles
├── lib/                 # Utility functions
└── types/               # TypeScript type definitions
```

## 🎨 Design Features

### Color Scheme

- **Primary Green**: #16a34a (charitable/positive theme)
- **Background**: #f9fafb (light gray for cleanliness)
- **Text**: #111827 (dark gray for readability)
- **Accents**: Various colors for different campaign categories

### UI/UX Highlights

- Clean, modern design with rounded corners and shadows
- Charity-focused branding with ape emoji and green theme
- Responsive grid layouts for campaigns
- Progressive disclosure with detailed campaign pages
- Intuitive trading interface with buy/sell toggles
- Mobile-first responsive design

## 🔗 Key Integrations

### Solana Wallet Integration

- Multi-wallet support (Phantom, Solflare, Backpack)
- Unified wallet adapter for consistent UX
- Wallet connection state management

### Blockchain Features

- Token creation for campaigns
- Trading with automatic fee donation
- Transparent transaction history
- Real-time price and volume tracking

## 🎯 Sample Campaigns

The platform includes sample charitable campaigns:

1. **Clean Water Drive** ($WTR) - Providing clean water access
2. **Feed the Hungry** ($FD) - Fighting hunger globally
3. **Education for All** ($EDU) - Supporting education initiatives
4. **Plant Trees Initiative** ($TRI) - Environmental conservation

## 🛡 Future Enhancements

- Integration with real smart contracts
- Advanced trading features (limit orders, etc.)
- Campaign verification system
- Social features and community building
- Analytics dashboard for campaign creators
- Multi-chain support
- Real charity partnership integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original template from dynamic bonding curve project
- Solana ecosystem for blockchain infrastructure
- Open source community for tools and libraries
- Charitable organizations inspiring the mission

---

**Trade nice, ape big! 🦍💚**

For support or questions, contact us at support@niceape.com
