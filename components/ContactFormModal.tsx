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
} from "@chakra-ui/react";
import React from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { validation } from "../utils/validations";
import { getFirebaseAdmin } from "next-firebase-auth";

export interface ContactFormValues {
  message: string;
  email: string;
}

const initialValues: ContactFormValues = {
  message: "",
  email: "",
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
  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");

  async function submitMessage(values: ContactFormValues, actions) {
    console.log(values);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        credentials: "same-origin", // include, *same-origin, omit
        body: JSON.stringify(values),
      });
      console.log(res.json());
      actions.setSubmitting(false);
      modalClose();
      // await sendContactMessageRequest(values);
      // toast(
      //   toastConfig(
      //     "Thank you!",
      //     "info",
      //     "I will try to get back to you as soon as possible."
      //   )
      // );
    } catch (_err) {
      console.log(_err);
      // toast(
      //   toastConfig(
      //     "Yikes..",
      //     "warning",
      //     "There has been an error submitting your message please try again later."
      //   )
      // );
    }
  }

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="xl">
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
              submitMessage(values);
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
                      <FormLabel htmlFor="name">Email</FormLabel>
                      <Input
                        {...field}
                        type="email"
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
                    >
                      <FormLabel htmlFor="message">Message</FormLabel>
                      <Textarea
                        rows={6}
                        placeholder="Your feedback is incredibly valuable to me, thanks!"
                        size="md"
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
                  bgGradient="linear(to-r, cyan.700,purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, cyan.600,purple.400)",
                  }}
                  color="white"
                  isLoading={props.isSubmitting}
                >
                  Send
                </Button>
                <Button
                  mt={4}
                  mb={4}
                  colorScheme="gray"
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
