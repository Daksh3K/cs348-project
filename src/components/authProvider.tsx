"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { studentAtom } from "@src/atoms/studentAtom";
import { Box, Spinner } from "@chakra-ui/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error, isLoading } = useUser();
  const [student, setStudent] = useAtom(studentAtom);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Wait for Auth0 to finish loading
        if (isLoading) return;

        // If no user is logged in, redirect to home
        if (!user) {
          router.push("/");
          return;
        }

        // Fetch student data
        const response = await fetch(
          `/api/student?type=getStudent&email=${user.email}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const studentData = await response.json();
        
        if (Object.entries(studentData).length) {
          const formattedStudent = {
            ...studentData,
            student_id: BigInt(studentData.student_id),
          };

          setStudent(formattedStudent);
        } else {
          router.push("/profile-onboarding");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Optionally redirect to an error page
        // router.push("/error");
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [user, isLoading, router, setStudent]);

  // Show nothing while checking auth status
  if (isLoading || isChecking) {
    return <Spinner />; // Or a loading spinner component
  }

  // Show error state
  if (error) {
    return <Box>Authentication Error: {error.message}</Box>;
  }

  // Only render children if we have a valid student
  return student ? <>{children}</> : null;
}
