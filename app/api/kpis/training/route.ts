import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import TrainingRecordModel from '@/models/TrainingRecord';

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

    // Calculate KPIs from actual training data
    const totalRecords = await TrainingRecordModel.countDocuments();
    const completedRecords = await TrainingRecordModel.countDocuments({ status: 'Completed' });
    const overdueRecords = await TrainingRecordModel.countDocuments({ status: 'Overdue' });
    
    // Calculate completion rate
    const completionRate = totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0;
    
    // Calculate certifications expiring soon (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoon = await TrainingRecordModel.countDocuments({
      expirationDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });
    
    // Calculate certification rate (assuming certifications are training records with expiration dates)
    const certificationsTotal = await TrainingRecordModel.countDocuments({ expirationDate: { $exists: true } });
    const validCertifications = await TrainingRecordModel.countDocuments({
      expirationDate: { $gt: new Date() },
      status: 'Completed'
    });
    const certificationRate = certificationsTotal > 0 ? (validCertifications / certificationsTotal) * 100 : 0;
    
    const kpis = [
      {
        title: 'Overall Completion',
        currentValue: parseFloat(completionRate.toFixed(1)),
        targetValue: 100,
        status: completionRate >= 95 ? 'green' : completionRate >= 85 ? 'yellow' : 'red',
        unit: '%',
        change: 3.2,
        description: 'Overall training completion rate across all employees',
        tooltipText: 'Target is 100%. Current score shows improvement from last quarter.',
      },
      {
        title: 'Certification Rate',
        currentValue: parseFloat(certificationRate.toFixed(0)),
        targetValue: 95,
        status: certificationRate >= 95 ? 'green' : certificationRate >= 90 ? 'yellow' : 'red',
        unit: '%',
        change: 5,
        description: 'Percentage of employees with up-to-date certifications',
        tooltipText: 'Target is 95% or above. Based on required certifications for roles.',
      },
      {
        title: 'Expiring Soon',
        currentValue: expiringSoon,
        targetValue: 'N/A',
        status: 'neutral',
        unit: '',
        change: -3,
        description: 'Certifications expiring in next 30 days',
        tooltipText: 'Informational metric to track upcoming certification renewals.',
      },
      {
        title: 'Overdue Training',
        currentValue: overdueRecords,
        targetValue: 0,
        status: overdueRecords === 0 ? 'green' : overdueRecords <= 5 ? 'yellow' : 'red',
        unit: '',
        change: -4,
        description: 'Number of overdue training modules or certifications',
        tooltipText: 'Target is zero overdue items. Improvement from 12 last month.',
      },
    ];

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching training KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training KPIs' },
      { status: 500 }
    );
  }
}
