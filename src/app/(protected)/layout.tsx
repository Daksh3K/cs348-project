'use client'
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Link,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text
} from '@chakra-ui/react'
import { HiMenu as HamburgerIcon, HiX as CloseIcon, HiPlus as AddIcon } from 'react-icons/hi'
import AuthProvider from "@src/components/authProvider";
import React from 'react';

interface Props {
  children: React.ReactNode,
  goto: string
}

const Links = {"Events": "events", "Clubs": "clubs"}

const NavLink = (props: Props) => {
  const { children, goto } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={goto}>
      {children}
    </Box>
  )
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Text fontWeight={"bold"} fontSize={"lg"} color='teal'>BoilerEvents</Text>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Object.entries(Links).map(([name, link]) => (
                <NavLink key={link} goto={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Link href="/profile">
              <Avatar
                size={'sm'}
                src={
                  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                }
              />
            </Link>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Object.entries(Links).map(([name, link]) => (
                <NavLink key={name} goto={link}>{name}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>
      <AuthProvider>{ children }</AuthProvider>
      </Box>
    </>
  )
}