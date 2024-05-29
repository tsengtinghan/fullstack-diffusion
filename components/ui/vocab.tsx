import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

interface WordState {
  word: string;
  definition: string;
  example: string;
}

interface Prediction {
  id?: string;
  status?: "succeeded" | "failed";
  output?: string[];
  detail?: string;
  logs?: string;
}


export default function Vocab({ wordState, prediction }: { wordState: WordState; prediction: Prediction }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{wordState?.word}</CardTitle>
      </CardHeader>
      <CardContent className="grid w-full items-center gap-2">
        <Label htmlFor="Definition" className="font-bold">
          Definition
        </Label>
        <p className="text-sm">{wordState?.definition}</p>
        <Label htmlFor="Example Sentence" className="font-bold">
          Example Sentence
        </Label>
        <p className="text-sm">{wordState?.example}</p>

        <div className="overflow-hidden rounded-md">
          <Image
            src={
              prediction && prediction.output
                ? prediction.output[prediction.output.length - 1]
                : "/auspicious.png"
            }
            alt="word"
            width={300}
            height={300}
          />
        </div>
      </CardContent>
    </Card>
  );
}
