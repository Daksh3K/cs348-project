"use client";

import { Box, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { studentAtom } from "@src/atoms/studentAtom";
import { useEffect, useState } from "react";
import { type Club, Event } from "@prisma/client";
import { type ClubWithStringId } from "@src/types/club";

type EventWithStringId = Omit<Event, 'event_id'> & { event_id: string };


export default function ProfilePage() {
  const [student] = useAtom(studentAtom);

  const [clubs, setClubs] = useState<Club[]>();
  const [events, setEvents] = useState<Event[]>();
  const [isLoading, setIsloading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  // fetch all events and memberships on load
  useEffect(() => {
    setIsloading(true)
    const fetchClubsAndEvents = async () => {
      // Concurrently fetch clubs and events
      const [clubResponse, eventResponse] = await Promise.all([
        fetch(`api/student?type=getStudentClubs&student_id=${student?.student_id}`),
        fetch(`api/student?type=getStudentEvents&student_id=${student?.student_id}`)
      ]);

      if (!clubResponse.ok || !eventResponse.ok) {
        setError(true)
      }

      const clubs = await clubResponse.json();

      const events = await eventResponse.json();

      setClubs(clubs.map((club: ClubWithStringId)  => ({
        ...club,
        club_id: BigInt(club.club_id),
      })));

      setClubs(events.map((event: EventWithStringId) => ({
        ...event,
        event_id: BigInt(event.club_id),
      })));      
      setIsloading(false)

    };

    fetchClubsAndEvents();
  }, [student]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">Profile Information</Text>
        <Text><strong>Email:</strong> {student?.email}</Text>
        <Text><strong>ID:</strong> {student?.student_id?.toString()}</Text>
        <Text><strong>First Name:</strong> {student?.first_name}</Text>
        <Text><strong>Last Name:</strong> {student?.last_name}</Text>
        <Text>
          <strong>Join Date:</strong> 
          {student?.join_date ? new Date(student.join_date).toDateString() : "N/A"}
        </Text>
      </VStack>

      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">Club Memberships</Text>
        <HStack spacing={4} overflowX="auto">
          {clubs?.map((club) => (
            <Box key={club.club_id} p={4} borderWidth={1} borderRadius="md" boxShadow="md" minWidth="200px">
              <Text fontWeight="bold">{club.club_name}</Text>
              <Text>{club.description}</Text>
              <Text><strong>Created:</strong> {new Date(club.created_date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </HStack>
      </VStack>

      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">Event Participation</Text>
        <HStack spacing={4} overflowX="auto">
          {events?.map((event) => (
            <Box key={event.event_id} p={4} borderWidth={1} borderRadius="md" boxShadow="md" minWidth="200px">
              <Text fontWeight="bold">{event.event_name}</Text>
              <Text><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</Text>
              <Text><strong>Time:</strong> {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}</Text>
              <Text><strong>Attendees:</strong> {event.anticipated_attendees}</Text>
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
