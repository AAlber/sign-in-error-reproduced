import classNames from "@/src/client-functions/client-utils";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import Form from "@/src/components/reusable/formlayout";
import type {
  ContentBlockForm,
  ContentBlockSpecsMapping,
} from "@/src/types/content-block/types/specs.types";
import { FormTimeOptions } from "../time-options";
import useContentBlockModal from "../zustand";
import ContentBlockFormCustomField from "./custom-form-fields/form-custom-field";
import FormFileField from "./form-fields/form-file";
import FormInputField from "./form-fields/form-input";
import FormSelectField from "./form-fields/form-select";
import FormSwitchField from "./form-fields/form-switch";

type Props<TBlockType extends keyof ContentBlockSpecsMapping> = {
  form: ContentBlockForm<ContentBlockSpecsMapping[TBlockType]>;
};

function ContentBlockForm<TBlockType extends keyof ContentBlockSpecsMapping>({
  form,
}: Props<TBlockType>) {
  const { data, setData } = useContentBlockModal();

  const handleInputChange = (key: string, value: any) => {
    if (data) {
      setData({ ...data, [key]: value });
    } else {
      setData({ [key]: value } as any);
    }
  };

  const normalFields = Object.entries(form).filter(
    ([, field]) => field && !field.advanced,
  );

  const advancedFields = Object.entries(form).filter(
    ([, field]) => field && field.advanced,
  );

  return (
    <>
      {normalFields.map(([key, field]) => {
        if (!field) return null;
        switch (field.fieldType) {
          case "input":
            return (
              <FormInputField
                fieldKey={key}
                data={data}
                field={field}
                handleInputChange={handleInputChange}
              />
            );
          case "number":
            return (
              <FormInputField
                fieldKey={key}
                data={data}
                field={field}
                isNumber
                handleInputChange={handleInputChange}
              />
            );
          case "switch":
            return (
              <FormSwitchField
                fieldKey={key}
                data={data}
                field={field}
                handleInputChange={handleInputChange}
              />
            );
          case "select":
            return (
              <FormSelectField
                fieldKey={key}
                data={data}
                field={field}
                handleInputChange={handleInputChange}
              />
            );
          case "file":
            return (
              <FormFileField
                fieldKey={key}
                data={data}
                field={field}
                handleInputChange={handleInputChange}
              />
            );
          case "hidden":
            return null;
          default:
            return <ContentBlockFormCustomField fieldName={field.label} />;
        }
      })}

      {!!advancedFields.length && (
        <AdvancedOptionReveal className="col-span-full -mt-2">
          <Form>
            <Form.SettingsSection>
              {advancedFields.map(([key, field]) => {
                if (!field) return null;
                switch (field.fieldType) {
                  case "input":
                    return (
                      <Form.SettingsItem>
                        <FormInputField
                          fieldKey={key}
                          data={data}
                          field={field}
                          handleInputChange={handleInputChange}
                        />
                      </Form.SettingsItem>
                    );
                  case "number":
                    return (
                      <Form.SettingsItem>
                        <FormInputField
                          fieldKey={key}
                          data={data}
                          field={field}
                          isNumber
                          handleInputChange={handleInputChange}
                        />
                      </Form.SettingsItem>
                    );
                  case "switch":
                    return (
                      <Form.SettingsItem>
                        <FormSwitchField
                          fieldKey={key}
                          data={data}
                          field={field}
                          handleInputChange={handleInputChange}
                        />
                      </Form.SettingsItem>
                    );
                  case "select":
                    return (
                      <Form.SettingsItem>
                        <FormSelectField
                          fieldKey={key}
                          data={data}
                          field={field}
                          handleInputChange={handleInputChange}
                        />
                      </Form.SettingsItem>
                    );
                  case "file":
                    return (
                      <Form.SettingsItem>
                        <FormFileField
                          fieldKey={key}
                          data={data}
                          field={field}
                          handleInputChange={handleInputChange}
                        />
                      </Form.SettingsItem>
                    );
                  case "hidden":
                    return null;
                  default:
                    return (
                      <Form.SettingsItem>
                        <ContentBlockFormCustomField fieldName={field.label} />
                      </Form.SettingsItem>
                    );
                }
              })}
            </Form.SettingsSection>
          </Form>
        </AdvancedOptionReveal>
      )}
      <AdvancedOptionReveal
        alternateText="content_block.time_options"
        className={classNames(
          "col-span-full ",
          advancedFields.length === 0 ? "mt-0" : "-mt-6",
        )}
      >
        <FormTimeOptions />
      </AdvancedOptionReveal>
    </>
  );
}

export default ContentBlockForm;
