import {
  Flex,
  Text,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
  Box,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
}

export const KeymapModal: React.FC<Props> = ({ modalOpen, modalClose }) => {
  const keyMaps = [
    { text: "Create new list", key1: "CTRL", key2: "N" },
    { text: "Create new list item", key1: "SPACE" },
    { text: "Focus list 1-9", key1: "1 - 9" },
    { text: "Move down list items", key1: "DOWN", orKey2: "J" },
    { text: "Move up list items", key1: "UP", orKey2: "K" },
    { text: "Delete list item", key1: "BACKSPACE", orKey2: "X" },
    { text: "Update list item", key1: "U", orKey2: "O" },
    { text: "Toggle item done/undone", key1: "D" },
    { text: "Open Keymap", key1: "CTRL", key2: "K" },
    { text: "Light mode", key1: "CTRL", key2: "L" },
    { text: "Dark mode", key1: "CTRL", key2: "D" },
    { text: "Open Side Nav", key1: "CTRL", key2: "O" },
    { text: "Close Side Nav", key1: "CTRL", key2: "B" },
  ];

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shortcuts</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {keyMaps.map((keyMap) => (
            <Box key={keyMap.text}>
              <Flex alignItems="center" justifyContent="space-between" mb={4}>
                <Text>{keyMap.text}</Text>
                <span>
                  <Kbd>{keyMap.key1}</Kbd>
                  {keyMap.key2 ? (
                    <span>
                      {" "}
                      + <Kbd>{keyMap.key2}</Kbd>
                    </span>
                  ) : null}
                  {keyMap.orKey2 ? (
                    <span>
                      {" "}
                      or <Kbd>{keyMap.orKey2}</Kbd>
                    </span>
                  ) : null}
                </span>
              </Flex>
              <Divider mb={4} />
            </Box>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
