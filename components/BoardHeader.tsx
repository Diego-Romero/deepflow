import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  openNewColumnModal: () => void;
  openSettings: () => void;
  name: string;
}

export const BoardHeader: React.FC<Props> = ({
  openNewColumnModal,
  openSettings,
  name,
}) => {
  return (
    <Flex
      alignItems="center"
      mb={8}
      flexDir={["column", null, "row"]}
    >
      <Heading noOfLines={1} isTruncated mb={[6, null, 0]}>
        {name}
      </Heading>
      <ButtonGroup spacing={[2]} variant="solid" size={"md"} ml={[0, 0, 4]}>
        <Tooltip label="Open settings">
          <IconButton
            isRound
            aria-label="update"
            icon={<EditIcon />}
            onClick={openSettings}
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
      </ButtonGroup>
    </Flex>
  );
};