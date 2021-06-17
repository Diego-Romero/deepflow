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
      mb={4}
      flexDir={"row"}
    >
      <Heading noOfLines={1} isTruncated mb={0} casing="uppercase" >
        {name}
      </Heading>
      <ButtonGroup spacing={[2]} variant="solid" size={"md"} ml={4}>
        <Tooltip label="Open settings">
          <IconButton
            isRound
            aria-label="update"
            icon={<EditIcon />}
            variant="outline"
            onClick={openSettings}
          />
        </Tooltip>
        {/* <Tooltip label="Add Row">
          <IconButton
            isRound
            onClick={openNewColumnModal}
            variant="outline"
            aria-label="Add row"
            colorScheme="purple"
            icon={<AddIcon />}
          />
        </Tooltip> */}
      </ButtonGroup>
    </Flex>
  );
};
