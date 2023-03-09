import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Image,
  useDisclosure,
  Center,
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  Divider,
  MenuList,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import logo from "../logo/Text_Black.png";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { CustomToast } from "./toast/toast";
import { Link } from "react-router-dom";

//Firebase Imports
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";

import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  doc,
  where,
  setDoc,
} from "firebase/firestore";
const provider = new GoogleAuthProvider();

function Navbar() {
  const { addToast } = CustomToast();
  const [seed, setSeed] = useState(1);
  const reset = () => {
    setSeed(Math.random());
  };
  const [userInfo, setuserInfo] = useState([]);

  useEffect(() => {
    // Having user data after refreshing
    if (sessionStorage.getItem("userInfo") != null) {
      setuserInfo(JSON.parse(sessionStorage.getItem("userInfo") || "{}"));
    } else {
      //There is no user Info
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // User Information
        const user = result.user;

        // Database Handler
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("id", "==", user.uid));
        const docs = await getDocs(q);

        if (user != null) {
          // Checks if the user is already added to the db
          if (docs.docs.length === 0) {
            // User has not been found in the database before
            const data = {
              id: user.uid,
              name: user.displayName,
              authProvider: "Google",
              email: user.email,
              createdAt: serverTimestamp(),
              isAdmin: false,
            };
            await setDoc(doc(db, "users", user.uid), data)
              .then(() => {
                // New User has been added to the database
                addToast({
                  message: "Account created.",
                  type: "success",
                });
                sessionStorage.setItem("isLogin", "true");
                sessionStorage.setItem("userInfo", JSON.stringify(user));
                setuserInfo(
                  JSON.parse(sessionStorage.getItem("userInfo") || "{}")
                );
              })
              .catch((error) => {
                console.log("error", error);
                sessionStorage.setItem("isLogin", "false");
                addToast({
                  message: error,
                  type: "error",
                });
              });
          }
          if (sessionStorage.getItem("isLogin") === "true") {
            //Already displayed account created.
            console.log(sessionStorage.getItem("isLogin"));
          } else {
            sessionStorage.setItem("isLogin", "true");
            addToast({
              message: "Logged In.",
              type: "success",
            });
            sessionStorage.setItem("userInfo", JSON.stringify(user));
            setuserInfo(JSON.parse(sessionStorage.getItem("userInfo") || "{}"));
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        // Handle Errors
        const errorCode = error.code;
        const errorMessage = error.message;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode);
        console.log(errorMessage);
        console.log(credential);
        sessionStorage.setItem("isLogin", "false");
        addToast({
          message: errorMessage,
          type: "error",
        });
      });
  };

  const handleLogout = (val: EventTarget) => {
    signOut(auth)
      .then(() => {
        sessionStorage.setItem("isLogin", "false");
        reset();
        addToast({
          message: "Logged out.",
          type: "success",
        });
      })
      .catch((error) => {
        console.log("error", error);
        addToast({
          message: error,
          type: "error",
        });
      });
  };
  const { isOpen, onToggle } = useDisclosure();
  const linkColor = useColorModeValue("gray.600", "gray.200");
  return (
    <>
      <Box key={seed}>
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          align={"center"}
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Link to={"/"} color={linkColor}>
              <Image w={"100px"} src={logo}></Image>
            </Link>
            <Flex display={{ base: "none", md: "flex" }} ml={10} mt={2}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            {sessionStorage.getItem("isLogin") === "true" ? (
              <>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={(userInfo as any).photoURL} />
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Avatar size={"2xl"} src={(userInfo as any).photoURL} />
                    </Center>
                    <Center>
                      <b>{(userInfo as any).displayName}</b>
                    </Center>
                    <MenuDivider />
                    <MenuItem>Your Community</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem onClick={(e) => handleLogout(e.target)}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  onClick={handleLogin}
                  as={"a"}
                  fontSize={"sm"}
                  fontWeight={600}
                  variant={"outline"}
                  href={"#login"}
                  leftIcon={<FcGoogle />}
                >
                  <Center>
                    <Text>Login</Text>
                  </Center>
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </>
  );
}
const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link to={navItem.href ?? "#"} color={linkColor}>
                <Text _hover={{ color: "green.400" }} fontWeight={500}>
                  {navItem.label}
                </Text>
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link to={href!} role={"group"}>
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "green.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"green.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Divider />
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} to={child.href!}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Suggestion",
    href: "/suggestion",
  },
  {
    label: "Community",
    children: [
      {
        label: "Review Wall",
        subLabel: "Newest & Popular review from others",
        href: "/reviewwall",
      },
      {
        label: "Community Wall",
        subLabel: "Only for avid readers",
        href: "/communitywall",
      },
    ],
  },
];
export default Navbar;
