import useCloudOverlay from "../zustand";
import TableHeadItem from "./table-head-item";

export default function FileViewTableHead() {
  const { driveObject } = useCloudOverlay();
  const { setFiles, currentFiles } = driveObject;
  const copiedArray = [...currentFiles];
  const sortByName = (reverse: boolean) => {
    copiedArray.sort((a, b) => {
      if (reverse) {
        return b.name.localeCompare(a.name);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    setFiles && setFiles(copiedArray);
  };

  const sortByKind = (reverse: boolean) => {
    copiedArray.sort((a, b) => {
      if (reverse) {
        return b.type.localeCompare(a.type);
      } else {
        return a.type.localeCompare(b.type);
      }
    });
    setFiles && setFiles(copiedArray);
  };

  const sortBySize = (reverse: boolean) => {
    copiedArray.sort((a, b) => {
      if (reverse) {
        return b.size - a.size;
      } else {
        return a.size - b.size;
      }
    });
    setFiles && setFiles(copiedArray);
  };
  const sortByDate = (reverse: boolean) => {
    copiedArray.sort((a, b) => {
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();

      if (reverse) {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    setFiles && setFiles(copiedArray);
  };

  return (
    <thead>
      <tr>
        <th
          scope="col"
          className="sticky top-0 z-10 border-b border-border bg-background  py-1 text-left text-sm font-medium text-contrast backdrop-blur"
        ></th>
        <TableHeadItem name={"cloud.header_name"} sortFunction={sortByName} />
        <TableHeadItem name={"cloud.header_size"} sortFunction={sortBySize} />
        <TableHeadItem name={"cloud.header_kind"} sortFunction={sortByKind} />
        <TableHeadItem
          name={"cloud.header_data_modified"}
          sortFunction={sortByDate}
        />
        <th
          scope="col"
          className="sticky top-0 z-10 cursor-pointer border-b border-border bg-background  px-3 py-1 text-left text-sm font-medium text-contrast backdrop-blur"
        >
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
}
