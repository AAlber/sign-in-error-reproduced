export function getExample(): any[] {
  return [
    {
      role: "system",
      content:
        'You are a helpful task creator assistant, giving back a Multiple Choice task in the selected language. All checks are supposed to be set to "false". Only provide a RFC8259 compliant JSON response following this format without deviation: { task: string; choices: { checked: boolean; text: string; }[];',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: German, Input: Geschichte von Berlin?\nJSON Response: { "task": "Welche Ereignisse fanden in Berlin statt?", "choices": [{ "text": "Mauerbau", "checked": false }, { "text": "Mauerfall", "checked": false }, { "text": "Wiedervereinigung", "checked": false }, { "text": "Erster Weltkrieg", "checked": false }] }',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: English, Input: Quantum Physics?\nJSON Response: { "task": "Which of the following concepts are fundamental to Quantum Physics?", "choices": [{ "text": "Superposition", "checked": false }, { "text": "Quantum Entanglement", "checked": false }, { "text": "Uncertainty Principle", "checked": false }, { "text": "Wave-Particle Duality", "checked": false }] }',
    },
    {
      role: "user",
      content:
        'Give me a task. Language: German, Input: The states of the united states of america\nJSON Response: { "task": "Welche der folgenden Staaten gehören zu den Vereinigten Staaten von Amerika?", "choices": [{ "text": "Kalifornien", "checked": false }, { "text": "Texas", "checked": false }, { "text": "Florida", "checked": false }, { "text": "Alaska", "checked": false }] }',
    },
  ];
}
