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
  Flex,
  CircularProgress,
} from '@chakra-ui/react';
import React from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { MdCheckCircle } from 'react-icons/md';
import { WorkedTimeWithDate } from '../types';
import {
  convertMinutesToHours,
  formatDateFromIso,
} from '../utils/util-functions';
import { Card } from './Card';

interface Props {
  workedTimes: WorkedTimeWithDate[];
  loading: boolean;
}

export const WorkedTimesCard: React.FC<Props> = (props) => {
  const { workedTimes, loading } = props;
  return (
    <Card maxHeight="80vh" loading={loading}>
      <Heading size="md" mb={4}>
        Records 
      </Heading>
      <Accordion defaultIndex={[0]} allowMultiple>
        {workedTimes && workedTimes.length > 0 ? (
          workedTimes.reverse().map((time) => (
            <AccordionItem key={time.date}>
              <AccordionButton px={0} py={2}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="sm" color="gray.600">
                    {formatDateFromIso(time.date)}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px={0}>
                <List spacing={3} fontSize="sm">
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.400" />
                    Pomodoros: <b>{time.count}</b>
                  </ListItem>
                  <ListItem>
                    <ListIcon as={AiFillClockCircle} color="green.400" />
                    Time worked: <b>{convertMinutesToHours(time.worked)}</b>
                  </ListItem>
                </List>
              </AccordionPanel>
            </AccordionItem>
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
    </Card>
  );
};
