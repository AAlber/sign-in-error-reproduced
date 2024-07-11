interface CourseGradient {
  name: string;
  gradient: string;
  color: string;
  text?: string;
}

interface AcccountGradient {
  color: string;
}

export const courseGradients: CourseGradient[] = [
  {
    name: "Cotton Candy",
    gradient: "from-[#ff66cc] via-[#ff80b3] to-[#ffb3e6]",
    color: "bg-[#ff80b3]",
    text: "text-[#ff80b3]",
  },
  {
    name: "Sunrise",
    gradient: "from-[#ffff66] via-[#ff9900] to-[#ffa07a]",
    color: "bg-[#ff9900]",
    text: "text-[#ff9900]",
  },
  {
    name: "Lemon Drop",
    gradient: "from-[#fff95b] via-[#ffd700] to-[#ff930f]",
    color: "bg-[#ffd700]",
    text: "text-[#ffd700]",
  },
  {
    name: "Minty Green",
    gradient: "from-[#00FFFF] via-[#00ff9f] to-[#C7FFD5]",
    color: "bg-[#00ff9f]",
    text: "text-[#00ff9f]",
  },
  {
    name: "Midnight Magic",
    gradient: "from-[#0066cc] via-[#333399] to-[#003399]",
    color: "bg-[#333399]",
    text: "text-[#333399]",
  },
  {
    name: "Iceberg",
    gradient: "from-[#00ffff] via-[#00cccc] to-[#d5faff]",
    color: "bg-[#00cccc]",
    text: "text-[#00cccc]",
  },
  {
    name: "Luminous Lavender",
    gradient: "from-[#CC66FF] via-[#9999FF] to-[#CC99FF]",
    color: "bg-[#9999FF]",
    text: "text-[#9999FF]",
  },
  {
    name: "Raspberry Rose",
    gradient: "from-[#ffa07a] via-[#ff8080] to-[#ff66cc]",
    color: "bg-[#ff8080]",
    text: "text-[#ff8080]",
  },
  {
    name: "Neon Street",
    gradient: "from-[#0000ff] via-[#00ccff] to-[#00bfff]",
    color: "bg-[#00ccff]",
    text: "text-[#00ccff]",
  },
  {
    name: "Galactic Glitch",
    gradient: "from-[#ff0099] via-[#9900cc] to-[#6600ff]",
    color: "bg-[#9900cc]",
    text: "text-[#9900cc]",
  },
  {
    name: "Starry Night",
    gradient: "from-[#96d4ca] via-[#9999ff] to-[#7c65a9]",
    color: "bg-[#9999ff]",
    text: "text-[#9999ff]",
  },
  {
    name: "Imperial Purple",
    gradient: "from-[#9933cc] via-[#cc66ff] to-[#9933ff]",
    color: "bg-[#cc66ff]",
    text: "text-[#cc66ff]",
  },
  {
    name: "Tokyo Dreams",
    gradient: "from-[#ffff00] via-[#ff6600] to-[#ff0066]",
    color: "bg-[#ff6600]",
    text: "text-[#ff6600]",
  },
  {
    name: "Jungle Rush",
    gradient: "from-[#008c00] via-[#00b33d] to-[#00e673]",
    color: "bg-[#00b33d]",
    text: "text-[#00b33d]",
  },
  {
    name: "Cyber Surge",
    gradient: "from-[#ff00ff] via-[#00ffff] to-[#00ff00]",
    color: "bg-[#00ffff]",
    text: "text-[#00ffff]",
  },
];

export const accountGradients: AcccountGradient[] = [
  {
    color: "from-[#f96f06] to-[#06f96f]",
  },
  {
    color: "from-[#a806f9] to-[#f9a806]",
  },
  {
    color: "from-[#06bcf9] to-[#f906bc]",
  },
  {
    color: "from-[#53b6ef] to-[#f9aabf]",
  },
  {
    color: "from-[#06f937] to-[#3706f9]",
  },
  {
    color: "from-[#0657f9] to-[#f90657]",
  },
  {
    color: "from-[#06f9e4] to-[#e406f9]",
  },
  {
    color: "from-[#f90648] to-[#4806f9]",
  },
  {
    color: "from-[#06a5f9] to-[#f906a5]",
  },
  {
    color: "from-[#f9f806] to-[#06f9f8]",
  },
];
