import prisma from "@src/app/db";

export class ClubService {
  static async getAllClubs(student_id: bigint) {
    return prisma.$queryRaw`
        SELECT c.club_id, c.club_name, c.description, c.manager_id, c.created_date, cm.membership_id
        FROM "Club" c
        LEFT JOIN "Club_Membership" cm ON c.club_id = cm.club_id AND cm.student_id = ${student_id}`;
  }

  static async addClub(name: string, description: string, student_id: bigint) {
    const newClub = await prisma.club.create({
      data: {
        club_name: name,
        description: description,
        manager_id: student_id,
      },
    }); // Create a new club in the database

    // Add the student as a member of the newly created club
    await prisma.club_Membership.create({
      data: {
        student_id: student_id,
        club_id: newClub.club_id,
        membership_status: "Active",
      },
    });

    return newClub; // Return the newly created club
  }

  static async joinClub(studentId: bigint, clubId: bigint) {
    return await prisma.club_Membership.create({
      data: {
        student_id: studentId,
        club_id: clubId,
        membership_status: "Active",
      },
    }); // Add a student to a club's membership
  }

  static async getManagedClub(studentId: bigint) {
    const club = await prisma.club.findUnique({
      where: {
        manager_id: studentId, // Find the club where the student is the manager
      },
    });
    return club; // Return the managed club for the student
  }

  static async leaveClub(studentId: bigint, clubId: bigint) {
    const [clubMembershipDel, eventParticipationDel] = await prisma.$transaction([
      prisma.club_Membership.delete({
        where: {
          student_id_club_id: {
            student_id: studentId,
            club_id: clubId,
          },
        },
      }),
      prisma.event_Participation.deleteMany({
        where: {
          event: {
            club_id: clubId, // Assuming there's a relation to club_id in the event model
          },
        },
      }),
    ]);
  
    return { clubMembershipDel, eventParticipationDel };
  }
  

  static async updateClub(managerId: bigint, club_name: string, description: string) {
    return await prisma.club.update({
        where: { manager_id: managerId },
        data: {
          club_name: club_name,
          description: description,
        },
      }); // Update the club with the new information
    }
}
