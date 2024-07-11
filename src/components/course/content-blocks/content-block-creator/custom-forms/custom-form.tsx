import useContentBlockModal from "../zustand";

function ContentBlockCustomForm() {
  const { contentBlockType } = useContentBlockModal();

  switch (contentBlockType) {
    default:
      return <></>;
  }
}

export default ContentBlockCustomForm;
