"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { studentAtom } from "@src/atoms/studentAtom";
import { getAllEventsStringId, type getAllEvents } from "@src/types/event";
import {
  Flex,
  Spinner,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  SimpleGrid,
  Box,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  theme,
  Switch,
} from "@chakra-ui/react";
import { Club, Venue } from "@prisma/client";

import { type ClubStringId } from "@src/types/club";

type createEventInput = {
  eventName: string;
  eventDate: Date;
  eventStartTime: Date;
  eventEndTime: Date;
  attendees: number;
  venueId: bigint;
};



export default function EventsPage() {
  const [student] = useAtom(studentAtom);
  const [events, setEvents] = useState<getAllEvents>();
  const [managedClub, setManagedClub] = useState<Club>();
  const [eventInput, setEventInput] = useState<createEventInput>({
    eventName: "",
    eventDate: new Date(),
    eventStartTime: new Date(),
    eventEndTime: new Date(),
    attendees: 0,
    venueId: BigInt(0),
  });
  const [venues, setVenues] = useState<Venue[]>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchEvents = async () => {
      const [eventResponse, managedClubResponse] = await Promise.all([
        fetch(`api/event?type=getAllEvents&student_id=${student?.student_id}`),
        fetch(`api/club?type=getManagedClub&student_id=${student?.student_id}`),
      ]);

      if (!eventResponse.ok || !managedClubResponse.ok) {
        setError(true);
        console.error("Failed to fetch events or managed clubs");
      }

      const events = (await eventResponse.json()) as getAllEventsStringId;
      const managedClub = (await managedClubResponse.json()) as ClubStringId;

      setEvents(
        events?.map((c) => ({
          ...c,
          event_id: BigInt(c.event_id),
          club_id: BigInt(c.club_id),
          venue_id: BigInt(c.venue_id),
        }))
      );
      setManagedClub(
        Object.entries(managedClub).length
          ? {
              ...managedClub,
              club_id: BigInt(managedClub.club_id),
              manager_id: managedClub.manager_id
                ? BigInt(managedClub.manager_id)
                : null,
            }
          : undefined
      );
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const submitAddEvent = async () => {
    const result = fetch(`api/event?type=addEvent`, {
      method: "POST",
      body: JSON.stringify({
        eventName: eventInput.eventName,
        eventDate: eventInput.eventDate.getTime(),
        eventStartTime: eventInput.eventStartTime.getTime(),
        eventEndTime: eventInput.eventEndTime.getTime(),
        attendees: eventInput.attendees,
        clubId: managedClub?.club_id.toString(),
        venueId: eventInput.venueId.toString(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const fetchVenues = async () => {
    const result = await fetch("api/event?type=getVenues", {
      method: "POST",
      body: JSON.stringify({
        eventDay: eventInput.eventDate.getTime(),
        eventStartTime: eventInput.eventStartTime.getTime(),
        eventEndTime: eventInput.eventEndTime.getTime(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!result.ok) console.error("Failed to fetch venues");
    const fetchVenues = (await result.json()) as Venue[];

    setVenues(
      fetchVenues.map((v) => ({
        ...v,
        venue_id: BigInt(v.venue_id),
      }))
    );
  };

  const RSVPEvent = async (joiningEventID: bigint) => {
    const response = await fetch("api/event?type=joinEvent", {
      method: "POST",
      body: JSON.stringify({
        eventID: joiningEventID.toString(),
        studentID: student?.student_id.toString(),
      }),
    });

    if (!response.ok) console.error("failed to join event");
  };

  if (isLoading) return <Spinner />;
  if (error) return <Text color={"red.200"}>Error while fetching events</Text>;

  return (
    <>
      <Text fontSize="lg" fontWeight="bold" mb={"1rem"}>
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
              <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                mt={"0.5rem"}
              >
                <Text fontWeight="bold">{event.event_name}</Text>
                <Text>
                  Hosted By: <Text fontWeight={"bold"}>{event.club_name}</Text>
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text>On: {new Date(event.event_date).toLocaleDateString()}</Text>
              <Text>
                From {new Date(event.start_time).toLocaleTimeString()} -{" "}
                {new Date(event.end_time).toLocaleTimeString()}
              </Text>
              <Text>{event.venue_name}</Text>
            </CardBody>
            <CardFooter>
              {event.status ? (
                <Text>Attending</Text>
              ) : (
                <Button
                  onClick={() => RSVPEvent(event.event_id)}
                  colorScheme="blue"
                >
                  RSVP
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {managedClub?.manager_id === student?.student_id && (
        <>
          <Button
            position="fixed"
            bottom={4}
            right={4}
            colorScheme="teal"
            onClick={onOpen}
          >
            Create Event
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Event</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired>
                  <FormLabel htmlFor="event-name">Event Name</FormLabel>
                  <Input
                    id="event-name"
                    placeholder="Event Name"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        eventName: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="event-date">Event Date</FormLabel>
                  <Input
                    id="event-date"
                    type="date"
                    placeholder="Event Date"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        eventDate: new Date(e.target.value + "T00:00:00"),
                      }))
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="start-time">Start Time</FormLabel>
                  <Input
                    id="start-time"
                    type="time"
                    placeholder="Start Time"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        eventStartTime: new Date(
                          new Date().setHours(
                            parseInt(e.target.value.split(":")[0], 10), // hours
                            parseInt(e.target.value.split(":")[1], 10) // minutes
                          )
                        ),
                      }))
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="end-time">End Time</FormLabel>
                  <Input
                    id="end-time"
                    type="time"
                    placeholder="End Time"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        eventEndTime: new Date(
                          new Date().setHours(
                            parseInt(e.target.value.split(":")[0], 10), // hours
                            parseInt(e.target.value.split(":")[1], 10) // minutes
                          )
                        ),
                      }))
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="attendees">Attendees</FormLabel>
                  <Input
                    id="attendees"
                    type="number"
                    placeholder="Attendees"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        attendees: parseInt(e.target.value, 10),
                      }))
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="venue">Venue</FormLabel>
                  <Select
                    id="venue"
                    placeholder="Select Venue"
                    onChange={(e) =>
                      setEventInput((prevState) => ({
                        ...prevState,
                        venueId:
                          venues?.find((v) => v.venue_name === e.target.value)
                            ?.venue_id || BigInt(0),
                      }))
                    }
                    onClick={fetchVenues}
                  >
                    {venues?.map((venue) => (
                      <option key={venue.venue_id} value={venue.venue_name}>
                        {venue.venue_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="teal"
                  mr={"0.5rem"}
                  onClick={submitAddEvent}
                >
                  Add Event
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
