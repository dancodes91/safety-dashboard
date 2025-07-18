import { KpaEvent } from '@/types/KpaEvent';
import { SamsaraDriverRecord } from '@/types/SamsaraDriverRecord';
import { TrainingRecord } from '@/types/TrainingRecord';
import { KpiGoal } from '@/types/KpiGoal';

// Mock data for development and testing
const mockKpaEvents: KpaEvent[] = [
  {
    _id: '1',
    reportNumber: '60480769',
    link: '60480769',
    observer: 'Regina Ramos',
    employeeId: 'EMP-001',
    employeeName: 'Jorge Gutierrez',
    division: 'Ready Mix',
    homePlant: 'Bakersfield 2',
    hireDate: new Date('2020-10-02'),
    hireDuration: '4 years, 8 months, 13 days',
    supervisor: 'Jesus Muneton',
    eventType: 'Incident- Property damage, report only/first aid injury, collision, or similar involving only Holliday Company assets or employees.',
    unitNumber: '814',
    equipmentType: '',
    jobNumber: '',
    dateTime: new Date('2025-06-11T09:45:00'),
    location: 'Highway/ Street',
    plant: '',
    videoLink: '',
    description: 'Jorge was driving on highway when a rock hit his windshield. He pulled over and called the hotline to report. He will continue to job and offload. Jesus is aware as truck may need new windshield.',
    injuries: false,
    preventability: 'Non-Preventable',
    eventCategory: 'Other',
    severityRating: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    reportNumber: '60479303',
    link: '60479303',
    observer: 'Regina Ramos',
    employeeId: 'EMP-002',
    employeeName: 'Gerardo Vazquez',
    division: 'Ready Mix',
    homePlant: 'Goleta',
    hireDate: new Date('2024-04-09'),
    hireDuration: '1 years, 2 months, 3 days',
    supervisor: 'Michael Donovan',
    eventType: 'Accident- (A) Property damage, injury, traffic collision, or similar that involves a 3rd Party not affiliated with any Holliday Companies; or (B) An injury involving a Holliday Rock employee that requires medical attention beyond first aid or could result in modified duties/lost time.',
    unitNumber: '602',
    equipmentType: 'Mixer',
    jobNumber: '77',
    dateTime: new Date('2025-06-11T09:45:00'),
    location: 'Highway/ Street',
    plant: '',
    videoLink: '',
    description: 'Gerado was driving up a steep hill quarter mile from job#77 and spilled some concrete. Isaac was at site and cleaned up spill. Driver continued to site and offloaded.',
    injuries: false,
    preventability: 'Preventable',
    eventCategory: 'Spill',
    severityRating: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '3',
    reportNumber: '60431385',
    link: '60431385',
    observer: 'Regina Ramos',
    employeeId: 'EMP-003',
    employeeName: 'Jose Jimenez Jr.',
    division: 'Ready Mix',
    homePlant: 'Sun Valley 1',
    hireDate: new Date('2024-09-23'),
    hireDuration: '0 years, 8 months, 20 days',
    supervisor: 'Michael Vasquez',
    eventType: 'Incident- Property damage, report only/first aid injury, collision, or similar involving only Holliday Company assets or employees.',
    unitNumber: '719',
    equipmentType: 'Mixer',
    jobNumber: '22',
    dateTime: new Date('2025-06-10T12:00:00'),
    location: 'Highway/ Street',
    plant: '',
    videoLink: '',
    description: 'REPORT ONLY small spill possibly caused by a Holliday truck. One of our drivers noticed a small spill on intersection of Olive and 17th near job# 22 in LA.',
    injuries: false,
    preventability: 'Preventable',
    eventCategory: 'Spill',
    severityRating: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSamsaraRecords: SamsaraDriverRecord[] = [
  {
    _id: '1',
    rank: 1,
    driverName: 'Shane Hoiland',
    driverTags: 'Ready Mix, San Fernando Valley : Canoga Park',
    tagPaths: 'Ready Mix;Driver Location: / San Fernando Valley : Canoga Park',
    driverId: '51552731',
    username: '3754',
    safetyScore: 100,
    driveTime: '299:29:02',
    totalDistance: 7814.0,
    totalEvents: 0,
    totalBehaviors: 0,
    speedingData: {
      lightTime: '00:19:19',
      moderateTime: '00:07:46',
      heavyTime: '00:01:30',
      severeTime: '00:01:13',
      maxSpeedTime: '00:00:00',
      manualCount: 0,
      percentLight: 0.11,
      percentModerate: 0.04,
      percentHeavy: 0.01,
      percentSevere: 0.01,
      percentMax: 0.00,
      lightCount: 0,
      moderateCount: 0,
      heavyCount: 0,
      severeCount: 0,
      maxCount: 0,
      maxSpeed: 60.90,
      maxSpeedAt: new Date('2025-01-06T10:38:00'),
    },
    events: {
      crash: 0,
      followingDistance: 0,
      following0to2s: 0,
      following2to4s: 0,
      lateResponse: 0,
      defensiveDriving: 0,
      nearCollision: 0,
      harshAccel: 0,
      harshBrake: 0,
      harshTurn: 0,
      mobileUsage: 0,
      inattentiveDriving: 0,
      drowsy: 0,
      rollingStop: 0,
      didNotYield: 0,
      ranRedLight: 0,
      laneDeparture: 0,
      obstructedCameraAuto: 0,
      obstructedCameraManual: 0,
      eatingDrinking: 0,
      smoking: 0,
      noSeatBelt: 0,
      forwardCollisionWarning: 0,
    },
    weekStartDate: new Date('2025-01-01'),
    weekEndDate: new Date('2025-01-07'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: '2',
    rank: 2,
    driverName: 'Gerardo Rivera',
    driverTags: 'Ready Mix, Central Valley : Bakersfield 1',
    tagPaths: 'Ready Mix;Driver Location: / Central Valley : Bakersfield 1',
    driverId: '24304336',
    username: '3286',
    safetyScore: 100,
    driveTime: '206:46:34',
    totalDistance: 6222.1,
    totalEvents: 0,
    totalBehaviors: 0,
    speedingData: {
      lightTime: '00:20:29',
      moderateTime: '00:06:04',
      heavyTime: '00:00:20',
      severeTime: '00:00:00',
      maxSpeedTime: '00:00:00',
      manualCount: 0,
      percentLight: 0.17,
      percentModerate: 0.05,
      percentHeavy: 0.00,
      percentSevere: 0.00,
      percentMax: 0.00,
      lightCount: 0,
      moderateCount: 0,
      heavyCount: 0,
      severeCount: 0,
      maxCount: 0,
      maxSpeed: 60.90,
      maxSpeedAt: new Date('2025-03-24T08:18:00'),
    },
    events: {
      crash: 0,
      followingDistance: 0,
      following0to2s: 0,
      following2to4s: 0,
      lateResponse: 0,
      defensiveDriving: 0,
      nearCollision: 0,
      harshAccel: 0,
      harshBrake: 0,
      harshTurn: 0,
      mobileUsage: 0,
      inattentiveDriving: 0,
      drowsy: 0,
      rollingStop: 0,
      didNotYield: 0,
      ranRedLight: 0,
      laneDeparture: 0,
      obstructedCameraAuto: 0,
      obstructedCameraManual: 0,
      eatingDrinking: 0,
      smoking: 0,
      noSeatBelt: 0,
      forwardCollisionWarning: 0,
    },
    weekStartDate: new Date('2025-01-01'),
    weekEndDate: new Date('2025-01-07'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Data service functions
export class DataService {
  private static useMockData(): boolean {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('useMockData');
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  }

  // KPA Events
  static async getKpaEvents(filters?: {
    division?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    preventability?: string;
    limit?: number;
    page?: number;
  }): Promise<{ events: KpaEvent[]; pagination?: any }> {
    if (this.useMockData()) {
      // Return filtered mock data
      let filteredEvents = [...mockKpaEvents];
      
      if (filters?.division) {
        filteredEvents = filteredEvents.filter(e => e.division === filters.division);
      }
      if (filters?.eventType) {
        filteredEvents = filteredEvents.filter(e => e.eventType.includes(filters.eventType!));
      }
      if (filters?.preventability) {
        filteredEvents = filteredEvents.filter(e => e.preventability === filters.preventability);
      }
      
      return { events: filteredEvents };
    }

    // Real API call
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/kpa-events?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch KPA events');
    }
    return response.json();
  }

  static async getKpaEvent(id: string): Promise<KpaEvent> {
    if (this.useMockData()) {
      const event = mockKpaEvents.find(e => e._id === id);
      if (!event) throw new Error('Event not found');
      return event;
    }

    const response = await fetch(`/api/kpa-events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch KPA event');
    }
    return response.json();
  }

  // Samsara Driver Records
  static async getSamsaraRecords(filters?: {
    driverName?: string;
    division?: string;
    limit?: number;
    page?: number;
  }): Promise<{ records: SamsaraDriverRecord[]; pagination?: any }> {
    if (this.useMockData()) {
      let filteredRecords = [...mockSamsaraRecords];
      
      if (filters?.driverName) {
        filteredRecords = filteredRecords.filter(r => 
          r.driverName.toLowerCase().includes(filters.driverName!.toLowerCase())
        );
      }
      
      return { records: filteredRecords };
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/driver-records?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver records');
    }
    return response.json();
  }

  static async getSamsaraRecord(id: string): Promise<SamsaraDriverRecord> {
    if (this.useMockData()) {
      const record = mockSamsaraRecords.find(r => r._id === id);
      if (!record) throw new Error('Driver record not found');
      return record;
    }

    const response = await fetch(`/api/driver-records/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver record');
    }
    return response.json();
  }

  // Training Records
  static async getTrainingRecords(filters?: {
    employeeId?: string;
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<{ records: TrainingRecord[]; pagination?: any }> {
    if (this.useMockData()) {
      // Return mock training data
      return { records: [] };
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/training-records?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch training records');
    }
    return response.json();
  }

  // KPI Goals
  static async getKpiGoals(): Promise<KpiGoal[]> {
    if (this.useMockData()) {
      // Return mock KPI goals
      return [];
    }

    const response = await fetch('/api/kpi-goals');
    if (!response.ok) {
      throw new Error('Failed to fetch KPI goals');
    }
    const data = await response.json();
    return data.goals || [];
  }

  // Statistics and Analytics
  static async getIncidentStats(): Promise<any> {
    if (this.useMockData()) {
      return {
        totalIncidents: mockKpaEvents.length,
        preventableIncidents: mockKpaEvents.filter(e => e.preventability === 'Preventable').length,
        nonPreventableIncidents: mockKpaEvents.filter(e => e.preventability === 'Non-Preventable').length,
        incidentsByType: mockKpaEvents.reduce((acc, event) => {
          acc[event.eventCategory] = (acc[event.eventCategory] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        incidentsByDivision: mockKpaEvents.reduce((acc, event) => {
          acc[event.division] = (acc[event.division] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    }

    const response = await fetch('/api/kpa-events/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch incident statistics');
    }
    return response.json();
  }

  static async getDriverStats(): Promise<any> {
    if (this.useMockData()) {
      return {
        totalDrivers: mockSamsaraRecords.length,
        averageSafetyScore: mockSamsaraRecords.reduce((sum, r) => sum + r.safetyScore, 0) / mockSamsaraRecords.length,
        topPerformers: mockSamsaraRecords.slice(0, 5),
        totalEvents: mockSamsaraRecords.reduce((sum, r) => sum + r.totalEvents, 0),
      };
    }

    const response = await fetch('/api/driver-records/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch driver statistics');
    }
    return response.json();
  }

  // KPI Data Methods
  static async getIncidentKpis(): Promise<any[]> {
    if (this.useMockData()) {
      const { mockIncidentKpis } = await import('@/lib/mockData');
      return mockIncidentKpis;
    }

    const response = await fetch('/api/kpis/incidents');
    if (!response.ok) {
      throw new Error('Failed to fetch incident KPIs');
    }
    return response.json();
  }

  static async getDriverKpis(): Promise<any[]> {
    if (this.useMockData()) {
      const { mockDriverKpis } = await import('@/lib/mockData');
      return mockDriverKpis;
    }

    const response = await fetch('/api/kpis/drivers');
    if (!response.ok) {
      throw new Error('Failed to fetch driver KPIs');
    }
    return response.json();
  }

  static async getComplianceKpis(): Promise<any[]> {
    if (this.useMockData()) {
      const { mockComplianceKpis } = await import('@/lib/mockData');
      return mockComplianceKpis;
    }

    const response = await fetch('/api/kpis/compliance');
    if (!response.ok) {
      throw new Error('Failed to fetch compliance KPIs');
    }
    return response.json();
  }

  static async getTrainingKpis(): Promise<any[]> {
    if (this.useMockData()) {
      const { mockTrainingKpis } = await import('@/lib/mockData');
      return mockTrainingKpis;
    }

    const response = await fetch('/api/kpis/training');
    if (!response.ok) {
      throw new Error('Failed to fetch training KPIs');
    }
    return response.json();
  }

  // Chart Data Methods
  static async getIncidentChartData(chartType: string): Promise<any> {
    if (this.useMockData()) {
      const mockData = await import('@/lib/mockData');
      switch (chartType) {
        case 'trend':
          return mockData.mockIncidentTrendData;
        case 'types':
          return mockData.mockIncidentTypeData;
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }
    }

    const response = await fetch(`/api/charts/incidents/${chartType}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch incident chart data for ${chartType}`);
    }
    return response.json();
  }

  static async getDriverChartData(chartType: string): Promise<any> {
    if (this.useMockData()) {
      const mockData = await import('@/lib/mockData');
      switch (chartType) {
        case 'safety-trend':
          return mockData.mockSafetyScoreTrendData;
        case 'driving-events':
          return mockData.mockDrivingEventsData;
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }
    }

    const response = await fetch(`/api/charts/drivers/${chartType}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch driver chart data for ${chartType}`);
    }
    return response.json();
  }

  static async getComplianceChartData(chartType: string): Promise<any> {
    if (this.useMockData()) {
      const mockData = await import('@/lib/mockData');
      switch (chartType) {
        case 'trend':
          return mockData.mockComplianceTrendData;
        case 'department':
          return mockData.mockDepartmentComplianceData;
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }
    }

    const response = await fetch(`/api/charts/compliance/${chartType}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch compliance chart data for ${chartType}`);
    }
    return response.json();
  }

  static async getTrainingChartData(chartType: string): Promise<any> {
    if (this.useMockData()) {
      const mockData = await import('@/lib/mockData');
      switch (chartType) {
        case 'completion-trend':
          return mockData.mockTrainingCompletionTrendData;
        case 'department':
          return mockData.mockDepartmentTrainingData;
        case 'types':
          return mockData.mockTrainingTypeData;
        default:
          throw new Error(`Unknown chart type: ${chartType}`);
      }
    }

    const response = await fetch(`/api/charts/training/${chartType}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch training chart data for ${chartType}`);
    }
    return response.json();
  }

  // Compliance Regulations
  static async getRegulations(filters?: any): Promise<any[]> {
    if (this.useMockData()) {
      const { mockRegulations } = await import('@/lib/mockData');
      return mockRegulations;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/regulations?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch regulations');
    }
    return response.json();
  }

  // KPI Goals Management
  static async getKpiGoalsData(): Promise<any[]> {
    if (this.useMockData()) {
      const { mockKpiGoals } = await import('@/lib/mockData');
      return mockKpiGoals;
    }

    const response = await fetch('/api/kpi-goals');
    if (!response.ok) {
      throw new Error('Failed to fetch KPI goals');
    }
    const data = await response.json();
    return data.goals || [];
  }

  // Users Management
  static async getUsers(filters?: any): Promise<any[]> {
    if (this.useMockData()) {
      const { mockUsers } = await import('@/lib/mockData');
      return mockUsers;
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`/api/users?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }
}
