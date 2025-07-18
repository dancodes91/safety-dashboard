import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import KpaEventModel from '@/models/KpaEvent';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Calculate KPIs from actual data
    const totalIncidents = await KpaEventModel.countDocuments();
    const preventableIncidents = await KpaEventModel.countDocuments({ preventability: 'Preventable' });
    const nearMisses = await KpaEventModel.countDocuments({ eventCategory: 'Near Miss' });
    
    // Calculate incident rate (incidents per 100 employees - assuming 100 employees for demo)
    const incidentRate = (totalIncidents / 100) * 100;
    
    // Calculate average closure time (mock calculation)
    const avgClosureTime = 12.5; // This would be calculated from actual closure dates
    
    const kpis = [
      {
        title: 'Total Incidents',
        currentValue: totalIncidents,
        targetValue: 0,
        status: totalIncidents === 0 ? 'green' : totalIncidents <= 5 ? 'yellow' : 'red',
        unit: '',
        change: -3, // This would be calculated from previous period
        description: 'Total number of reported incidents in current period',
        tooltipText: 'Target is zero incidents. Any incident requires attention.',
      },
      {
        title: 'Incident Rate',
        currentValue: parseFloat(incidentRate.toFixed(1)),
        targetValue: 2.0,
        status: incidentRate <= 2.0 ? 'green' : incidentRate <= 3.0 ? 'yellow' : 'red',
        unit: '%',
        change: -0.3,
        description: 'Number of recordable incidents per 100 full-time employees',
        tooltipText: 'Target is below 2.0%. Current status requires attention.',
      },
      {
        title: 'Near Misses',
        currentValue: nearMisses,
        targetValue: 'N/A',
        status: 'neutral',
        unit: '',
        change: 5,
        description: 'Near miss reports (potential incidents that did not occur)',
        tooltipText: 'No specific target, but tracked for prevention insights.',
      },
      {
        title: 'Avg. Closure Time',
        currentValue: avgClosureTime,
        targetValue: 10,
        status: avgClosureTime <= 10 ? 'green' : avgClosureTime <= 15 ? 'yellow' : 'red',
        unit: ' days',
        change: -2.3,
        description: 'Average time to close incident investigations',
        tooltipText: 'Target is 10 days or less. Improving from previous period.',
      },
    ];

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching incident KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident KPIs' },
      { status: 500 }
    );
  }
}
