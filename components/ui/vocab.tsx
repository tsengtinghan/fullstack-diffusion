import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

interface WordState {
  word: string;
  definition: string;
  example: string;
  url?: string;
}

export default function Vocab({ wordState }: { wordState: WordState }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="cardContent">
        <div className="front">
          <div className="overflow-hidden rounded-md">
            <Image
              src={wordState.url ? wordState.url : "/auspicious.png"}
              alt="word"
              width={300}
              height={300}
            />
          </div>
        </div>
        <div className="back">
          <Card>
            <CardHeader>
              <CardTitle>{wordState.word}</CardTitle>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
