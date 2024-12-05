import { type Club, Club_Membership } from "@prisma/client";

type Club_Membership_StringID = {
    [K in keyof Club_Membership]: Club_Membership[K] extends bigint ? string : Club_Membership[K];
}

export type clubsWithMembershipsStringID = (Omit<Club, 'club_id'> & { club_id: string, manager_id: string , memberships: Club_Membership_StringID[]})[];


export type ClubStringId = {
    club_id: string;
    club_name: string;
    description: string | null;
    created_date: Date;
    manager_id: string | null;
}