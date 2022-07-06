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

      const { data: pollData }: GETPollResponse = await res.json();

      const optionIds = pollData.options.map((opt) => opt.id);

      return {
        labels: pollData.options.map((opt) => opt.label),
        datasets: [
          {
            label: "Votes",
            data: optionIds.map((id) => pollData.aggregatedVoteTotals[id]),
          },
        ],
      };
    },
    {
      enabled: id !== undefined,
      refetchInterval: () => 500,
    }
  );

  // useEffect(() => {
  //   var myChart = new Chart(table, config);

  //   return () => {
  //     myChart.destroy();
  //   };
  // }, []);

  return (
    <Center py="12">
      <Stack width="500px">
        <Heading>Poll {id}</Heading>

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
            <Bar data={data} />
          )}
        </Box>
      </Stack>
    </Center>
  );
};

export default Poll;
