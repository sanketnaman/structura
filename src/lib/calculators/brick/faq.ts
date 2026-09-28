export interface BrickFAQItem {
  question: string;
  answer: string;
}

export const BRICK_FAQ: BrickFAQItem[] = [
  {
    question: 'How many bricks do I need for a wall?',
    answer:
      'Enter your wall length and wall height, choose a brick preset (which sets brick size and mortar joint thickness), then pick a wythe count and a waste allowance. The calculator multiplies the wall face area by the effective brick area per unit to produce a base brick quantity, then adds your waste allowance for a planning estimate.',
  },
  {
    question: 'How many bricks are needed per square foot?',
    answer:
      'With the default modular brick (7 5/8 in by 2 1/4 in) laid in a 3/8 in mortar joint, the calculator uses approximately 6.86 bricks per square foot of single-wythe wall. In metric units the default is a 194 mm by 57 mm brick with a 10 mm joint.',
  },
  {
    question: 'How do I calculate bricks for a wall?',
    answer:
      'Calculate the wall face area, determine the effective brick face area including the mortar joint, divide wall area by effective brick area to get the base brick quantity, multiply by the number of wythes, then add a waste allowance.',
  },
  {
    question: 'How much mortar do I need for brickwork?',
    answer:
      'The calculator uses a planning assumption of approximately 130 modular bricks per 80 lb bag of Type N mortar and reports the bag count plus the approximate dry mix volume. Actual mortar requirements vary with brick dimensions, joint thickness, wall construction, workmanship, and product yield.',
  },
  {
    question: 'How much waste should I add when ordering bricks?',
    answer:
      'Waste depends on wall size, bond pattern, cutting, and breakage. The calculator offers 5%, 8%, 10%, and 15% presets so you can pick an allowance that suits your project, and shows the waste bricks it adds to the base quantity.',
  },
  {
    question: 'What is the difference between single-wythe and double-wythe walls?',
    answer:
      'A single wythe is one layer (leaf) of brick, while a double wythe is two layers. The calculator multiplies the base brick quantity by the selected wythe count, so a double-wythe wall of the same face area needs roughly twice the bricks.',
  },
  {
    question: 'What brick sizes does this calculator support?',
    answer:
      'Three brick presets: Modular, Queen, and King. Each preset loads a matching brick length, brick height, and default mortar joint thickness, and the preset button shows the dimensions it uses. Wall length and wall height are entered directly, in metric or imperial units.',
  },
  {
    question: 'Can I calculate bricks using metric dimensions?',
    answer:
      'Yes. Switch the unit control to Metric (m / mm) to enter wall length and height in metres. The brick presets and mortar joint then use millimetre dimensions, such as a 194 mm by 57 mm modular brick with a 10 mm joint, and wall area is reported in square metres.',
  },
];
