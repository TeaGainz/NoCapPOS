import { Container, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";

const Navbar = () => {
  return (
    <Container maxH={"1140px"}>
      <Flex
        h={16}
        alignItems={"left"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "column" }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"left"}
          bgGradient={"linear(to-r, teal.500, blue.500"}
          bgClip={"text"}
        >
          <Link to={"/"}>Dashboard</Link>
        </Text>
          <HStack spacing={2} alignItems={"center"}>
            <Link to={"/Inventory"}>
            <Button>
            <MdOutlineShoppingCart fontSize={20}/>

            </Button>
            </Link>
          </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;