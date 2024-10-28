import prisma from "@src/app/db";

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
      },
      include: {
        participations: true, // Optionally include participation details
      },
    });

    return events;
  }
}
