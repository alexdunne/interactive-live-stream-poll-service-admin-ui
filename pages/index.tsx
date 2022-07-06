import type { NextPage } from "next";
import { FieldArray, Form, Formik } from "formik";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Center,
  useColorModeValue,
  Box,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

interface NewPollData {
  question: string;
  options: string[];
}

interface NewPollResponse {
  id: string;
}

const Home: NextPage = () => {
  const router = useRouter();

  const createPollMutation = useMutation<NewPollResponse, unknown, NewPollData>(
    async (newPoll) => {
      const res = await fetch(`/api/polls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPoll),
      });

      return res.json();
    },
    {
      onSuccess(data) {
        router.push(`/polls/${data.id}`);
      },
      onError(error) {
        console.log(error);
      },
    }
  );

  return (
    <Center py="12">
      <Stack width="500px">
        <Heading>Live Stream Poll Admin</Heading>

        <Box
          p={6}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
        >
          <PollForm
            onSubmit={async (newPollData) => {
              await createPollMutation.mutateAsync(newPollData);
            }}
          />
        </Box>
      </Stack>
    </Center>
  );
};

interface PollFormProps {
  onSubmit: (data: NewPollData) => Promise<void>;
}

const PollForm = (props: PollFormProps) => {
  return (
    <Formik
      initialValues={{
        question: "",
        options: ["", "", "", ""],
      }}
      onSubmit={(values) => {
        props.onSubmit(values);
      }}
    >
      {({ values, handleChange }) => {
        return (
          <Form>
            <Stack spacing={4}>
              <Box>
                <FormControl>
                  <FormLabel htmlFor="question">Question</FormLabel>
                  <Input
                    id="question"
                    name="question"
                    type="text"
                    placeholder="How many legs does a spider have?"
                    onChange={handleChange}
                    value={values.question}
                  />
                </FormControl>
              </Box>

              <Box>
                <FormControl>
                  <FormLabel>Options</FormLabel>
                  <FieldArray
                    name="options"
                    render={() => (
                      <div>
                        {values.options.map((option, index) => (
                          <Box key={index} pb="2">
                            <Input
                              id={`options.${index}`}
                              name={`options.${index}`}
                              type="text"
                              placeholder={`Possible answer #${index + 1}`}
                              onChange={handleChange}
                              value={option[index]}
                            />
                          </Box>
                        ))}
                      </div>
                    )}
                  />
                </FormControl>
              </Box>

              <Button type="submit" colorScheme="teal">
                Create poll
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Home;
