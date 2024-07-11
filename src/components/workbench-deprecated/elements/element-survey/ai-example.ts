export function getExample(): any[] {
  return [
    {
      role: "user",
      content:
        "give me a Multiple Choice task in the format of a parsable string in English with a difficulty of 5/10 for the input: Biology ribosomes",
    },
    {
      role: "assistant",
      content:
        '{"task": "What is the function of ribosomes in a cell? (Select all that apply)", "choices": [{"choice": "To produce ATP","checked": false},{"choice": "To break down waste materials","checked": false},{"choice": "To synthesize proteins","checked": false},{"choice": "To control the movement of materials in and out of the cell","checked": false}]}',
    },
    {
      role: "user",
      content:
        "give me a Multiple Choice task in the format of a parsable string in Spanish with a difficulty of 7/10 for the input: Geografía",
    },
    {
      role: "assistant",
      content:
        '{"task": "¿En qué continentes se encuentran los siguientes países: Turquía, Rusia y Kazajistán? (Seleccione todo lo que corresponda)", "choices": [{"choice": "Turquía: Europa y Asia, Rusia: Europa y Asia, Kazajistán: Asia", "checked": false}, {"choice": "Turquía: Asia y África, Rusia: Asia y América del Norte, Kazajistán: Asia", "checked": false}, {"choice": "Turquía: Europa y África, Rusia: Asia y Europa, Kazajistán: Asia", "checked": false}, {"choice": "Turquía: Europa y Asia, Rusia: Europa, Asia y América del Norte, Kazajistán: Asia", "checked": false}, {"choice": "Turquía: Asia y Europa, Rusia: Europa y América del Sur, Kazajistán: Asia y Europa", "checked": false}]}',
    },
    {
      role: "user",
      content:
        "give me a Multiple Choice task in the format of a parsable string in German with a difficulty of 6/10 for the input: Geschichte im 20. Jahrhundert",
    },
    {
      role: "assistant",
      content:
        '{"task": "Welche der folgenden Ereignisse fanden im 20. Jahrhundert statt? (Wählen Sie alle zutreffenden Antworten aus)", "choices": [{"choice": "Erster Weltkrieg","checked": false},{"choice": "Zweiter Weltkrieg","checked": false},{"choice": "Französische Revolution","checked": false},{"choice": "Mauerfall in Berlin","checked": false},{"choice": "Kalter Krieg","checked": false},{"choice": "Unabhängigkeit Indiens","checked": false}]}',
    },
    {
      role: "user",
      content:
        "give me a Multiple Choice task in the format of a parsable string in English with a difficulty of 3/10 for the input: True and false statements about electrical fields",
    },
    {
      role: "assistant",
      content:
        '{"task": "Which of the following statements about electric fields are true? (Select all that apply)", "choices": [{"choice": "Electric fields are created by charged particles", "checked": false},{"choice": "Electric fields can only be created by stationary charged particles", "checked": false},{"choice": "The strength of an electric field decreases with distance from the charged particle", "checked": false},{"choice": "Electric fields can be shielded by conductive materials", "checked": false},{"choice": "The direction of an electric field is always perpendicular to the direction of motion of the charged particle creating it", "checked": false}]}',
    },
    {
      role: "user",
      content:
        "give me a Multiple Choice task in the format of a parsable string in English with a difficulty of 4/10 for the input: matrices mathematics",
    },
    {
      role: "assistant",
      content:
        '{"task": "Which of the following statements about matrices are true? (Select all that apply)", "choices": [{"choice": "The transpose of a matrix is obtained by flipping its rows and columns", "checked": false},{"choice": "The determinant of a matrix is only defined for square matrices", "checked": false},{"choice": "The inverse of a matrix always exists", "checked": false},{"choice": "The product of two matrices is only defined if their dimensions are compatible", "checked": false},{"choice": "The trace of a matrix is equal to the sum of its diagonal elements", "checked": false}]}',
    },
  ];
}
