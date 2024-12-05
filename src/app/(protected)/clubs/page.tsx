"use client";

import {
  Text,
  VStack,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Spinner,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { HiPlus, HiPencil } from "react-icons/hi";

import { studentAtom } from "@src/atoms/studentAtom";
import { type clubsWithMembership } from "@src/app/api/club/route";

export default function ClubsPage() {
  const [student] = useAtom(studentAtom);
  const [clubs, setClubs] = useState<clubsWithMembership>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [isLoading, setIsloading] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);
  const [clubName, setClubName] = useState(""); // State for club name
  const [description, setDescription] = useState(""); // State for description

  const [editClubName, setEditClubName] = useState(""); // State for club name
  const [editDescription, setEditDescription] = useState(""); // State for description

  useEffect(() => {
    setIsloading(true);
    const fetchClubs = async () => {
      const clubResponse = await fetch(
        `api/club?type=getAllClubs&student_id=${student?.student_id}`
      );

      if (!clubResponse.ok) {
        setError(true);
        console.error(await clubResponse.text())
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

  const submitAddClub = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await fetch("api/club?type=addClub", {
      method: "POST",
      body: JSON.stringify({
        name: clubName,
        description: description,
        studentId: student?.student_id.toString()
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (!result.ok) {
      console.error("Failed to create club")
    }
  }

  const joinClub = async (clubId: bigint) => {

    const result = await fetch("api/club?type=joinClub", {
      method: "POST",
      body: JSON.stringify({
        studentId: student?.student_id.toString(),
        clubId: clubId.toString()
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    if (!result.ok) {
      console.error("Failed to join club")
    }
  }

  const submitEditClub = async () => {
    const result = await fetch("api/club?type=updateClub", {
      method: "POST",
      body: JSON.stringify({
        managerId: student?.student_id.toString(), // only managers are allowed to edit clubs
        newClubName: editClubName,
        newDescription: editDescription
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    if (!result.ok) {
      console.error("Failed to edit club")
    }
  }

  if (isLoading) return <Spinner />

  if (error) return <Text>Something went wrong!</Text>

  return (
    <>
      <Text fontSize={"4xl"} fontWeight={"bold"}>
        Clubs
      </Text>
      <VStack spacing={4}>
        {clubs.length ? (
          clubs.map((club) => (
            <Box
              key={club.club_id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
              minWidth="200px"
              maxWidth={"300px"}
            >
              <Flex justifyContent={"space-between"} alignItems={"center"} mb={"1rem"}>
              <Text fontWeight="bold">{club.club_name}</Text>
              {club.manager_id?.toString() === student?.student_id.toString() ? <IconButton aria-label="edit" icon={<HiPencil />} onClick={onEditOpen}/> : null}
              </Flex>
              <Text>{club.description}</Text>
              <Text>
                <strong>Created:</strong>{" "}
                {new Date(club.created_date).toLocaleDateString()}
              </Text>
              {club.membership_id ? (
                <Text mt={"0.5rem"} color={"green"}>Joined</Text>
              ) : (
                <Button mt={"0.5rem"} colorScheme="blue" onClick={(e) => {
                  e.preventDefault()
                  joinClub(club.club_id)}
                }>Join</Button>
              )}
            </Box>
          ))
        ) : (
          <Text>No clubs found. Create one below.</Text>
        )}
      </VStack>
      <Button
        leftIcon={<HiPlus />}
        colorScheme="teal"
        position="fixed"
        bottom="20px"
        right="20px"
        onClick={onOpen}
      >
        Create Club
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Club</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              mb={4}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={submitAddClub} mr={"0.5rem"}>Add</Button>
            <Button variant="ghost"onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit club modal*/}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit your Club</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Club Name"
              value={editClubName}
              onChange={(e) => setEditClubName(e.target.value)}
              mb={4}
            />
            <Input
              placeholder="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={submitEditClub} mr={"0.5rem"}>Add</Button>
            <Button variant="ghost"onClick={onEditClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// get all clubs, join button for each club that not already member of
// create club popup, if studente creates then automatic membership and manager role
