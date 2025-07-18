export interface SpeedingData {
  lightTime: string;
  moderateTime: string;
  heavyTime: string;
  severeTime: string;
  maxSpeedTime: string;
  manualCount: number;
  percentLight: number;
  percentModerate: number;
  percentHeavy: number;
  percentSevere: number;
  percentMax: number;
  lightCount: number;
  moderateCount: number;
  heavyCount: number;
  severeCount: number;
  maxCount: number;
  maxSpeed: number;
  maxSpeedAt: Date;
}

export interface DriverEvents {
  crash: number;
  followingDistance: number;
  following0to2s: number;
  following2to4s: number;
  lateResponse: number;
  defensiveDriving: number;
  nearCollision: number;
  harshAccel: number;
  harshBrake: number;
  harshTurn: number;
  mobileUsage: number;
  inattentiveDriving: number;
  drowsy: number;
  rollingStop: number;
  didNotYield: number;
  ranRedLight: number;
  laneDeparture: number;
  obstructedCameraAuto: number;
  obstructedCameraManual: number;
  eatingDrinking: number;
  smoking: number;
  noSeatBelt: number;
  forwardCollisionWarning: number;
}

export interface SamsaraDriverRecord {
  _id?: string;
  rank: number;
  driverName: string;
  driverTags: string;
  tagPaths: string;
  driverId: string;
  username: string;
  safetyScore: number;
  driveTime: string;
  totalDistance: number;
  totalEvents: number;
  totalBehaviors: number;
  speedingData: SpeedingData;
  events: DriverEvents;
  weekStartDate: Date;
  weekEndDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
