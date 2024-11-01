import prisma from "@src/app/db";

export class EventService {
  static async getAllEvents(studentId: bigint) {
    return prisma.$queryRaw`
        SELECT e.event_id, e.event_name, e.event_date, e.start_time, e.end_time, e.anticipated_attendees, c.club_id, c.club_name, v.venue_id, v.venue_name, ep.status
        FROM "Event" e
        LEFT JOIN "Event_Participation" ep ON e.event_id = ep.event_id AND ep.student_id = ${studentId}
        INNER JOIN "Club" c ON e.club_id = c.club_id
        INNER JOIN "Venue" v ON e.venue_id = v.venue_id
        `;
  }

  static async addEvent(
    eventName: string,
    eventDate: Date,
    startTime: Date,
    endTime: Date,
    attendees: number,
    clubId: bigint,
    venueId: bigint
  ) {
    return prisma.event.create({
      data: {
        event_name: eventName,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        anticipated_attendees: attendees,
        club: { connect: { club_id: clubId } },
        venue: { connect: { venue_id: venueId } },
      },
    });
  }

  static async getVenues(eventDate: Date, eventStartTime: Date, eventEndTime: Date) {
    return prisma.venue.findMany({
      where: {
        NOT: {
          events: {
            some: {
              event_date: eventDate,
              start_time: {
                gte: eventStartTime,
                lt: eventEndTime,
              },
            },
          },
        },
      },
    });
  }
}
