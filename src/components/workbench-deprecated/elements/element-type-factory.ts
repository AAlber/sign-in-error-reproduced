import type { WorkbenchElementType } from "./element-type";

export default class WorkbenchElementFactory {
  private elementTypes: WorkbenchElementType[] = [];

  register(elementType: WorkbenchElementType): void {
    this.elementTypes.push(elementType);
  }

  getElementTypes(): WorkbenchElementType[] {
    return this.elementTypes;
  }
}
