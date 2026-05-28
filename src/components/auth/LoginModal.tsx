import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { buildMagicLinkIssue, type MagicLinkIssue } from '@/lib/supabaseAuthMessages';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [authIssue, setAuthIssue] = useState<MagicLinkIssue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith('@menatech.cloud')) {
      toast({
        title: "Dominio no autorizado",
        description: "Usa un correo @menatech.cloud para acceder al panel.",
        variant: "destructive",
      });
      return;
    }

    const redirectUrl = `${window.location.origin}/admin`;
    setAuthIssue(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectUrl,
      },
    }).catch((signInError: unknown) => ({
      error: signInError instanceof Error ? signInError : new Error("Error de red con Supabase"),
    }));

    setIsLoading(false);

    if (error) {
      const issue = buildMagicLinkIssue(error.message, redirectUrl);
      setAuthIssue(issue);
      toast({
        title: issue.title,
        description: issue.description,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Revisa tu correo",
      description: "Te enviamos un magic link para entrar al panel admin.",
    });
    onOpenChange(false);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t('common.login')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@menatech.cloud"
              required
            />
          </div>
          {authIssue && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-800">
              <p className="font-semibold">{authIssue.title}</p>
              <p className="mt-1">{authIssue.description}</p>
              <p className="mt-2 text-xs">{authIssue.detail}</p>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '...' : t('common.enter')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
