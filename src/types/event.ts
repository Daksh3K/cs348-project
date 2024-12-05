import { Club_Membership, type Event, ParticipationStatus } from "@prisma/client";


export type getAllEventsStringId = {
    event_id: string,
    event_name: string,
    event_date: Date,
    start_time: Date,
    end_time: Date,
    anticipated_attendees: number,
    club_id: string,
    club_name: string,
    venue_id: string,
    venue_name: string,
    status: ParticipationStatus | null
}[]

export type getAllEvents = {
    event_id: bigint,
    event_name: string,
    event_date: Date,
    start_time: Date,
    end_time: Date,
    anticipated_attendees: number,
    club_id: bigint,
    club_name: string,
    venue_id: bigint,
    venue_name: string,
    status: ParticipationStatus | null
}[]