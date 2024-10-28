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
        club_id: club.club_id.toString()
      }))
      
      return NextResponse.json(serializedClubs)
    }

    case "getStudentEvents": {
      const studentId = params.get("student_id")
      const events = await StudentService.getStudentEvents(BigInt(studentId!))

      const serializedEvents = events.map(event => ({
        ...event,
        club_id: event.club_id.toString()
      }))
      
      return NextResponse.json(serializedEvents)
    }
    
    case "addStudent":

  }
    
}