import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import axios from 'axios';
import { toastConfig } from '../../../utils/toastConfig';
import { validation } from '../../../utils/util-functions';

export interface ContactFormValues {
  message: string;
  email: string;
}

const initialValues: ContactFormValues = {
  message: '',
  email: '',
};

const validationSchema = Yup.object().shape({
  email: validation.email,
  message: validation.description,
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
}

export const ContactFormModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
}) => {
  const toast = useToast();
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');

  async function submitMessage(values: ContactFormValues, actions) {
    try {
      await axios.post('/api/contact', values);
      actions.setSubmitting(false);
      modalClose();
      toast(
        toastConfig(
          'Thank you!',
          'success',
          'I will try to get back to you as soon as possible.'
        )
      );
    } catch (_err) {
      toast(
        toastConfig(
          'Yikes..',
          'warning',
          'There has been an error submitting your message please try again later.'
        )
      );
    }
  }

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              submitMessage(values, actions);
            }}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      id="email"
                      isRequired
                      isInvalid={form.errors.email && form.touched.email}
                    >
                      <FormLabel size="sm" htmlFor="name">
                        Email
                      </FormLabel>
                      <Input
                        {...field}
                        type="email"
                        size="sm"
                        autoFocus={isLargerThan480}
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="message">
                  {({ field, form }) => (
                    <FormControl
                      id="message"
                      isRequired
                      isInvalid={form.errors.message && form.touched.message}
                      size="sm"
                      mt={4}
                    >
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <Textarea
                        size="sm"
                        rows={6}
                        placeholder="Your feedback is incredibly valuable to me, thanks!"
                        {...field}
                      />
                      <FormErrorMessage>
                        {form.errors.description}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  isFullWidth
                  type="submit"
                  size="sm"
                  // variant="outline"
                  isLoading={props.isSubmitting}
                  colorScheme="blackAlpha"
                  _hover={{
                    bgColor: 'gray.700',
                  }}
                  bgColor="gray.900"
                  color="white"
                >
                  Send
                </Button>
                <Button
                  mt={4}
                  mb={4}
                  colorScheme="gray"
                  size="sm"
                  variant="outline"
                  isFullWidth
                  isLoading={props.isSubmitting}
                  onClick={modalClose}
                >
                  Cancel
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
        {/* todo: add image at the bottom, test how it would look like */}
        {/* <Center>
          <Image boxSize={["200px"]} src={logo} alt="Register" />
        </Center> */}
      </ModalContent>
    </Modal>
  );
};
