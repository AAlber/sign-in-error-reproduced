import assessment from "./content-blocks/assessment";
import audio from "./content-blocks/audio/audio";
import autoLesson from "./content-blocks/auto-lesson";
import certificate from "./content-blocks/certificate";
import docuChat from "./content-blocks/docu-chat";
import editorFile from "./content-blocks/editor-file";
import ExternalDeliverable from "./content-blocks/external-content";
import file from "./content-blocks/file";
import handIn from "./content-blocks/handin";
import link from "./content-blocks/link";
import section from "./content-blocks/section";
import { survey } from "./content-blocks/survey";
import video from "./content-blocks/video";
import workbenchFile from "./content-blocks/workbench-file";
import { ContentBlockRegistry } from "./registry";

export function initializeContentBlockRegistry() {
  const registry = new ContentBlockRegistry();

  registry.add(handIn);
  registry.add(file);
  registry.add(editorFile);
  registry.add(video);
  registry.add(workbenchFile);
  registry.add(assessment);
  registry.add(section);
  registry.add(docuChat);
  registry.add(autoLesson);
  registry.add(certificate);
  registry.add(link);
  registry.add(survey);
  registry.add(ExternalDeliverable);
  registry.add(audio);

  return registry;
}
