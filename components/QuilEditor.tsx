// import React, { ReactNode } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ list: 'ordered' }, { list: 'bullet' }],
//     [{ align: [] }],
//     ['clean'],
//   ],
// };

// const formats = [
//   'header',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'list',
//   'bullet',
//   'align',
// ];

// interface RichTextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   error?: string;
//   minHeight?: string;
//   className?: string;
//   label?: ReactNode;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({
//   value,
//   onChange,
//   placeholder = 'Start typing...',
//   error,
//   minHeight = '8rem',
//   className,
//   label,
// }) => {
//   React.useEffect(() => {
//     // Inject custom styles
//     const customStyles = `
//       .quill-container {
//         display: flex;
//         flex-direction: column;
//         height: 100%;
//       }
      
//       .quill {
//         display: flex;
//         flex-direction: column;
//         height: 100%;
//       }
      
//       .ql-container {
//         flex: 1;
//         overflow: auto;
//         min-height: ${minHeight};
//         resize: vertical;
//       }
      
//       .ql-editor {
//         min-height: ${minHeight};
//         max-height: none;
//       }

//       .ql-toolbar.ql-snow .ql-formats button.ql-active {
//         background-color: #f3f4f6;
//         border-radius: 4px;
//       }

//       .ql-toolbar.ql-snow .ql-formats button:hover {
//         background-color: #f3f4f6;
//         border-radius: 4px;
//       }

//       .ql-toolbar.ql-snow .ql-formats .ql-picker-label.ql-active {
//         background-color: #f3f4f6;
//         border-radius: 4px;
//       }
//     `;

//     const styleSheet = document.createElement('style');
//     styleSheet.textContent = customStyles;
//     document.head.appendChild(styleSheet);

//     return () => {
//       document.head.removeChild(styleSheet);
//     };
//   }, [minHeight]);

//   return (
//     <div className={`quill-container ${className}`}>
//       <div className="_label text-bodyText">{label}</div>
//       <ReactQuill
//         theme="snow"
//         modules={modules}
//         formats={formats}
//         value={value}
//         onChange={onChange}
//         className="bg-white text-bodyText"
//         placeholder={placeholder}
//       />
//       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//     </div>
//   );
// };

// export default RichTextEditor;
