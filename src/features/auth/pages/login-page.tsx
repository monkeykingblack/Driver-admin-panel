import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Spin } from '~/components/ui/spin';
import { cn } from '~/libs';
import { LoginSchema } from '~/schemas';

const LoginPage = (props: { provider: string }) => {
  const router = useRouter();
  const redirect = decodeURIComponent((router.query.redirect as string) || '');
  const [isLoading, setIsLoading] = useState(false);

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
    async (data: v.InferOutput<typeof LoginSchema>) => {
      setIsLoading(true);
      const res = await signIn(props.provider, {
        ...data,
        redirect: false,
      });
      setIsLoading(false);
      if (!res?.error) {
        onSuccess();
      } else {
        toast.warning('Username or Password invalid');
      }
    },
    [onSuccess, props.provider],
  );

  return (
    <div
      className={cn('flex flex-col gap-6', {
        'pointer-events-none': isLoading,
      })}
    >
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
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Username</Label>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Password</Label>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spin />}
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

export default LoginPage;
