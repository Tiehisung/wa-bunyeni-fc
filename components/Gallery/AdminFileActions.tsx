// import { downloadFile } from "@/lib/file";
// import { View, Download, Trash } from "lucide-react";
// import { ConfirmActionButton } from "../buttons/ConfirmAction";
// import { PrimaryDropdown } from "../Dropdown";
// import { DropdownMenuItem } from "../ui/dropdown-menu";
// import { useState } from "react";
// import LightboxViewer from "../viewer/LightBox";

// interface IProps {
//   onDelete?: (file: { _id?: string; publicId?: string; url?: string }) => void;
// }

// const AdminFileActions = ({ onDelete }: IProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div>
//       <PrimaryDropdown>
//         <DropdownMenuItem onClick={() => setIsOpen(true)}>
//           <View className="w-4 h-4 mr-2" /> View
//         </DropdownMenuItem>
//         <DropdownMenuItem
//           onClick={() =>
//             downloadFile(
//               gallery.files[0]?.secure_url,
//               gallery.files[0]?.original_filename as string,
//             )
//           }
//         >
//           <Download className="w-4 h-4 mr-2" /> Download
//         </DropdownMenuItem>
//         <ConfirmActionButton
//           onConfirm={() => onDelete(gallery?._id as string)}
//           trigger={
//             <DropdownMenuItem
//               onSelect={(e) => e.preventDefault()}
//               className="grow "
//             >
//               <Trash className="w-4 h-4 mr-2" /> Delete
//             </DropdownMenuItem>
//           }
//           variant={"ghost"}
//           triggerStyles="w-full justify-start p-0 "
//           title="Delete Gallery"
//           confirmText="Are you sure you want to delete this gallery?"
//           // variant="destructive"
//           confirmVariant={"delete"}
//           isLoading={isDeleting}
//         />
//       </PrimaryDropdown>
//       <LightboxViewer
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         files={
//           gallery?.files
//             ?.filter((f) => f?.resource_type === "image" || f?.type === "video")
//             ?.map((f) => ({
//               src: f.secure_url,
//               alt: f.original_filename,
//               height: f.height,
//               width: f.width,
//               type: f.resource_type as "image" | "video",
//             })) ?? []
//         }
//         index={0}
//       />
//     </div>
//   );
// };

// export default AdminFileActions;
