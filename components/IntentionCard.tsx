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
  // workedTimes: WorkedTimeWithDate[];
  // loading: boolean;
}

export const IntentionCard: React.FC<Props> = (props) => {
  // const { workedTimes, loading } = props;
  return (
    <Card maxHeight="80vh">
      <Heading size="md" mb={4}>
        Intention
      </Heading>
    </Card>
  );
};
