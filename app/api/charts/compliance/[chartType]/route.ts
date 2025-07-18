import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { chartType: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { chartType } = params;

    switch (chartType) {
      case 'trend':
        return await getComplianceTrendData();
      case 'department':
        return await getDepartmentComplianceData();
      default:
        return NextResponse.json(
          { error: `Unknown chart type: ${chartType}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching compliance chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance chart data' },
      { status: 500 }
    );
  }
}

async function getComplianceTrendData() {
  // For now, return mock data since we don't have compliance tracking models yet
  // In a real implementation, this would query compliance records from the database
  
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Overall Compliance %',
        data: [87, 88, 90, 92, 93, 94.5],
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target',
        data: [100, 100, 100, 100, 100, 100],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  return NextResponse.json(chartData);
}

async function getDepartmentComplianceData() {
  // For now, return mock data since we don't have compliance tracking models yet
  // In a real implementation, this would query compliance records by department
  
  const chartData = {
    labels: ['Operations', 'Maintenance', 'Safety', 'HR', 'Administration', 'Logistics'],
    datasets: [
      {
        label: 'Compliance %',
        data: [97, 92, 96, 98, 95, 91],
        backgroundColor: [
          'rgba(52, 211, 153, 0.7)',
          'rgba(250, 204, 21, 0.7)',
          'rgba(56, 189, 248, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(251, 113, 133, 0.7)',
        ],
        borderColor: [
          'rgb(52, 211, 153)',
          'rgb(250, 204, 21)',
          'rgb(56, 189, 248)',
          'rgb(167, 139, 250)',
          'rgb(251, 146, 60)',
          'rgb(251, 113, 133)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return NextResponse.json(chartData);
}
