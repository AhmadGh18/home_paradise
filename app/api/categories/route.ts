import { NextResponse } from 'next/server';
import { db } from '@/lib/data';

export async function GET() {
  return NextResponse.json(db.categories);
}
