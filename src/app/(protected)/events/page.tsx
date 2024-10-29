"use client"

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { studentAtom } from "@src/atoms/studentAtom";
import { getAllEventsStringId, type getAllEvents } from "@src/types/event";
import {
  Spinner,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { Club } from "@prisma/client";

import { type ClubStringId } from "@src/types/club";

export default function EventsPage() {
  const [student] = useAtom(studentAtom);

  const [events, setEvents] = useState<getAllEvents>();
  const [managedClub, setManagedClub] = useState<Club>()
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchEvents = async () => {
      const [eventResponse, managedClubResponse] = await Promise.all([
        fetch(`api/event?type=getAllEvents&student_id=${student?.student_id}`),
        fetch(`api/club?type=getManagedClub&student_id=${student?.student_id}`)
      ]);

      if (!eventResponse.ok || !managedClubResponse.ok) {
        setError(true);
        console.error("Failed to fetch events or managed clubs");
      }

      const events = (await eventResponse.json()) as getAllEventsStringId;
      const managedClub = (await managedClubResponse.json()) as ClubStringId
      setEvents(
        events.map((c) => ({
          ...c,
          event_id: BigInt(c.event_id),
          club_id: BigInt(c.club_id),
          venue_id: BigInt(c.venue_id),
        }))
      );
      setManagedClub({
        ...managedClub,
        club_id: BigInt(managedClub.club_id),
        manager_id: managedClub.manager_id ? BigInt(managedClub.manager_id) : null
      })
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <Text color={"red.200"}>Error while fetching events</Text>;

  return (
    <>
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        Upcoming Events
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {events?.map((event) => (
          <Card
            key={event.event_id}
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            minWidth="200px"
          >
            <CardHeader>
              <Text fontWeight="bold">{event.event_name}</Text>
            </CardHeader>
            <CardBody>
              <Text>{new Date(event.event_date).toLocaleDateString()}</Text>
              <Text>{new Date(event.start_time).toLocaleTimeString()}</Text>
              <Text>{new Date(event.end_time).toLocaleTimeString()}</Text>
              <Text>{event.club_name}</Text>
              <Text>{event.venue_name}</Text>
            </CardBody>
            <CardFooter>
              {event.status ? (
                <Button colorScheme="blue">RSVP</Button>
              ) : (
                <Text>Attending</Text>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>


    {managedClub?.manager_id === student?.student_id && (
      <Button
        position="fixed"
        bottom={4}
        right={4}
        colorScheme="blue"
      >
        Create Event
      </Button>
    )}
    </>
  );
}
