import {
  Box,
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GETPollResponse {
  data: {
    id: string;
    question: string;
    options: {
      id: string;
      label: string;
    }[];
    aggregatedVoteTotals: {
      [key: string]: number;
    };
  };
}

const Poll: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, isError, data, error } = useQuery(
    ["poll", id],
    async () => {
      const res = await fetch(`/api/polls/${id}`, {
        headers: {
          "cache-control": "no-cache",
        },
      });

      const data: GETPollResponse = await res.json();
      return data.data;
    },
    {
      enabled: id !== undefined,
      refetchInterval: () => 500,
    }
  );

  const graphData = useMemo(() => {
    if (!data) {
      return null;
    }

    const optionIds = data.options.map((opt) => opt.id);

    return {
      labels: data.options.map((opt) => opt.label),
      datasets: [
        {
          label: "Votes",
          data: optionIds.map((id) => data.aggregatedVoteTotals[id]),
        },
      ],
    };
  }, [data]);

  return (
    <Center py="12">
      <Stack width="500px">
        <Heading>Poll</Heading>

        <Box
          p={6}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
        >
          {isLoading || !data ? (
            <Text>Loading...</Text>
          ) : isError ? (
            <Text>{error as any}</Text>
          ) : (
            <Stack>
              <Heading as="h2" fontSize="lg">
                {data.question}
              </Heading>
              <Bar data={graphData as any} />
            </Stack>
          )}
        </Box>
      </Stack>
    </Center>
  );
};

export default Poll;
