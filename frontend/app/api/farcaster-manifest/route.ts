import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "0x0000000000000000000000000000000000000000000000000000000000000000",
      payload: "0x0000000000000000000000000000000000000000000000000000000000000000",
      signature: "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    frame: {
      version: "1",
      name: "Airdrop Manager",
      iconUrl: "https://your-domain.vercel.app/icon.png",
      homeUrl: "https://your-domain.vercel.app",
      description: "Manage token airdrops on Base mainnet with ease",
      action: {
        type: "post",
        label: "Execute Airdrop"
      },
      input: {
        text: "Enter token address"
      },
      buttons: [
        {
          label: "Upload CSV",
          action: "post"
        },
        {
          label: "View Contract",
          action: "post_redirect"
        }
      ],
      postUrl: "https://your-domain.vercel.app/api/frame",
      state: {
        chainId: "eip155:8453"
      }
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 