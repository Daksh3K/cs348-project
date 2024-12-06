import { NextRequest, NextResponse } from 'next/server'

import { StudentService } from '@src/services/student'

export async function GET(request: NextRequest) {

  const params = request.nextUrl.searchParams
  const type = params.get("type")

  switch (type) {
    case "getStudent": {

      
      const email = params.get("email")
      const student = await StudentService.getStudent(email!)
      const serializedStudent = {
        ...student,
        student_id: student?.student_id?.toString()
      }
      
      return NextResponse.json(serializedStudent)
      
    }
    case "getStudentClubs": {
      const studentId = params.get("student_id")
      const clubs = await StudentService.getStudentClubs(BigInt(studentId!))

      const serializedClubs = clubs.map(club => ({
        ...club,
        club_id: club.club_id.toString(),
        manager_id: club.manager_id?.toString(),
        memberships: club.memberships.map(m => (
          {
            membership_id: m.membership_id.toString(),
            student_id: m.student_id.toString(),
            club_id: m.club_id.toString(),
          }
        ))
      }))
      
      return NextResponse.json(serializedClubs)
    }

    case "getStudentEvents": {
      const studentId = params.get("student_id")
      const events = await StudentService.getStudentEvents(BigInt(studentId!))      
      const serializedEvents = events.map(event => ({
        ...event,
        club_id: event.club_id.toString(),
        event_id: event.event_id.toString(),
        venue_id: event.venue_id.toString()
      }))
      
      return NextResponse.json(serializedEvents)
    }
  }
    
}

export async function POST(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const body = await request.json();

  switch(type) {
    case "addStudent": {
      const {
        firstName,
        lastName,
        email
      } = body

      const result = await StudentService.addStudent(firstName, lastName, email)

      return NextResponse.json({
        ...result,
        student_id: result.student_id.toString(),
        join_date: result.join_date.getTime()
      })

    }

    case "generateReport": {
      const studentID = params.get("student_id")
      const { clubID, from, to } = body

      const fromDateTime = new Date(from)
      const toDateTime = new Date(to)

      console.log(studentID, clubID, from, to)
      const result = await StudentService.generateReport(BigInt(studentID!), BigInt(clubID), fromDateTime, toDateTime)
      return NextResponse.json({
        ...result,
        number_of_clubs: result.number_of_clubs.toString(),
        count: result.count.toString(),
      })
    }
  }

}