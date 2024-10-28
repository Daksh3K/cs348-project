import { type Club } from "@prisma/client";

export type ClubWithStringId = Omit<Club, 'club_id'> & { club_id: string };
