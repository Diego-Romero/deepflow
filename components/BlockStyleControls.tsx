import { ButtonGroup, Button, IconButton } from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import React from 'react';
import { AiOutlineOrderedList, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiCode } from 'react-icons/bi';

const BLOCK_TYPES = [
  // { label: 'H1', style: 'header-one' },
  // { label: 'H2', style: 'header-two' },
  // { label: 'H3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  // { label: 'H6', style: 'header-six' },
  // { label: 'Blockquote', style: 'blockquote' },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: <AiOutlineUnorderedList />,
  },
  { label: 'OL', style: 'ordered-list-item', icon: <AiOutlineOrderedList /> },
  { label: 'Code Block', style: 'code-block', icon: <BiCode /> },
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
        <IconButton
          onClick={() => props.onToggle(type.style)}
          isActive={blockType === type.style}
          icon={type.icon}
          fontSize="xl"
          key={type.style}
          aria-label={type.label}
        />
      ))}
    </ButtonGroup>
  );
};
