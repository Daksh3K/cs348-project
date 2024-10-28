import prisma from "@src/app/db";

export class ClubService {

    static async getAllClubs(student_id: BigInt) {
        return prisma.$queryRaw`
        SELECT c.club_id, c.club_name, c.description, c.manager_id, c.created_date, cm.membership_id
        FROM "Club" c
        LEFT JOIN "Club_Membership" cm ON c.club_id = cm.club_id AND cm.student_id = ${student_id}`;
    }

    static async addClub(name: string, description: string) {
        return await prisma.club.create({
            data: {
                club_name: name,
                description: description,
            },
        }); // Create a new club in the database
    }

    static async joinClub(studentId: BigInt, clubId: BigInt) {
        return await prisma.club_Membership.create({
            data: {
                student_id: Number(studentId),
                club_id: Number(clubId),
                membership_status: "Active"
            },
        }); // Add a student to a club's membership
    }
}