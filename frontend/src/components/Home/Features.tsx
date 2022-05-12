import { useState } from "react";

const TABS = [
  {
    title: "Find relevant media contacts - multiline title",
    description:
      "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quidem ipsam ratione dicta quis cupiditate consequuntur laborum ducimus iusto velit.</p>",
    imageUrl: "/demo-illustration-3.png",
    baseColor: "249,82,120",
    secondColor: "221,9,57",
  },
  {
    title: "Another amazing feature",
    description:
      "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quidem ipsam ratione dicta quis cupiditate consequuntur laborum ducimus iusto velit.</p>",
    imageUrl: "/demo-illustration-4.png",
    baseColor: "57,148,224",
    secondColor: "99,172,232",
  },
  {
    title: "And yet... another truly fascinating feature",
    description:
      "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quidem ipsam ratione dicta quis cupiditate consequuntur laborum ducimus iusto velit.</p>",
    imageUrl: "/demo-illustration-5.png",
    baseColor: "88,193,132",
    secondColor: "124,207,158",
  },
];
export default function Features() {
  const [currentTab, setCurrentTab] = useState(TABS[0]);
}
