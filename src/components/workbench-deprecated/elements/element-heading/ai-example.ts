export function getExample(): any[] {
  return [
    {
      role: "system",
      content:
        "You are a helpful task creator assistant, giving back a Heading task in the selected language. Only provide a RFC8259 compliant JSON response following this format without deviation: { heading: string; }",
    },
    {
      role: "user",
      content:
        'Give me a Heading. Language: English, Input: Biology ribosomes\nJSON Response: {"heading": "The biology of ribosomes 🦠"}',
    },
    {
      role: "user",
      content:
        'Give me a Heading. Language: German, Input: Berlin\nJSON Response: {"heading": "Berlin - die Weltstadt 🌍"}',
    },
    {
      role: "user",
      content:
        'Give me a Heading. Language: German, Input: Kunst und Kultur\nJSON Response: {"heading": "Die magische Welt der Kunst und Kultur 🎭"}',
    },
    {
      role: "user",
      content:
        'Give me a Heading. Language: English, Input: Wissenschaft und Technologie\nJSON Response: {"heading": "Science and technology - the future of humanity 🚀"}',
    },
    {
      role: "user",
      content:
        'Give me a Heading. Language: German, Input: Geschichte und Politik\nJSON Response: {"heading": "Geschichte und Politik - ein ewiger Tanz 📜"}',
    },
  ];
}
