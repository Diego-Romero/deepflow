import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  Text
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdPlay } from "react-icons/io";

interface Props {
  openNewColumnModal: () => void;
  openSettings: () => void;
}

export const BoardHeader: React.FC<Props> = ({
  openNewColumnModal,
  openSettings,
}) => {
  const [time, setCurrentTime] = useState(Date.now());

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      mb={8}
      flexDir={["column", null, "row"]}
    >
      <Heading noOfLines={1} isTruncated mb={[6, null, 0]}>
        Board name goes here
      </Heading>
      <Flex p={4} border="1px" borderRadius="md" borderColor="ButtonFace">
        <Text fontSize="2xl">
          25:00
        </Text>
      </Flex>
      <ButtonGroup spacing={[2]} variant="outline" size={"lg"}>
        <Tooltip label="Start Pomodoro">
          <IconButton
            isRound
            aria-label="Start"
            colorScheme="purple"
            variant="solid"
            icon={<IoMdPlay />}
          />
        </Tooltip>
        <Tooltip label="Add Row">
          <IconButton
            isRound
            onClick={openNewColumnModal}
            aria-label="Add row"
            colorScheme="purple"
            icon={<AddIcon />}
          />
        </Tooltip>
        <Tooltip label="Open settings">
          <IconButton
            isRound
            aria-label="Settings"
            icon={<SettingsIcon />}
            onClick={openSettings}
          />
        </Tooltip>
      </ButtonGroup>
    </Flex>
  );
};
