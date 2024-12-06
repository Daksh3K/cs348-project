import { NextRequest, NextResponse } from "next/server";

import { EventService } from "@src/services/event";
import { getAllEvents, getAllEventsStringId } from "@src/types/event";

type addEventBody = {
    eventName: string,
    eventDate: string,
    eventStartTime: string,
    eventEndTime: string,
    attendees: string,
    clubId: string,
    venueId: string,
  }

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");

  switch (type) {
    case "getAllEvents": {
      const studentId = params.get("student_id");
      const res = (await EventService.getAllEvents(
        BigInt(studentId!)
      )) as getAllEvents;
      return NextResponse.json(
        res.map((r) => ({
          ...r,
          event_id: r.event_id.toString(),
          club_id: r.club_id.toString(),
          venue_id: r.venue_id.toString(),
        }))
      );
    }
  }
}

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const body = await request.json();
  switch (type) {
    case "addEvent": {
      const {
        eventName,
        eventDate,
        eventStartTime,
        eventEndTime,
        attendees,
        clubId,
        venueId,
      }: addEventBody = body;


      // parse dates into Date objects
      const parsedEventDate = new Date(eventDate)
      const parsedStartTime = new Date(eventStartTime)
      const parsedEndTime = new Date(eventEndTime)

      // parse bigints
      const parsedClubId = BigInt(clubId)
      const parsedVenueId = BigInt(venueId)

      const parsedAttendees = parseInt(attendees, 10)

      const result = await EventService.addEvent(
        eventName,
        parsedEventDate,
        parsedStartTime,
        parsedEndTime,
        parsedAttendees,
        parsedClubId,
        parsedVenueId
      )

      return NextResponse.json({
        ...result,
        event_id: result.event_id.toString(),
        venue_id: result.venue_id.toString(),
        club_id: result.club_id.toString()
      })

    }
    case "getVenues": {
        const { eventDay, eventStartTime, eventEndTime } = body

        const result = await EventService.getVenues(
            new Date(eventDay),
            new Date(eventStartTime),
            new Date(eventEndTime)
        )

        return NextResponse.json(result.map(r => ({
            ...r,
            venue_id: r.venue_id.toString()
        })))

    }

    case "joinEvent": {
      const { eventID, studentID } = body
      const result = await EventService.joinEvent(
        BigInt(eventID),
        BigInt(studentID)
      )

      return NextResponse.json({
        ...result,
        participation_id: result.participation_id.toString(),
        student_id: result.student_id.toString(),
        event_id: result.event_id.toString()
      })
    }
  }
}
