import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import TrainingRecordModel from '@/models/TrainingRecord';

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
      case 'completion-trend':
        return await getTrainingCompletionTrendData();
      case 'department':
        return await getDepartmentTrainingData();
      case 'types':
        return await getTrainingTypeData();
      default:
        return NextResponse.json(
          { error: `Unknown chart type: ${chartType}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching training chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training chart data' },
      { status: 500 }
    );
  }
}

async function getTrainingCompletionTrendData() {
  // Get training records from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await TrainingRecordModel.find({
    createdAt: { $gte: sixMonthsAgo }
  });

  // Group by month and calculate completion rates
  const monthlyData = new Map();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = months[date.getMonth()];
    monthlyData.set(monthKey, { total: 0, completed: 0 });
  }

  // Count training records by month
  records.forEach(record => {
    if (record.createdAt) {
      const month = months[record.createdAt.getMonth()];
      if (monthlyData.has(month)) {
        const data = monthlyData.get(month);
        data.total++;
        if (record.status === 'Completed') {
          data.completed++;
        }
      }
    }
  });

  // Calculate completion rates
  const labels = Array.from(monthlyData.keys());
  const completionRates = Array.from(monthlyData.values()).map(data => {
    if (data.total === 0) return 0;
    return Math.round((data.completed / data.total) * 100 * 10) / 10; // Round to 1 decimal
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completion Rate %',
        data: completionRates,
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target',
        data: new Array(labels.length).fill(100),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  return NextResponse.json(chartData);
}

async function getDepartmentTrainingData() {
  // Get all training records and group by division
  const records = await TrainingRecordModel.find({});
  
  const departmentData = new Map();
  const departments = ['Operations', 'Maintenance', 'Safety', 'HR', 'Administration', 'Logistics'];
  
  // Initialize departments
  departments.forEach(dept => {
    departmentData.set(dept, { total: 0, completed: 0 });
  });

  // Count training records by department (using division field)
  records.forEach(record => {
    const dept = record.division || 'Other';
    if (departmentData.has(dept)) {
      const data = departmentData.get(dept);
      data.total++;
      if (record.status === 'Completed') {
        data.completed++;
      }
    }
  });

  // Calculate completion rates
  const labels = Array.from(departmentData.keys());
  const completionRates = Array.from(departmentData.values()).map(data => {
    if (data.total === 0) return 0;
    return Math.round((data.completed / data.total) * 100);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completion Rate %',
        data: completionRates,
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

async function getTrainingTypeData() {
  // Get all training records and group by training type
  const records = await TrainingRecordModel.find({});
  
  const typeCount = new Map();
  records.forEach(record => {
    const type = record.trainingType || 'Other';
    typeCount.set(type, (typeCount.get(type) || 0) + 1);
  });

  // If no data, return mock data
  if (typeCount.size === 0) {
    const chartData = {
      labels: ['Safety Training', 'Compliance', 'Technical Skills', 'Soft Skills', 'Leadership', 'Other'],
      datasets: [
        {
          label: 'Training Hours by Type',
          data: [42, 25, 18, 12, 8, 5],
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(234, 179, 8, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(168, 85, 247, 0.7)',
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(249, 115, 22)',
            'rgb(234, 179, 8)',
            'rgb(16, 185, 129)',
            'rgb(99, 102, 241)',
            'rgb(168, 85, 247)',
          ],
          borderWidth: 1,
        },
      ],
    };
    return NextResponse.json(chartData);
  }

  // Convert to arrays for chart
  const labels = Array.from(typeCount.keys());
  const data = Array.from(typeCount.values());
  
  const colors = [
    'rgba(239, 68, 68, 0.7)',
    'rgba(249, 115, 22, 0.7)',
    'rgba(234, 179, 8, 0.7)',
    'rgba(16, 185, 129, 0.7)',
    'rgba(99, 102, 241, 0.7)',
    'rgba(168, 85, 247, 0.7)',
  ];

  const borderColors = [
    'rgb(239, 68, 68)',
    'rgb(249, 115, 22)',
    'rgb(234, 179, 8)',
    'rgb(16, 185, 129)',
    'rgb(99, 102, 241)',
    'rgb(168, 85, 247)',
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Training Records by Type',
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  return NextResponse.json(chartData);
}
