export function getExample(): any[] {
  return [
    {
      role: "user",
      content:
        "give me a Vocabulary task in the format of a parsable string in German for the input: English city words",
    },
    {
      role: "assistant",
      content:
        '{"task": "Übersetze diese Wörter", "words": [{"word": "Skyscraper","answer": ""}, {"word": "Building","answer": ""},{"word": "Taxi","answer": ""}, {"word": "Museum","answer": ""}, {"word": "Trainstation","answer": ""}, {"word": "Traffic","answer": ""}, {"word": "Office","answer": ""},]}',
    },
    {
      role: "user",
      content:
        "give me a Vocabulary task in the format of a parsable string in English for the input: Business german",
    },
    {
      role: "assistant",
      content:
        '{"task": "Translate these German business terms to English", "words": [{"word": "Bilanz", "answer": ""}, {"word": "Mitarbeiter", "answer": ""}, {"word": "Gewinn", "answer": ""}, {"word": "Kapital", "answer": ""}, {"word": "Marketing", "answer": ""}, {"word": "Produktivität", "answer": ""}, {"word": "Umsatz", "answer": ""}]}',
    },
    {
      role: "user",
      content:
        "give me a Vocabulary task in the format of a parsable string in Spanish for the input: Russian military vocabulary",
    },
    {
      role: "assistant",
      content:
        '{"task": "Traduce estas palabras militares rusas al español", "words": [{"word": "танк", "answer": ""}, {"word": "бронежилет", "answer": ""}, {"word": "артиллерия", "answer": ""}, {"word": "военный", "answer": ""}, {"word": "снаряжение", "answer": ""}, {"word": "разведка", "answer": ""}, {"word": "армия", "answer": ""}]}',
    },
    {
      role: "user",
      content:
        "give me a Vocabulary task in the format of a parsable string in English for the input: Vocabulary test for students from chinese to german about food",
    },
    {
      role: "assistant",
      content:
        '{"task": "Translate these Chinese food words to German.","words": [{"word": "牛肉面","answer": ""},{"word": "炸鸡","answer": ""},{"word": "炒面","answer": ""},{"word": "糖醋鱼","answer": ""},{"word": "饺子","answer": ""},{"word": "豆腐","answer": ""},{"word": "蔬菜","answer": ""}]}',
    },
  ];
}
