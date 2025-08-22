import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Provider from '../providers';
import Navbar from './components/Navbar';
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className='h-screen flex flex-col'>
          <Provider>
            <Navbar />
            <div className='flex-1'>{children}</div>
          </Provider>
        </div>
      </body>
    </html>
  );
}
