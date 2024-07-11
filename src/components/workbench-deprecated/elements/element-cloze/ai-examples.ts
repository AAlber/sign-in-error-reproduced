export function getExample(): any[] {
  return [
    {
      role: "user",
      content:
        "give me a Cloze task in the format of a parsable string in German with a difficulty of 4/10 for the input: Gib mir einen Lückentext für Planeten!",
    },
    {
      role: "assistant",
      content:
        '{"options": ["Unser Sonnensystem besteht aus acht Planeten. Der Planet, der der Sonne am nächsten ist, ist",", während der größte Planet in unserem Sonnensystem ", "ist. Der Planet mit den meisten bekannten Monden ist ",],"option": "."}',
    },
    {
      role: "user",
      content:
        "give me a Cloze task in the format of a parsable string in English with a difficulty of 7/10 for the input: Economics",
    },
    {
      role: "assistant",
      content:
        '{"options": ["Economics is the social science that studies how people use limited resources to satisfy unlimited wants. One of the fundamental concepts in economics is ",". It refers to the idea that people have to give up something in order to get something else. Another key concept is ", which measures the responsiveness of the quantity demanded of a good or service to a change in its price."],"option": "opportunity cost"}',
    },
    {
      role: "user",
      content:
        "give me a Cloze task in the format of a parsable string in Spanish with a difficulty of 7/10 for the input: Plato's Republic",
    },
    {
      role: "assistant",
      content:
        '{"options": ["Los ", " son un conjunto de diálogos filosóficos escritos por Platón. En estos diálogos, Platón desarrolla una teoría sobre la justicia y la naturaleza del hombre justo. El libro más conocido de esta colección es la ", " en la que se presenta la idea de que el mejor gobierno es aquel en el que los gobernantes son filósofos."], "option": "Platos republic, República"}',
    },
    {
      role: "user",
      content:
        "give me a Cloze task in the format of a parsable string in English with a difficulty of 4/10 for the input: Who is Greta Thunberg",
    },
    {
      role: "assistant",
      content:
        '{"options": ["Greta Thunberg is a young climate activist from ", ". She gained international attention for skipping school and protesting outside the Swedish parliament in ", ". Her movement, Fridays for Future, encourages students to ", " to raise awareness about the climate crisis."],"option": "Sweden, Stockholm, strike"}',
    },
    {
      role: "user",
      content:
        "give me a Cloze task in the format of a parsable string in German with a difficulty of 4/10 for the input: gib mir eine Aufgabe über den kalten Krieg",
    },
    {
      role: "assistant",
      content:
        '{"options": ["Der Kalte Krieg war eine politische Spannung zwischen den ", " und den sozialistischen Staaten, die von 1947 bis 1991 dauerte. Obwohl es keinen direkten ", " während dieses Zeitraums gab, gab es zahlreiche ", " und Wettrüsten. Einer der wichtigsten Konflikte war die Kuba-Krise im Jahr ", "."], "option": ["westlichen Staaten", "Krieg", "Proxykriege", "1962"]}',
    },
  ];
}
