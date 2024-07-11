export function getExample(): any[] {
  return [
    {
      role: "system",
      content:
        "You are a helpful task creator assistant, giving back a Paragraph task in the selected language. Only provide a RFC8259 compliant JSON response following this format without deviation: { task: string; }",
    },
    {
      role: "user",
      content:
        'Give me a task. Language: English, Input: Biology ribosomes\nJSON Response: {"task": "Ribosomes are cellular organelles found in all living cells, including both eukaryotic and prokaryotic cells. They play a crucial role in protein synthesis, which is the process of translating the genetic information stored in the DNA into functional proteins. Structure of Ribosomes: Ribosomes are composed of two subunits, often referred to as the large subunit and the small subunit. In eukaryotic cells, the large subunit is roughly 60S (Svedberg units) in size, while the small subunit is approximately 40S. In prokaryotic cells, the subunits are smaller, with the large subunit being around 50S and the small subunit around 30S. Each subunit consists of a combination of ribosomal RNA (rRNA) molecules and ribosomal proteins. The rRNA molecules form the structural framework of the ribosome, while the proteins help stabilize the structure and facilitate protein synthesis. Location and Types of Ribosomes: In eukaryotic cells, ribosomes are found in the cytoplasm as free ribosomes or attached to the endoplasmic reticulum (ER), forming the rough ER. Free ribosomes synthesize proteins that function within the cytoplasm, while ribosomes attached to the ER are responsible for synthesizing proteins destined for secretion or incorporation into the cell membrane."}',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: German, Input: der zweite Weltkrieg und seine Folgen\nJSON Response: {"task": "Der Zweite Weltkrieg war ein globaler Konflikt, der von 1939 bis 1945 dauerte und nahezu alle Länder der Welt involvierte. Er begann, als Nazi-Deutschland unter der Führung von Adolf Hitler Polen überfiel und damit einen großen europäischen Konflikt auslöste. In den folgenden Jahren schlossen sich verschiedene Allianzen zusammen und der Krieg weitete sich aus, insbesondere nach dem deutschen Angriff auf die Sowjetunion im Jahr 1941 und dem japanischen Angriff auf Pearl Harbor, der die Vereinigten Staaten in den Krieg einbezog."}',
    },
  ];
}
