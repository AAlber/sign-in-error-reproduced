export function getExample(): any[] {
  return [
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in English with a difficulty of 8/10 for the input: Data Structures in Java.",
    },
    {
      role: "assistant",
      content:
        '{"task": "Implement a Stack data structure in Java that supports push(), pop(), and peek() operations. Use an array to store the elements and make sure that the stack has a maximum capacity of 100 elements. If the stack is full and the user tries to push a new element, throw a StackOverflowException. If the stack is empty and the user tries to pop or peek, throw a StackUnderflowException.\\n", "code": ""}',
    },
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in English with a difficulty of 2/10 for the input: Swift closures",
    },
    {
      role: "assistant",
      content:
        '{"task": "Find the mistake in the following swift closure\\n", "code": "function calculateAverage(numbers) {\\nconst count = numbers.length;\\n\\tlet sum = 0;\\n\\tnumbers.forEach(num => {\\n\\t\\tsum += num;\\n\\t});\\n\\tconst average = sum / count;\\n\\treturn average;\\n}\\nconst numbers = [];\\nconst average = calculateAverage(numbers);\\nconsole.log(average);"}',
    },
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in English with a difficulty of 5/10 for the input: Python functions",
    },
    {
      role: "assistant",
      content:
        '{"task": "Write a function that takes a list of numbers and returns the sum of all the numbers in the list.\\n", "code": ""}',
    },
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in German with a difficulty of 7/10 for the input: JavaScript",
    },
    {
      role: "assistant",
      content:
        '{"task": "Was ist der Output des folgendes Codes?\\n", "code": "function foo() {\\n\\tconsole.log(this.bar);\\n}\\n\\nvar bar = "bar1";\\nvar o2 = {bar: "bar2", foo: foo};\\nvar o3 = {bar: "bar3", foo: foo};\\n\\nfoo();\\no2.foo();\\no3.foo();"}',
    },
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in German with a difficulty of 9/10 for the input: Rust find the mistake",
    },
    {
      role: "assistant",
      content:
        '{"task": "Finde den fehler in dem Rust code.\\n", "code": "fn main() {\\n\\tlet mut s = String::from("hello");\\n\\tlet r1 = &mut s;\\n\\tlet r2 = &mut s;\\n\\tprintln!("{} {}", r1, r2);\\n}"}',
    },
    {
      role: "user",
      content:
        "give me a Code task in German with a difficulty of 9/10 for the input: Gib mir eine Aufgabe in Python",
    },
    {
      role: "assistant",
      content:
        '{"task": "Schreibe eine Funktion, die eine Liste von Zahlen entgegennimmt und die Summe aller Zahlen in der Liste zurückgibt.\\n", "code": "zahlen = [3,456,2,642,7,86,25]"}',
    },
    {
      role: "user",
      content:
        "give me a Code task in the format of a parsable string in German with a difficulty of 9/10 for the input: Gib mir eine Aufgabe in Python",
    },
    {
      role: "assistant",
      content:
        '{"task": "Find the mistake in the following Python code that makes an API request using the requests library to retrieve information based on a given query. The request is not successful, and the code should be corrected such that it retrieves and prints the response content.\\n", "code": "import requests\n\nresponse = requests.get("https://api.example.com", params={"q": "query"})\n\nprint(response.json())"}',
    },
  ];
}
