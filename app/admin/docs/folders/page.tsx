import HEADER   from "@/components/Element";
import DocumentFolders from "./Folders";

const FoldersPage = () => {
  return (
    <div className="py-6">
      <HEADER
        title="Folders"
        subtitle="System folders are default and can not be deleted."
      /> 

      <DocumentFolders defaultsOnly={false}/>
    </div>
  );
};

export default FoldersPage;
