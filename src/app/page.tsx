import NextLink from "next/link";
import { Stack, Center, Link } from "@chakra-ui/react";

export default function Home() {
  return (
    <Center h={"20rem"}>
      <Stack>
        <Link as={NextLink} href="/hello" color="teal.500">
          Hello World
        </Link>
        <Link href="/api/auth/login?returnTo=/login-redirect" color="teal.500">
          Login
        </Link>
      </Stack>
    </Center>
  );
}
