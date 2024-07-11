import type { EmojiMartData } from "@emoji-mart/data";
import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";
import { Shuffle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { categorizeEmojis } from "@/src/client-functions/client-utils";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";

init({ data });

const EmojiSelector = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categorizedResults, setCategorizedResults] = useState<{
    [category: string]: string[];
  }>({});
  const typedData = data as EmojiMartData;

  useEffect(() => {
    const search = async (value: string) => {
      let searchResults;
      if (value) {
        searchResults = await SearchIndex.search(value);
      } else {
        searchResults = Object.values(typedData.emojis);
      }

      setCategorizedResults(categorizeEmojis(searchResults, typedData));
    };

    search(searchTerm);
  }, [searchTerm]);

  const hasResults = () => {
    return Object.values(categorizedResults).some(
      (emojis) => emojis.length > 0,
    );
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex w-full items-center gap-2">
        <Input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          placeholder="Search emoji"
        />
        <Button
          size={"icon"}
          onClick={() =>
            onSelect(
              Object.values(categorizedResults).flat()[
                Math.floor(
                  Math.random() *
                    Object.values(categorizedResults).flat().length,
                )
              ],
            )
          }
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative h-[400px] w-full overflow-scroll">
        {hasResults() ? (
          Object.entries(categorizedResults).map(([category, emojis]) => {
            if (emojis.length === 0) {
              return null;
            }

            return (
              <div key={category} className="mt-2">
                <h2 className="mt-2 text-sm text-muted-contrast first-letter:uppercase">
                  {category}
                </h2>
                <div className="relative grid w-full grid-cols-11 text-center">
                  {emojis.map((emoji, index) => (
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="text-2xl saturate-[0.9]"
                      key={index}
                      onClick={() => onSelect(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="mt-4 text-center">
            <p className="text-contrast">
              No results for <strong>{searchTerm}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiSelector;
