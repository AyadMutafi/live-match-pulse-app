import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.189e385d436445c5a9950f3b4adbc4e3',
  appName: 'live-match-pulse-app',
  webDir: 'dist',
  server: {
    url: "https://189e385d-4364-45c5-a995-0f3b4adbc4e3.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a1a",
      showSpinner: false
    }
  }
};

export default config;