export type ConceptName = "Impiety" | "Moral Integrity" | "Socratic Method" | "Civic Duty";

export type LessonInline =
  | {
      text: string;
      type?: "text" | "italic";
    }
  | {
      concept: ConceptName;
      text: string;
      type: "concept";
    };

export type LessonBlock =
  | {
      id: string;
      type: "paragraph";
      parts: LessonInline[];
    }
  | {
      id: string;
      type: "quote";
      text: string;
    };

export type LessonSection = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};

export const fullLesson = {
  title: "The Trial of Socrates",
  category: "Ethics",
  duration: "12 min",
  difficulty: "Hard",
  status: "In Progress",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBUXlt7DWT9WJywxmMD6tw_ArSqcUXXhcOCNlC7iLbSXlrq7Fon8z4PewZvUAzYnUYn4Hz3IWGG5bgE4MroTivm6V1JGaA1f8tRKd2aasI4-RvOxyhergu5SqRhtoST3b_nEk5pDWqj_Mb-jvr8ATkCkcBY6-GqJGY7wDEpE9W8euaeyRBQlDIe-a2P1yJgVfc5VuhK0EHYHjlrb2cMBA3WfcsoUu_ZyHoTMb8f79BVViN0MNwbmxx_GMal2nUgKWS-I3KKEmvxIsU",
  concepts: {
    "Moral Integrity":
      "The practice of consistency in actions, values, methods, measures, principles, expectations, and outcomes. For Socrates, it meant never acting against one's own conscience, even under the threat of death.",
    "Socratic Method":
      "A form of cooperative argumentative dialogue based on asking and answering questions to stimulate critical thinking and draw out assumptions.",
    "Civic Duty":
      "The responsibilities of a citizen to their community or state. Socrates believed in obeying the laws of Athens because he had benefited from them his whole life.",
    Impiety:
      "A lack of proper respect or reverence toward the state-recognized gods. In Socrates' case, it became a political charge used to silence philosophical dissent.",
  } satisfies Record<ConceptName, string>,
  coreConcepts: ["Socratic Method", "Moral Integrity", "Civic Duty"] as ConceptName[],
  sections: [
    {
      id: "accusation",
      title: "The Accusation",
      blocks: [
        {
          id: "accusation-1",
          type: "paragraph",
          parts: [
            {
              text: "In 399 BCE, the intellectual landscape of Athens was fractured. Socrates, a man who had spent decades questioning the foundations of Athenian life, found himself standing before a jury of 501 citizens. The formal charges brought against him by Meletus and Anytus were grave: ",
            },
            { type: "concept", concept: "Impiety", text: "Impiety" },
            { text: " and the corruption of the youth." },
          ],
        },
        {
          id: "accusation-2",
          type: "paragraph",
          parts: [
            {
              text: "But beneath the legal surface lay a deeper tension. Socrates' unwavering commitment to ",
            },
            { type: "concept", concept: "Moral Integrity", text: "Moral Integrity" },
            {
              text: " had made him a gadfly to the powerful, exposing the ignorance of those who claimed wisdom.",
            },
          ],
        },
      ],
    },
    {
      id: "defense",
      title: "The Defense (The Apology)",
      blocks: [
        {
          id: "defense-1",
          type: "paragraph",
          parts: [
            { text: "Plato's ", type: "text" },
            { text: "Apology", type: "italic" },
            {
              text: " records not a plea for mercy, but a masterful execution of the ",
            },
            { type: "concept", concept: "Socratic Method", text: "Socratic Method" },
            {
              text: '. Socrates argued that his service to the city, his constant questioning, was a divine mandate intended to wake the "sluggish horse" of Athens from its intellectual slumber.',
            },
          ],
        },
        {
          id: "defense-quote",
          type: "quote",
          text: "The unexamined life is not worth living.",
        },
        {
          id: "defense-2",
          type: "paragraph",
          parts: [
            {
              text: "He refused to compromise his principles to escape death, asserting that the soul's health was more important than the body's survival. His defense was a confrontation with the jury's own sense of ",
            },
            { type: "concept", concept: "Civic Duty", text: "Civic Duty" },
            { text: " and truth." },
          ],
        },
      ],
    },
    {
      id: "death",
      title: "The Death of Socrates",
      blocks: [
        {
          id: "death-1",
          type: "paragraph",
          parts: [
            {
              text: "Found guilty by a narrow margin, Socrates was sentenced to death by drinking hemlock. Despite opportunities to escape arranged by his friends, he remained in prison, arguing that to flee would be to violate the social contract he had lived by.",
            },
          ],
        },
        {
          id: "death-2",
          type: "paragraph",
          parts: [
            {
              text: "In his final moments, surrounded by weeping students, Socrates remained the picture of philosophical stoicism. He died as he lived: questioning, teaching, and ultimately, free from the fear of the unknown.",
            },
          ],
        },
      ],
    },
  ] satisfies LessonSection[],
};
