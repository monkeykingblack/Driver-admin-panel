import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from '~/libs';

import React, { ReactElement, useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { AuthLayout } from '~/layout';
import { ensureLogin } from '~/libs';
import { cn } from '~/libs/utils';
import { LoginSchema } from '~/schemas';

type Props = {
  /** Defined props */
  provider: string;
};

const LoginPage: NextPageWithLayout<Props> = (props: Props) => {
  const router = useRouter();
  const redirect = decodeURIComponent((router.query.redirect as string) || '');
  const [loading, startTransition] = useTransition();

  const form = useForm<v.InferOutput<typeof LoginSchema>>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSuccess = useCallback(() => {
    if (redirect && redirect.startsWith('/')) {
      router.push(redirect);
    } else {
      router.push({
        pathname: '/',
        query: router.query,
      });
    }
  }, [redirect, router]);

  const handleSubmit = useCallback(
    (data: v.InferOutput<typeof LoginSchema>) => {
      startTransition(async () => {
        const res = await signIn(props.provider, {
          ...data,
          redirect: false,
        });

        if (res?.ok) {
          return onSuccess();
        }
        if (res?.status === 401) {
          toast.warning('Username or Password invalid');
        }
      });
    },
    [onSuccess, props.provider],
  );

  return (
    <div className={cn('flex flex-col gap-6')} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    disabled={loading}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Username</Label>
                        <Input placeholder="Username" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    disabled={loading}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Password</Label>
                        <Input type="password" placeholder="********" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement, pageProps: Props) {
  return <AuthLayout {...pageProps}>{page}</AuthLayout>;
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps<Props> = ensureLogin(async () => {
  const providers = await getProviders();

  return {
    props: { provider: providers?.credentials.id || '' },
  };
}, true);
