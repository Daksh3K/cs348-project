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
                manager_id: club.manager_id?.toString(),
                membership_id: club.membership_id !== null ? club.membership_id.toString() : null
            }))
            return NextResponse.json(clubs)
        }
        case "getManagedClub": {
            const studentId = params.get("student_id")

            const club = await ClubService.getManagedClub(BigInt(studentId!))
            return NextResponse.json({
                ...club,
                club_id: club?.club_id.toString(),
                manager_id: club?.manager_id?.toString()
            })
        }

    }
}

export async function POST(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const type = params.get("type")
    const body = await request.json()

    switch (type) {
        case "addClub": {
            const { name, description, studentId } = body
            console.log(`\n\nStudent id is: ${studentId}\n\n`)
            const newClub = await ClubService.addClub(name, description, BigInt(studentId))
            return NextResponse.json({
                ...newClub,
                club_id: newClub.club_id.toString(),
                manager_id: newClub.manager_id?.toString()
            })
        }
        case "joinClub": {
            const { studentId, clubId } = body
            const membership = await ClubService.joinClub(BigInt(studentId), BigInt(clubId))
            return NextResponse.json({
                ...membership,
                membership_id: membership.membership_id.toString(),
                student_id: membership.student_id.toString(),
                club_id: membership.club_id.toString()
            })
        }
        case "leaveClub": {
            const { studentId, clubId } = body
            const res = await ClubService.leaveClub(BigInt(studentId), BigInt(clubId))
            
            if (Object.entries(res).length) {
                return NextResponse.json({ success: true })
            } else {
                return NextResponse.error()
            }
        }
        case "updateClub": {
            const { managerId, newClubName, newDescription } = body
            console.log("New info", newClubName, newDescription)
            const res = await ClubService.updateClub(BigInt(managerId), newClubName, newDescription)
            return NextResponse.json({
                ...res,
                club_id: res.club_id.toString(),
                manager_id: res.manager_id?.toString()
            })
        }
    }
}

