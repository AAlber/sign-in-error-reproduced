import BlockquoteFigure from "./elements/blockquote-figure";
import BulletList from "./elements/bullet-list";
import CodeBlock from "./elements/code";
import Columns from "./elements/columns";
import File from "./elements/file";
import Heading1 from "./elements/heading1";
import Heading2 from "./elements/heading2";
import Heading3 from "./elements/heading3";
import Image from "./elements/image";
import NumberedList from "./elements/numbered-list";
import Text from "./elements/paragraph";
import Table from "./elements/table";
import TableOfContent from "./elements/table-of-content";
import Youtube from "./elements/youtube";
import { ElementRegistry } from "./registry";

export function initializeElementsRegistry() {
  const registry = new ElementRegistry();

  registry.add(Heading1);
  registry.add(Heading2);
  registry.add(Heading3);
  registry.add(Text);
  registry.add(BulletList);
  registry.add(NumberedList);
  registry.add(Image);
  registry.add(CodeBlock);
  // registry.add(MultipleChoice);
  // registry.add(SingleChoice);
  registry.add(File);
  registry.add(Youtube);
  registry.add(BlockquoteFigure);
  registry.add(TableOfContent);
  registry.add(Table);
  registry.add(Columns);

  return registry;
}
