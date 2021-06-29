import {
  Heading,
  Box,
  ButtonGroup,
  IconButton,
  Divider,
  Flex,
} from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Card } from './Card';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';
import { getTodayIsoString } from '../utils/util-functions';
import Firebase from 'firebase';
import config from '../utils/config';
import { useAuthUser } from 'next-firebase-auth';
import { WorkedTime } from '../types';
import { debounce } from 'lodash';

interface Props {}

export const IntentionCard: React.FC<Props> = () => {
  const authUser = useAuthUser();
  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    EditorState.createEmpty()
  );

  const todayWorkedTimeRef = Firebase.database().ref(
    config.collections.userWorkTimeYesterday(
      authUser.id as string,
      getTodayIsoString()
    )
  );

  useEffect(() => {
    setContentFromFirebase();
  }, []);

  async function setContentFromFirebase() {
    const workedTimeToday = await todayWorkedTimeRef.get();
    const val = workedTimeToday.val() as WorkedTime;
    if (val.intention) {
      const raw = convertFromRaw(JSON.parse(val.intention));
      setEditorState(EditorState.createWithContent(raw));
    }
  }

  const debouncedSave = useCallback(
    debounce((nextValue) => saveContent(nextValue), 500),
    []
  );

  const saveContent = async (currentState: EditorState) => {
    console.log('saving');
    const contentState = currentState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const parsed = JSON.stringify(raw);
    todayWorkedTimeRef.update({ intention: parsed });
  };

  const onChange = (newState: EditorState) => {
    setEditorState(newState);
    debouncedSave(newState);
  };

  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  function makeTextBold() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  // const { workedTimes, loading } = props;
  return (
    <Card maxHeight="80vh">
      <Flex
        alignItems="flex-start"
        justifyContent="space-between"
        flexDir="row"
      >
        <Heading size="md" mb={4}>
          Intention
        </Heading>
        {/* <InfoIcon w={4} h={4} /> */}
      </Flex>
      <Box
        gridTemplateRows="auto 1fr"
        borderWidth="1px"
        borderRadius="md"
        fontSize="sm"
        height="85%"
      >
        <ButtonGroup variant="ghost" spacing="0" size="sm">
          <IconButton
            onClick={makeTextBold}
            aria-label="Bold"
            icon={<AiOutlineBold />}
          />
          <IconButton
            onClick={makeTextBold}
            aria-label="Italic"
            icon={<AiOutlineItalic />}
          />
        </ButtonGroup>
        <Divider />
        <Box p={3}>
          <Editor
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="What would you like to achieve today? Set out an intention for the day."
          />
        </Box>
      </Box>
    </Card>
  );
};
