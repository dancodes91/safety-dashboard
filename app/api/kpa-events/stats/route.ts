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

    // Calculate various statistics
    const totalIncidents = await KpaEventModel.countDocuments();
    const preventableIncidents = await KpaEventModel.countDocuments({ preventability: 'Preventable' });
    const nonPreventableIncidents = await KpaEventModel.countDocuments({ preventability: 'Non-Preventable' });

    // Get incidents by type
    const incidentsByType = await KpaEventModel.aggregate([
      {
        $group: {
          _id: '$eventCategory',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get incidents by division
    const incidentsByDivision = await KpaEventModel.aggregate([
      {
        $group: {
          _id: '$division',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get incidents by severity
    const incidentsBySeverity = await KpaEventModel.aggregate([
      {
        $group: {
          _id: '$severityRating',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent incidents (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentIncidents = await KpaEventModel.find({
      dateTime: { $gte: thirtyDaysAgo }
    }).sort({ dateTime: -1 }).limit(10);

    // Convert aggregation results to objects
    const incidentsByTypeObj = incidentsByType.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const incidentsByDivisionObj = incidentsByDivision.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const incidentsBySeverityObj = incidentsBySeverity.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalIncidents,
      preventableIncidents,
      nonPreventableIncidents,
      incidentsByType: incidentsByTypeObj,
      incidentsByDivision: incidentsByDivisionObj,
      incidentsBySeverity: incidentsBySeverityObj,
      recentIncidents,
      preventabilityRate: totalIncidents > 0 ? (preventableIncidents / totalIncidents) * 100 : 0,
      averageSeverity: incidentsBySeverity.length > 0 
        ? incidentsBySeverity.reduce((sum, item) => sum + (item._id * item.count), 0) / totalIncidents 
        : 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching incident statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident statistics' },
      { status: 500 }
    );
  }
}
