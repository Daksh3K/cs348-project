import prisma from "@src/app/db";


export type generateReportResult1 = {
  count: bigint,
  total_time_in_events: number,
  average_time_per_event: number
}


export class StudentService {

  static async getStudent(email: string) {
    return prisma.student.findUnique({
      where: { email: email },
    });
  }

  static async createStudent(firstName: string, lastName: string, email: string) {
    return prisma.student.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email
      }
    });
  }

  static async getStudentClubs(studentId: bigint) {
    const clubs = await prisma.club.findMany({
      where: {
        memberships: {
          some: {
            student_id: studentId,
          },
        },
      },
      include: {
        memberships: true, // Optionally include membership details
      },
    });

    return clubs;
  }

  static async getStudentEvents(studentId: bigint) {
    const events = await prisma.event.findMany({
      where: {
        participations: {
          some: {
            student_id: studentId,
          },
        },
      }
    });

    return events;
  }

  static async addStudent(firstName: string, lastName: string, email: string) {
    return prisma.student.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email
      }
    })
  }

  static async generateReport(studentID: bigint, clubID: bigint, from: Date, to: Date) {
    const [res1, res2] = await prisma.$transaction([
      prisma.$queryRaw`
        SELECT COUNT(*), SUM(EXTRACT(EPOCH FROM (e.end_time - e.start_time)) / 3600) as total_time_in_events, SUM(EXTRACT(EPOCH FROM (e.end_time - e.start_time)) / 3600) / CAST(COUNT(*) AS FLOAT) as average_time_per_event
      FROM "Event" e
      INNER JOIN "Event_Participation" ep ON e.event_id = ep.event_id
      WHERE ep.student_id = ${studentID} AND e.club_id = ${clubID} AND e.start_time >= ${from} AND e.end_time < ${to}
      `,
  
      prisma.$queryRaw`
        SELECT 
          COUNT(*) AS number_of_clubs
        FROM "Club_Membership" cp
        WHERE cp.student_id = ${studentID}
      `,
    ]) as [generateReportResult1[], { number_of_clubs : bigint }[]];
    return { ...res1[0], ...res2[0] };
  }
  
}
