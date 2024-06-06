import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

interface WordState {
  word: string;
  definition: string;
  example: string;
  url?: string;
}

export default function Vocab({wordState} : {wordState: WordState}) {
  return (
    <Card className="">
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
              wordState.url
                ? wordState.url
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
