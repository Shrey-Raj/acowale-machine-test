'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Layers, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Cookies from "js-cookie";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    if (status === 'authenticated') {
      toast.info('Already signed in', {
        description: 'Redirecting to dashboard...',
      });
      router.push('/dashboard');
    }
  }, [status, router]);


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin w-6 h-6 text-cyan-400" />
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      Cookies.set("selectedRole", role);
      await signIn('google', {
        callbackUrl: `/dashboard`
      });
    } catch {
      toast.error('Sign in failed', {
        description: 'Could not authenticate with Google.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-slate-950 to-black text-white px-4 relative overflow-hidden">
      
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full bottom-0 right-0" />

      <Card className="w-full max-w-md bg-slate-950/50 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-2xl">
        <CardContent className="flex flex-col gap-6 p-8">

          {/* Branding */}
          <div className="text-center items-center space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <Layers className="h-6 w-6 text-cyan-400" />
              <span className="font-bold text-xl text-white">Acowale</span>
            </div>
            <p className="text-sm text-slate-400">
              Choose your role and continue
            </p>
          </div>

          <div className="h-px bg-slate-800" />

          <RadioGroup
            defaultValue="user"
            onValueChange={(val) => setRole(val as 'admin' | 'user')}
            className="flex gap-6 justify-center text-zinc-50"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">User</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-11 bg-slate-900 border-slate-700 hover:bg-slate-800 text-white! flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                Signing in...
              </>
            ) : (
              <>
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-slate-500">
            Secure authentication powered by Google
          </p>

        </CardContent>
      </Card>
    </div>
  );
}