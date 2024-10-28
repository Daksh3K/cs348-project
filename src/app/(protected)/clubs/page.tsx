'use client'

import { Text, VStack, Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { studentAtom } from "@src/atoms/studentAtom";
import { type clubsWithMembership } from "@src/app/api/club/route";

export default function ClubsPage() {
  const [student] = useAtom(studentAtom);
  const [clubs, setClubs] = useState<clubsWithMembership>([]);

  const [isLoading, setIsloading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setIsloading(true);
    console.log("Fetching clubs for student:", student);
    const fetchClubs = async () => {
      const clubResponse = await fetch(
        `api/club?type=getAllClubs&student_id=${student?.student_id}`
      );

      if (!clubResponse.ok) {
        setError(true);
      }

      const _clubs = (await clubResponse.json()) as clubsWithMembership;

      setClubs(
        _clubs.map((club) => ({
          ...club,
          club_id: BigInt(club.club_id),
          membership_id: club.membership_id ? BigInt(club.membership_id) : null,
        }))
      );

      setIsloading(false);
    };

    fetchClubs();
  }, []);

  return (
    <VStack spacing={4}>
      {clubs.length ? clubs.map((club) => (
        <Box
          key={club.club_id}
          p={4}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          minWidth="200px"
        >
          <Text fontWeight="bold">{club.club_name}</Text>
          <Text>{club.description}</Text>
          <Text>
            <strong>Created:</strong>{" "}
            {new Date(club.created_date).toLocaleDateString()}
          </Text>
          {club.membership_id ? (
            <Text>Joined</Text>
          ) : (
            <Button colorScheme="blue">Join</Button>
          )}
        </Box>
      )) : <Text>No clubs found. Create one below.</Text>}
    </VStack>
  );
}

// get all clubs, join button for each club that not already member of
// create club popup ?
