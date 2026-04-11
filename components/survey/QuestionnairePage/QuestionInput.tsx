// import React from 'react';
// import { ISelectOptionLV } from '../../../types/select';
// import {
//   CheckboxInput,
//   Input,
//   TextArea,
// } from '../../../components/inputs/Input';
// import { LVSelector } from '../../../components/inputs/select/Select';

// export type TQuestionType =
//   | 'textarea'
//   | 'number'
//   | 'checkbox'
//   | 'select'
//   | 'date';

// export interface IQuestion {
//   id: string;
//   label: string;
//   type: TQuestionType;
//   /** Optional placeholder or help text */
//   placeholder?: string;
//   options?: ISelectOptionLV[]; //Case of select
//   required?: boolean;
//   name: string;

//   //others
//   minimum?: number;
//   maximum?: number;

//   minLength?: number;
//   maxLength?: number;
// }

// interface IQuestionInputProps {
//   question: IQuestion;
//   choice: number | string | boolean;
//   onChange: (value: number | string | boolean) => void;
//   name: string;
//   className?: string;
//   required?: boolean;
// }

// export const QuestionInput: React.FC<IQuestionInputProps> = ({
//   question,
//   choice,
//   onChange,
//   className,
//   name,
// }) => {
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     switch (question.type) {
//       case 'number':
//         onChange(Number(e.target.value));
//         break;
//       case 'checkbox':
//         onChange((e as React.ChangeEvent<HTMLInputElement>).target.checked); // cast so TS knows it’s an <input>
//         break;
//       case 'select':
//         const selectedOption = e.target.value;
//         onChange(selectedOption);
//         break;
//       default:
//         onChange(e.target.value);
//     }
//   };

//   switch (question.type) {
//     case 'number':
//       return (
//         <Input
//           label={<p className="_label text-wrap">{question.label}</p>}
//           name={name ?? question.name}
//           type="number"
//           value={choice as number}
//           placeholder={question.placeholder}
//           onChange={handleChange}
//           className={className}
//           required={question.required}
//           hint="Minimum value is 12"
//         />
//       );
//     case 'date':
//       return (
//         <Input
//           label={<p className="font-normal text-wrap">{question.label}</p>}
//           name={name ?? question.name}
//           type="date"
//           value={choice as string}
//           placeholder={question.placeholder}
//           onChange={handleChange}
//           className={className}
//           required={question.required}
//         />
//       );

//     case 'textarea':
//       return (
//         <TextArea
//           label={<p className="font-normal text-wrap">{question.label}</p>}
//           name={name ?? question.name}
//           value={choice as string}
//           placeholder={question.placeholder}
//           onChange={handleChange}
//           className={className}
//           required={question.required}
//         />
//       );

//     case 'checkbox':
//       return (
//         <CheckboxInput
//           label={<p className="font-normal text-wrap">{question.label}</p>}
//           name={name ?? question.name}
//           checked={choice as boolean}
//           onChange={handleChange}
//           className={className}
//           required={question.required}
//         />
//       );

//     case 'select':
//       return (
//         <LVSelector
//           label={<p className="font-normal text-wrap">{question.label}</p>}
//           placeholder="Select option"
//           name={name ?? question.name}
//           value={choice as string | number}
//           onChange={handleChange}
//           data={question.options ?? []}
//           className={` ${className}`}
//           required={question.required}
//           selectStyles="max-w-full line-clamp-1"
//         />
//       );

//     default:
//       return null;
//   }
// };
