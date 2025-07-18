import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import SamsaraDriverRecordModel from '@/models/SamsaraDriverRecord';

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

    // Get all driver records
    const allRecords = await SamsaraDriverRecordModel.find({});
    
    // Calculate total unique drivers
    const uniqueDrivers = await SamsaraDriverRecordModel.distinct('driverId');
    const totalDrivers = uniqueDrivers.length;

    // Calculate average safety score
    const averageSafetyScore = allRecords.length > 0 
      ? Math.round(allRecords.reduce((sum, record) => sum + record.safetyScore, 0) / allRecords.length)
      : 0;

    // Get top performers (highest safety scores)
    const topPerformers = await SamsaraDriverRecordModel.aggregate([
      {
        $group: {
          _id: '$driverId',
          driverName: { $first: '$driverName' },
          avgSafetyScore: { $avg: '$safetyScore' },
          totalDistance: { $sum: '$totalDistance' },
          totalEvents: { $sum: '$totalEvents' }
        }
      },
      {
        $sort: { avgSafetyScore: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Calculate total events across all drivers
    const totalEvents = allRecords.reduce((sum, record) => sum + record.totalEvents, 0);

    // Calculate total speeding events
    const totalSpeedingEvents = allRecords.reduce((sum, record) => {
      return sum + (record.speedingData?.lightCount || 0) + 
             (record.speedingData?.moderateCount || 0) + 
             (record.speedingData?.heavyCount || 0) + 
             (record.speedingData?.severeCount || 0);
    }, 0);

    // Calculate total harsh events
    const totalHarshEvents = allRecords.reduce((sum, record) => {
      return sum + (record.events?.harshAccel || 0) + 
             (record.events?.harshBrake || 0) + 
             (record.events?.harshTurn || 0);
    }, 0);

    // Calculate total distracted driving events
    const totalDistractedEvents = allRecords.reduce((sum, record) => {
      return sum + (record.events?.mobileUsage || 0) + 
             (record.events?.inattentiveDriving || 0) + 
             (record.events?.eatingDrinking || 0);
    }, 0);

    // Calculate total distance driven
    const totalDistance = allRecords.reduce((sum, record) => sum + record.totalDistance, 0);

    // Get safety score distribution
    const safetyScoreDistribution = allRecords.reduce((acc, record) => {
      const score = record.safetyScore;
      if (score >= 95) acc.excellent++;
      else if (score >= 85) acc.good++;
      else if (score >= 75) acc.fair++;
      else acc.poor++;
      return acc;
    }, { excellent: 0, good: 0, fair: 0, poor: 0 });

    // Get drivers by division
    const driversByDivision = await SamsaraDriverRecordModel.aggregate([
      {
        $group: {
          _id: '$driverTags',
          count: { $sum: 1 },
          avgSafetyScore: { $avg: '$safetyScore' }
        }
      }
    ]);

    const stats = {
      totalDrivers,
      averageSafetyScore,
      topPerformers: topPerformers.map(driver => ({
        driverId: driver._id,
        driverName: driver.driverName,
        safetyScore: Math.round(driver.avgSafetyScore),
        totalDistance: driver.totalDistance,
        totalEvents: driver.totalEvents
      })),
      totalEvents,
      totalSpeedingEvents,
      totalHarshEvents,
      totalDistractedEvents,
      totalDistance: Math.round(totalDistance),
      safetyScoreDistribution,
      driversByDivision: driversByDivision.reduce((acc, item) => {
        acc[item._id || 'Unknown'] = {
          count: item.count,
          avgSafetyScore: Math.round(item.avgSafetyScore)
        };
        return acc;
      }, {} as Record<string, { count: number; avgSafetyScore: number }>),
      eventsPerDriver: totalDrivers > 0 ? Math.round(totalEvents / totalDrivers) : 0,
      milesPerDriver: totalDrivers > 0 ? Math.round(totalDistance / totalDrivers) : 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching driver statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver statistics' },
      { status: 500 }
    );
  }
}
