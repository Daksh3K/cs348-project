"use client";

import {
  Card,
  CardBody,
  Center,
  Heading,
  Button,
  Text,
  CardFooter,
  CardHeader,
} from "@chakra-ui/react";

import { useState } from "react";
import { helloWorld } from "@src/clients/Dao";

const HelloWorld = () => {
  const [message, setMessage] = useState<string | undefined>();

  const getMessage = async () => {
    const val = await helloWorld();
    setMessage(val);
  };

  return (
    <>
      <Center h={"100vh"}>
        <Card>
          <CardBody>
            <CardHeader>
              <Heading>{message}</Heading>
            </CardHeader>
            <CardFooter>
              <Button onClick={getMessage}>Get Message!</Button>
            </CardFooter>
          </CardBody>
        </Card>
      </Center>
    </>
  );
};

export default HelloWorld;
