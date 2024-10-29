import prisma from "@src/app/db";

export class EventService {
    static async getAllEvents(studentId: bigint) {
        return prisma.$queryRaw`
        SELECT e.event_id, e.event_name, e.event_date, e.start_time, e.end_time, e.anticipated_attendees, c.club_id, c.club_name, v.venue_id, v.venue_name, ep.status
        FROM "Event" e
        LEFT JOIN "Event_Participation" ep ON e.event_id = ep.event_id AND ep.student_id = ${studentId}
        INNER JOIN "Club" c ON e.club_id = c.club_id
        INNER JOIN "Venue" v ON e.venue_id = v.venue_id
        `
    }
}