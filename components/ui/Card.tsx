import { Box, CircularProgress, Flex } from '@chakra-ui/react';
import React from 'react';

interface Props {
  maxHeight?: string;
  loading?: boolean;
}

export const Card: React.FC<Props> = ({
  children,
  maxHeight = 'auto',
  loading = false,
}) => (
  <Box
    borderStyle="solid"
    borderRadius="12px"
    maxHeight={maxHeight}
    overflow="auto"
    p={6}
    shadow="md"
    borderColor="gray.200"
    bgColor="white"
    borderWidth="1px"
  >
    {loading ? (
      <Flex justifyContent="center" alignItems="center">
        <Box>
          <CircularProgress isIndeterminate color="gray.900" />
        </Box>
      </Flex>
    ) : (
      <Box height="100%">{children}</Box>
    )}
  </Box>
);
