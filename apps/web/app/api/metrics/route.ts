import { register } from '@/monitoring/metrics';
import { NextResponse } from 'next/server';

export async function GET() {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: { 'Content-Type': register.contentType },
  });
}
