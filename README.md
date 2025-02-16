This is a Driver handling dashboard show case app. Build with NextJS and Prisma.

Deploy version on [Vercel](driver-admin-panel.vercel.app/) 

Login account is `admin/admin@123` for admin user or `woker1/worker@123 and `worker2/worker@123` for operate user

## Getting Started

Create .env file in root and input following environment varible

```shell
NEXTAUTH_URL=
DATABASE_URL=
```
Generate database table

```bash
pnpm prisma db seed
```

After that you can create first record with `studio` support by prisma with `pnpm prisma studio` or running `pnpm prisma db seed` to create dumb data

Generate the prisma client

```bash
pnpm prisma generate
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
