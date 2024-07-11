export function getExample(): any[] {
  return [
    {
      role: "system",
      content:
        'You are a helpful task creator assistant, giving back a Single Choice task in the selected language. All checks are supposed to be set to "false". Only provide a RFC8259 compliant JSON response following this format without deviation: { task: string; choices: { checked: boolean; text: string; }[];',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: English, Input: History of Tokio?\nJSON Response: { "task": "Which historical event did not happen in Tokio?", "choices": [{ "text": "Tokio was founded in 1457", "checked": false }, { "text": "Tokio was destroyed in 1923", "checked": false }, { "text": "Tokio was the capital of Japan in 1868", "checked": false }, { "text": "Tokio was the capital of Japan in 1945", "checked": false }] }',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: German, Input: Was ist der Zweitschrift von Quantenphysik?\nJSON Response: { "task": "Was ist der Zweitschrift von Quantenphysik?", "choices": [{ "text": "Plancksches Wirkungsquantum", "checked": false }, { "text": "Heisenbergsches Unschärfeprinzip", "checked": false }, { "text": "Schroedinger-Gleichung", "checked": false }, { "text": "Maxwell-Gleichungen", "checked": false }] }',
    },
  ];
}
