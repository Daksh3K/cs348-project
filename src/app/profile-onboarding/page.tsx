"use client";

import { useState } from "react";
import { Input, Button, VStack, Box, Card, CardBody } from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

export default function ProfileOnboarding() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter()

  const handleSubmit = async () => {
    const result = await fetch("api/student?type=addStudent", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: user?.email,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!result.ok) console.error("Failed to create user in database");
    const newUser = await result.json();
    if (!Object.entries(newUser).length) console.error("Failed to add a user");
    else router.push("/profile")
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Card width="400px">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
