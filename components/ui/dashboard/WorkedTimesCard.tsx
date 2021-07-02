import {
  Heading,
  Text,
  Box,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
  ListIcon,
  Stack,
  UnorderedList,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import React, { useState } from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { MdCheckCircle } from 'react-icons/md';
import { WorkedTimeWithDate } from '../../../types';
import {
  convertMinutesToHours,
  formatDateFromIso,
  getTodayIsoString,
} from '../../../utils/util-functions';
import { Card } from '../Card';

interface Props {
  workedTimes: WorkedTimeWithDate[];
  loading: boolean;
}

export const WorkedTimesCard: React.FC<Props> = (props) => {
  const { workedTimes, loading } = props;
  const todayIsoString = getTodayIsoString();
  const [activeRecord, setActiveRecord] = useState<null | WorkedTimeWithDate>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card maxHeight="80vh" loading={loading}>
      <Heading size="md" mb={4}>
        Records
      </Heading>
      <Accordion allowMultiple>
        {workedTimes && workedTimes.length > 0 ? (
          workedTimes.reverse().map((time) => (
            <Box key={time.date}>
              {todayIsoString !== time.date ? ( // only show if is not today
                <AccordionItem>
                  <AccordionButton px={0} py={2}>
                    <Box flex="1" textAlign="left">
                      <Text fontSize="sm" color="gray.600">
                        {todayIsoString === time.date ? (
                          'Today'
                        ) : (
                          <span>{formatDateFromIso(time.date)}</span>
                        )}
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} px={0}>
                    <List spacing={3} fontSize="sm" mb={3}>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="green.400" />
                        Pomodoros: <b>{time.count || 0}</b>
                      </ListItem>
                      <ListItem>
                        <ListIcon as={AiFillClockCircle} color="green.400" />
                        Time worked:{' '}
                        <b>{convertMinutesToHours(time.worked || 0)}</b>
                      </ListItem>
                    </List>
                    <Button
                      size="xs"
                      onClick={() => {
                        setActiveRecord(time);
                        onOpen();
                      }}
                    >
                      Details
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              ) : null}
            </Box>
          ))
        ) : (
          <>
            <Text size="sm">
              You currently have no records. <br />
              <br />
              Record your pomodoros and we will tell you how much progress you
              make each day.
              <br />
            </Text>
          </>
        )}
      </Accordion>
      {activeRecord && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Record</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4} fontSize="sm">
              <List spacing={3} fontSize="sm" mb={3}>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.400" />
                  Pomodoros: <b>{activeRecord!.count || 0}</b>
                </ListItem>
                <ListItem>
                  <ListIcon as={AiFillClockCircle} color="green.400" />
                  Time worked:{' '}
                  <b>{convertMinutesToHours(activeRecord!.worked || 0)}</b>
                </ListItem>
              </List>
              {activeRecord.intention && (
                <Stack spacing={2}>
                  <Divider />
                  <Text fontWeight="bold">Intention:</Text>
                  <Box borderWidth={1} p={2} borderRadius="md" fontSize="xs">
                    <Editor
                      editorState={EditorState.createWithContent(
                        convertFromRaw(JSON.parse(activeRecord.intention))
                      )}
                      readOnly={true}
                      onChange={() => {}}
                    />
                  </Box>
                </Stack>
              )}
              {activeRecord.notes && activeRecord.notes.length > 0 && (
                <Stack spacing={2} mt={4}>
                  <Divider />
                  <Text fontWeight="bold">Notes:</Text>
                  <UnorderedList pl={4} spacing={2}>
                    {activeRecord.notes.map((note, index) => (
                      <ListItem key={`note-${index}`}>
                        <Text>{note}</Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
};
