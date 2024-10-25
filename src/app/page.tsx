import NextLink from "next/link";
import { Center, Link } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"20rem"}>
      <Link as={NextLink} href="/hello" color="teal.500">
        Goto Hello World
      </Link>
    </Center>
  );
}
