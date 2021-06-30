import { ButtonGroup, Button, IconButton } from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import React from 'react';
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
} from 'react-icons/ai';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', icon: <AiOutlineBold /> },
  { label: 'Italic', style: 'ITALIC', icon: <AiOutlineItalic /> },
  { label: 'Underline', style: 'UNDERLINE', icon: <AiOutlineUnderline /> },
  // { label: 'Monospace', style: 'CODE' },
];

interface BlockStyleProps {
  editorState: EditorState;
  onToggle: (s: string) => void;
}

export const InlineStylesControl: React.FC<BlockStyleProps> = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <ButtonGroup variant="ghost" spacing="0" size="sm">
      {INLINE_STYLES.map((type) => (
        <IconButton
          key={type.style}
          onClick={() => props.onToggle(type.style)}
          icon={type.icon}
          fontSize="md"
          isActive={currentStyle.has(type.style)}
          aria-label={type.label}
        />
      ))}
    </ButtonGroup>
  );
};
