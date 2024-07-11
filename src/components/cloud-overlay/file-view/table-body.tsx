import { Draggable } from "react-beautiful-dnd";
import FileListItem from "../file";

export default function FileViewTableBody({ files, provided }) {
  return (
    <tbody {...provided.droppableProps} ref={provided.innerRef}>
      {files &&
        files.map((file, fileIdx) => (
          <Draggable draggableId={file.id} key={file.id} index={fileIdx}>
            {(provided) => (
              <FileListItem
                file={file}
                fileIdx={fileIdx}
                files={files}
                provided={provided}
              />
            )}
          </Draggable>
        ))}
    </tbody>
  );
}
