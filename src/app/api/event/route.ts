import { NextRequest, NextResponse } from "next/server";

import { EventService } from "@src/services/event";
import { getAllEvents, getAllEventsStringId } from "@src/types/event";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const type = params.get("type")

    switch(type) {
        case "getAllEvents": {
            const studentId = params.get("student_id")
            const res = await EventService.getAllEvents(BigInt(studentId!)) as getAllEvents
            return NextResponse.json(res.map(r => ({
                ...r,
                event_id: r.event_id.toString(),
                club_id: r.club_id.toString(),
                venue_id: r.venue_id.toString()
            })))
        }
    }
}