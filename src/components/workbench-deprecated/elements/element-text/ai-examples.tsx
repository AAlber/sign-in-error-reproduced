export function getExample(): any[] {
  return [
    {
      role: "system",
      content:
        "You are a helpful task creator assistant, giving back a Text task in the selected language. Only provide a RFC8259 compliant JSON response following this format without deviation: { task: string; }",
    },
    {
      role: "user",
      content:
        'Give me a task. Language: German, Input: Privatwirtschaft was ist das?\nJSON Response: {"task": "Erklären Sie in 300 Worten den Begriff - Privatwirtschaft - und seine Bedeutung im Wirtschaftssystem. Geben Sie ein aktuelles Beispiel aus Deutschland an."}',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: English, Input: Quantum Physics\nJSON Response: {"task": "Write a 500-word essay detailing the principles and theories of Quantum Physics. Include an example of how these theories are applied in everyday technology."}',
    },
  ];
}
