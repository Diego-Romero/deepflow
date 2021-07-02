import { ButtonGroup, Button, IconButton } from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import React from 'react';
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiCode } from 'react-icons/bi';
import { CgQuote } from 'react-icons/cg';

const BLOCK_TYPES = [
  { label: 'h1', style: 'header-one' },
  { label: 'h2', style: 'header-two' },
  { label: 'h3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  // { label: 'H6', style: 'header-six' },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: <AiOutlineUnorderedList />,
  },
  { label: 'OL', style: 'ordered-list-item', icon: <AiOutlineOrderedList /> },
  { label: 'Code Block', style: 'code-block', icon: <BiCode /> },
  { label: 'Blockquote', style: 'blockquote', icon: <CgQuote /> },
];

interface BlockStyleProps {
  editorState: EditorState;
  onToggle: (s: string) => void;
}

export const BlockStyleControls: React.FC<BlockStyleProps> = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();

  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <ButtonGroup variant="ghost" spacing="0" size="sm">
      {BLOCK_TYPES.map((type) => (
        <>
          {type.icon ? (
            <IconButton
              onClick={() => props.onToggle(type.style)}
              colorScheme="whiteAlpha"
              color="white"
              isActive={blockType === type.style}
              icon={type.icon}
              fontSize="xl"
              key={type.style}
              aria-label={type.label}
            />
          ) : (
            <Button
              onClick={() => props.onToggle(type.style)}
              colorScheme="whiteAlpha"
              color="white"
              isActive={blockType === type.style}
              fontSize="sm"
              key={type.style}
              aria-label={type.label}
            >
              {type.label}
            </Button>
          )}
        </>
      ))}
    </ButtonGroup>
  );
};
