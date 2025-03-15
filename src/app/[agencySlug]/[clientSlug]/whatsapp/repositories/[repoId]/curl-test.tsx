"use client"

import CodeBlock from '@/components/code-block';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import useCopyToClipboard from '@/lib/useCopyToClipboard';
import { Copy } from 'lucide-react';
import React, { useState } from 'react';

type Props= {
    endpoint: string
}

export default function CurlTest({ endpoint }: Props) {
    const [phone, setPhone] = useState('59895923142')

    const [value, copy] = useCopyToClipboard()

    const curlCommand = `curl -X POST ${endpoint} \\
-H "Authorization: Bearer t9EyqpztGjWNQnfOE8XRINAZe41pnuHJ" \\
-H "Content-Type: application/json" \\
-d '{
  "message": {
    "phone": "${phone}"
  }
}'`;

    const copyToClipboard = () => {
        copy(curlCommand)
        toast({title: "Curl copiado!"})
    }

  return (
    <div className="p-4">
        <div className="flex items-center gap-2 mb-5">
            <Label>Phone:</Label>
            <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="59899123456" />
        </div>
        <div className="w-fit">
            <CodeBlock code={curlCommand} showLineNumbers={false} />
        </div>
        
        <Button onClick={copyToClipboard} className='w-full gap-2'>
            <Copy />
            <p>Copy Curl Command</p>
        </Button>
    </div>
  );
};

type DeleteProps= {
    endpoint: string
}

export function CurlTestDialog({ endpoint }: DeleteProps) {

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="link" className='px-1'>Curl</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
            <DialogTitle>Curl Test</DialogTitle>
            </DialogHeader>
            <CurlTest endpoint={endpoint} />
        </DialogContent>
        </Dialog>
    )
}
  