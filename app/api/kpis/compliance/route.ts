import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpiGoalModel from '@/models/KpiGoal';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // For now, we'll return calculated compliance KPIs
    // In a real implementation, these would be calculated from compliance data
    
    const kpis = [
      {
        title: 'Overall Compliance',
        currentValue: 94.5,
        targetValue: 100,
        status: 'yellow',
        unit: '%',
        change: 2.3,
        description: 'Overall regulatory compliance score across all departments',
        tooltipText: 'Target is 100%. Current score shows improvement from last period.',
      },
      {
        title: 'Audit Readiness',
        currentValue: 92,
        targetValue: 95,
        status: 'yellow',
        unit: '%',
        change: 3,
        description: 'Preparedness for regulatory compliance audits',
        tooltipText: 'Target is 95% or above. Based on document completeness and protocol adherence.',
      },
      {
        title: 'Open Violations',
        currentValue: 2,
        targetValue: 0,
        status: 'red',
        unit: '',
        change: -3,
        description: 'Number of unresolved regulatory violations',
        tooltipText: 'Target is zero violations. Improvement from 5 violations in previous period.',
      },
      {
        title: 'Upcoming Deadlines',
        currentValue: 6,
        targetValue: 'N/A',
        status: 'neutral',
        unit: '',
        change: 0,
        description: 'Regulatory filings due in next 30 days',
        tooltipText: 'Informational metric to track upcoming compliance requirements.',
      },
    ];

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching compliance KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance KPIs' },
      { status: 500 }
    );
  }
}
