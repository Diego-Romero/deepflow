import { Heading, Box, Flex, Divider } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Card } from '../Card';
import { getTodayIsoString } from '../../../utils/util-functions';
import Firebase from 'firebase';
import config from '../../../utils/config';
import { useAuthUser } from 'next-firebase-auth';
import { WorkedTime } from '../../../types';
import { debounce } from 'lodash';
import { BlockStyleControls } from './BlockStyleControls';
import { InlineStylesControl } from './InlineStylesControl';

interface Props {}

export const IntentionCard: React.FC<Props> = () => {
  const authUser = useAuthUser();
  const [editorState, setEditorState] = React.useState<EditorState>(() =>
    EditorState.createEmpty()
  );

  const [loading, setLoading] = useState(true);

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
    if (val && val.intention) {
      const raw = convertFromRaw(JSON.parse(val.intention));
      setEditorState(EditorState.createWithContent(raw));
    }
    setLoading(false);
  }

  const debouncedSave = useCallback(
    debounce((nextValue) => saveContent(nextValue), 500),
    []
  );

  const saveContent = async (currentState: EditorState) => {
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

  function _toggleBlockType(blockType: string) {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  }

  function _toggleInlineStyle(inlineStyle: string) {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  return (
    <Card loading={loading}>
      <Flex alignItems="flex-end" justifyContent="space-between" flexDir="row">
        <Heading size="md" mb={4}>
          Intention
        </Heading>
      </Flex>
      <Box borderWidth="1px" borderRadius="md" fontSize="sm">
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          bgColor="gray.800"
          color="white"
          borderTopRadius="md"
        >
          <BlockStyleControls
            editorState={editorState}
            onToggle={_toggleBlockType}
          />
          <InlineStylesControl
            editorState={editorState}
            onToggle={_toggleInlineStyle}
          />
        </Flex>
        <Divider />
        <Box
          p={3}
          borderEndRadius="md"
          bgColor="gray.50"
          sx={{
            'div.DraftEditor-root': {
              minH: '400px',
            },
            '.DraftEditor-root h1': {
              fontSize: '2xl',
              fontWeight: 'bold',
            },
            '.DraftEditor-root h2': {
              fontSize: 'xl',
              fontWeight: 'bold',
            },
            '.DraftEditor-root h3': {
              fontSize: 'large',
              fontWeight: 'bold',
            },
            '.DraftEditor-root blockquote': {
              fontsize: 'large',
              color: 'gray.600',
              borderLeftWidth: '3px',
              pl: '2',
            },
          }}
        >
          <Editor
            editorState={editorState}
            onChange={onChange}
            handleKeyCommand={handleKeyCommand}
            spellCheck={true}
            placeholder="What would you like to achieve today? Set out an intention for the day."
          />
        </Box>
      </Box>
    </Card>
  );
};
