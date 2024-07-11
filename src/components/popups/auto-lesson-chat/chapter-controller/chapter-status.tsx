import { getChapterStatusIcon } from "../functions";

const ChapterStatus = ({ chapter, userStatus }) => {
  return (
    <div className="flex flex-1 items-center gap-4">
      {getChapterStatusIcon(userStatus, chapter.id)}
      <span className="flex h-8 flex-1 items-center text-start">
        {chapter.title}
      </span>
    </div>
  );
};

export default ChapterStatus;
