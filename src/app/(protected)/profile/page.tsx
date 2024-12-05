"use client";

import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Badge,
  FormLabel,
  Input,
  Switch,
  theme,
  Select,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import { studentAtom } from "@src/atoms/studentAtom";
import { useEffect, useState } from "react";
import { type Club, Event } from "@prisma/client";
import { clubsWithMembershipsStringID } from "@src/types/club";
import { generateReportResult1 } from "@src/services/student";

type EventWithStringId = Omit<Event, "event_id"> & { event_id: string };
type eventFilters = {
  club: Club | undefined;
  from: Date;
  to: Date;
};

export default function ProfilePage() {
  const [student] = useAtom(studentAtom);

  const [clubs, setClubs] = useState<Club[]>();
  const [events, setEvents] = useState<Event[]>();
  const [isLoading, setIsloading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  const [eventFilters, setEventFilters] = useState<eventFilters>({
    club: undefined,
    from: new Date(),
    to: new Date(),
  });

  const [reportResult, setReportResult] = useState<
    {
      number_of_clubs: number;
    } & generateReportResult1
  >();
  const generateReport = async () => {
    const res = await fetch(
      `api/student?type=generateReport&student_id=${student?.student_id}`,
      {
        method: "POST",
        body: JSON.stringify({
          clubID: eventFilters.club?.club_id.toString(),
          from: eventFilters.from.toString(),
          to: eventFilters.to.toString(),
        }),
      }
    );

    if (!res.ok) console.error("error in generating the report");

    const reportJSON = (await res.json()) as {
      number_of_clubs: number;
    } & generateReportResult1;

    setReportResult(reportJSON);
  };

  // fetch all events and memberships on load
  useEffect(() => {
    setIsloading(true);
    const fetchClubsAndEvents = async () => {
      // Concurrently fetch clubs and events
      const [clubResponse, eventResponse] = await Promise.all([
        fetch(
          `api/student?type=getStudentClubs&student_id=${student?.student_id}`
        ),
        fetch(
          `api/student?type=getStudentEvents&student_id=${student?.student_id}`
        ),
      ]);

      if (!clubResponse.ok || !eventResponse.ok) {
        setError(true);
      }

      const clubs = (await clubResponse.json()) as clubsWithMembershipsStringID;

      const events = await eventResponse.json();

      setClubs(
        clubs.map((club) => ({
          ...club,
          club_id: BigInt(club.club_id),
          manager_id: BigInt(club.manager_id),
          memberships: club.memberships.map((m) => ({
            membership_id: BigInt(m.membership_id),
            student_id: BigInt(m.student_id),
            club_id: BigInt(m.club_id),
          })),
        }))
      );

      setEvents(
        events.map((event: EventWithStringId) => ({
          ...event,
          event_id: BigInt(event.club_id),
        }))
      );
      setIsloading(false);
    };

    fetchClubsAndEvents();
  }, [student]);

  const leaveClub = async (clubId: bigint) => {
    const result = await fetch(`api/club?type=leaveClub`, {
      method: "POST",
      body: JSON.stringify({
        studentId: student?.student_id.toString(),
        clubId: clubId.toString(),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!result.ok) {
      console.error("Failed to leave club");
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">
          Profile Information
        </Text>
        <Text>
          <strong>Email:</strong> {student?.email}
        </Text>
        <Text>
          <strong>ID:</strong> {student?.student_id?.toString()}
        </Text>
        <Text>
          <strong>First Name:</strong> {student?.first_name}
        </Text>
        <Text>
          <strong>Last Name:</strong> {student?.last_name}
        </Text>
        <Text>
          <strong>Join Date:</strong>
          {student?.join_date
            ? new Date(student.join_date).toDateString()
            : "N/A"}
        </Text>
      </VStack>

      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">
          Club Memberships
        </Text>
        <HStack spacing={4} overflowX="auto">
          {clubs?.map((club) => (
            <Box
              key={club.club_id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              maxWidth="15rem"
              height={"10rem"}
              overflow={"scroll"}
            >
              <Flex
                flexDir={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={"1rem"}
              >
                <Text fontWeight="bold">{club.club_name}</Text>
                {club.manager_id !== student?.student_id ? (
                  <Button
                    size={"sm"}
                    variant={"ghost"}
                    color={"red"}
                    onClick={() => {
                      leaveClub(club.club_id);
                    }}
                  >
                    Leave
                  </Button>
                ) : (
                  <Badge colorScheme="green" size={"sm"}>
                    Manager
                  </Badge>
                )}
              </Flex>
              <Text mb={"0.5rem"}>{club.description}</Text>
              <Text>
                <strong>Created:</strong>{" "}
                {new Date(club.created_date).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </HStack>
      </VStack>

      <VStack align="start" spacing={3} marginBottom={"1rem"}>
        <Text fontSize="lg" fontWeight="bold">
          Event Participation
        </Text>
        <HStack spacing={4} overflowX="auto">
          {events?.map((event) => (
            <Box
              key={event.event_id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              minWidth="200px"
            >
              <Text fontWeight="bold">{event.event_name}</Text>
              <Text>
                <strong>Date:</strong>{" "}
                {new Date(event.event_date).toLocaleDateString()}
              </Text>
              <Text>
                <strong>Time:</strong>{" "}
                {new Date(event.start_time).toLocaleTimeString()} -{" "}
                {new Date(event.end_time).toLocaleTimeString()}
              </Text>
              <Text>
                <strong>Attendees:</strong> {event.anticipated_attendees}
              </Text>
            </Box>
          ))}
        </HStack>
      </VStack>

      <Text fontSize="lg" fontWeight="bold" mb={"1rem"}>
        Statistics
      </Text>

      <Box
        borderRadius={"md"}
        backgroundColor={theme.colors.gray[100]}
        padding={"1rem"}
        mb={"1rem"}
      >
        <Text fontSize="md" fontWeight={"bold"} mb={"0.5rem"}>
          Filters
        </Text>
        <Flex flexDir={"row"} mt={"0.5rem"} alignItems={"center"}>
          <FormLabel padding={"0rem"}>Club</FormLabel>
          <Select
            placeholder="select a club, leave empty for all"
            maxW={"200px"}
            mr={"1rem"}
            onChange={(e) =>
              setEventFilters((prev) => ({
                ...prev,
                club: clubs?.find((c) => c.club_name === e.target.value),
              }))
            }
          >
            {clubs?.map((club) => (
              <option key={club.club_id} value={club.club_name}>
                {club.club_name}
              </option>
            ))}
          </Select>
          <FormLabel>From: </FormLabel>
          <Input
            type="date"
            placeholder="from"
            maxWidth={"200px"}
            mr={"1rem"}
            onChange={(e) =>
              setEventFilters((prevState) => ({
                ...prevState,
                from: new Date(e.target.value + "T00:00:00"),
              }))
            }
          />
          <FormLabel>To: </FormLabel>
          <Input
            type="date"
            placeholder="to"
            maxWidth={"200px"}
            mr={"1rem"}
            onChange={(e) =>
              setEventFilters((prevState) => ({
                ...prevState,
                to: new Date(e.target.value + "T00:00:00"),
              }))
            }
          />
          <Button onClick={generateReport} colorScheme="teal">
            Apply
          </Button>
        </Flex>
      </Box>
      {reportResult && (
        <VStack align="start" spacing={3} marginBottom={"1rem"}>
          <Text>
            <strong>Number of clubs joined:</strong>{" "}
            {reportResult.number_of_clubs}
          </Text>
          <Text>
            <strong>Number of events attended:</strong>{" "}
            {reportResult.number_of_clubs}
          </Text>
          <Text>
            <strong>total time in events:</strong>{" "}
            {reportResult.total_time_in_events}
          </Text>
          <Text>
            <strong>Average time per event:</strong>{" "}
            {reportResult.average_time_per_event}
          </Text>
        </VStack>
      )}
    </Box>
  );
}
