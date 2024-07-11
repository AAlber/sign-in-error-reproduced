import { cloze } from "./element-cloze";
import { code } from "./element-code";
import { file } from "./element-file";
import { heading } from "./element-heading";
import { image } from "./element-image";
import { multipleChoice } from "./element-multiplechoice";
import { paragraph } from "./element-paragraph";
import { singleChoice } from "./element-singlechoice";
import { survey } from "./element-survey";
import { text } from "./element-text";
import type { WorkbenchElementType } from "./element-type";
import WorkbenchElementFactory from "./element-type-factory";
import { video } from "./element-video";
import { vimeo } from "./element-vimeo";
import { vocabulary } from "./element-vocabulary";

const factory = new WorkbenchElementFactory();

factory.register(heading);
factory.register(paragraph);
factory.register(image);
factory.register(text);
factory.register(multipleChoice);
factory.register(code);
factory.register(vocabulary);
factory.register(singleChoice);
factory.register(file);
factory.register(cloze);
factory.register(video);
factory.register(vimeo);
factory.register(survey);

const elementTypes: WorkbenchElementType[] = factory.getElementTypes();

export default elementTypes;
