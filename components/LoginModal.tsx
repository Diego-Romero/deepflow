import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import FirebaseAuth from "./FirebaseAuth";

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
}

export const LoginModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
}) => {

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login / Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8} onClick={modalClose}>
          <FirebaseAuth />
        </ModalBody>
        {/* <Center>
          <Image boxSize={["200px"]} src={logo} alt="Register" />
        </Center> */}
      </ModalContent>
    </Modal>
  );
};
