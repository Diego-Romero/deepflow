import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import React from 'react';
import { Formik, Form, Field } from 'formik';

export interface PomodoroNotesValues {
  note: string;
}

const initialValues: PomodoroNotesValues = {
  note: '',
};

const validationSchema = Yup.object().shape({
  note: Yup.string().min(1, 'Add at least a few words to your note'),
});

interface Props {
  close: () => void;
  saveNote: (note: string) => void;
}

export const PomodoroNotesForm: React.FC<Props> = (props) => {
  const { close, saveNote } = props;
  return (
    <Stack
      py={4}
      px={6}
      bgColor="gray.700"
      borderRadius="lg"
      color="white"
      spacing={4}
    >
      <Stack spacing={2}>
        <Text size="xs">
          Pomodoro done, would you like to add a reflection note?
        </Text>
      </Stack>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, actions) => {
          saveNote(values.note);
          actions.setSubmitting(false);
        }}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form>
            <Field name="note">
              {({ field, form }) => (
                <FormControl
                  id="note"
                  isInvalid={form.errors.note && form.touched.note}
                  size="sm"
                >
                  <FormLabel htmlFor="note">Message</FormLabel>
                  <Textarea
                    size="sm"
                    autoFocus={true}
                    rows={4}
                    placeholder="What would have you achieved if you would have focused this whole time?"
                    {...field}
                  />
                  <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              isFullWidth
              type="submit"
              size="sm"
              colorScheme="blue"
              isLoading={props.isSubmitting}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
      <Button
        size="sm"
        variant="solid"
        colorScheme="whiteAlpha"
        onClick={() => close()}
      >
        No thanks!
      </Button>
    </Stack>
  );
};
