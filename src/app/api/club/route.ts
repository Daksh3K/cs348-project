import { NextRequest, NextResponse } from 'next/server'
import { type Club } from '@prisma/client'

import { ClubService } from '@src/services/club'

export type clubsWithMembership = (Club & { membership_id: bigint | null })[]

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const type = params.get("type")

    switch (type) {
        case "getAllClubs": {
            const studentId = params.get("student_id")
            const _clubs = await ClubService.getAllClubs(BigInt(studentId!)) as clubsWithMembership
            const clubs = _clubs.map((club) => ({
                ...club,
                club_id: club.club_id.toString(),
                membership_id: club.membership_id !== null ? club.membership_id.toString() : null
            }))
            return NextResponse.json(clubs)
        }
        // case "getClub": {
        //     const clubId = params.get("club_id")
        //     const club = await ClubService.getClub(BigInt(clubId!)) // Assuming you have a method to get a club by ID
        //     return NextResponse.json(club)
        // }
        // case "getClubMembers": {
        //     const clubId = params.get("club_id")
        //     const members = await ClubService.getClubMembers(BigInt(clubId!)) // Assuming you have a method to get members of a club
        //     return NextResponse.json(members)
        // }
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { type, name, description, studentId, clubId } = body

    switch (type) {
        case "addClub": {
            const newClub = await ClubService.addClub(name, description)
            return NextResponse.json(newClub)
        }
        case "joinClub": {
            const membership = await ClubService.joinClub(BigInt(studentId), BigInt(clubId))
            return NextResponse.json(membership)
        }
    }
}

