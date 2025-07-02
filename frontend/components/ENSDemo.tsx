'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ENSAddressInput } from '@/components/ENSAddressInput';
import { RecipientDisplay } from '@/components/RecipientDisplay';
import { WalletDisplay } from '@/components/WalletDisplay';
import { Button } from '@/components/ui/Button';
import { Users, Globe, Wallet } from 'lucide-react';

export function ENSDemo() {
  const [testAddress, setTestAddress] = useState('');
  const [testRecipients, setTestRecipients] = useState<string[]>([]);

  const addTestRecipient = () => {
    if (testAddress && !testRecipients.includes(testAddress)) {
      setTestRecipients([...testRecipients, testAddress]);
      setTestAddress('');
    }
  };

  const removeRecipient = (index: number) => {
    setTestRecipients(testRecipients.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            Connected Wallet Display
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WalletDisplay showAvatar={true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-500" />
            ENS Address Input Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ENSAddressInput
            label="Test Address or ENS Name"
            value={testAddress}
            onChange={setTestAddress}
            placeholder="Try: vitalik.eth or 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
            helperText="Enter an ENS name or Ethereum address to see resolution"
          />
          
          <div className="flex gap-2">
            <Button onClick={addTestRecipient} disabled={!testAddress}>
              Add to Recipients
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestAddress('vitalik.eth')}
            >
              Try vitalik.eth
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTestAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
            >
              Try Address
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Recipients Display Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testRecipients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Add some addresses or ENS names above to see them displayed here
            </p>
          ) : (
            <div className="space-y-2">
              {testRecipients.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <RecipientDisplay address={recipient} showAvatar={true} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRecipient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ENS Features Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ <strong>ENS Name Resolution:</strong> Convert ENS names to addresses</p>
            <p>✅ <strong>ENS Avatar Display:</strong> Show profile pictures when available</p>
            <p>✅ <strong>Address Validation:</strong> Real-time validation of addresses and ENS names</p>
            <p>✅ <strong>Batch Resolution:</strong> Resolve multiple ENS names for airdrops</p>
            <p>✅ <strong>Fallback Display:</strong> Show addresses when ENS names aren't available</p>
            <p>✅ <strong>Loading States:</strong> Visual feedback during resolution</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 