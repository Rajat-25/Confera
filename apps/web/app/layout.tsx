import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Provider from '../providers';
import Navbar from '../components/general/Navbar';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Confera',
  description: 'Real-Time video/chat application',
  icons: {
    icon: [{ url: '/favicon.png', sizes: '32x32', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary-bg`}
      >
        <div className='h-screen flex flex-col gap-y-2'>
          <Provider>
            <Navbar />
            <div className='flex-1 overflow-y-auto'>{children}</div>
          </Provider>
        </div>
      </body>
    </html>
  );
}
