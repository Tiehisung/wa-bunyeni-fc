// import { FormEvent, useState } from 'react';
// import { QuestionInput } from './QuestionInput';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { testQuestions } from './questions';
// import { toast } from 'sonner';
// import { BackButton, Button } from '../../../components/buttons/Buttons';
// import { AnimateOnView } from '../../../styles/stagger';
// import { IGigDataProps } from '../../../types/gig';
// import { getErrorString } from '../../../utils';

// const SeekerQuestionnaireForm = ({ gig }: { gig: IGigDataProps }) => {
//   const [formData, setFormData] = useState<{
//     [key: string]: string | number | boolean;
//   }>({});
//   const navigate = useNavigate();
//   const [sp] = useSearchParams();

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     try {
//       e.preventDefault();
//       navigate(`/dashboard/gigs/${gig.slug}/apply/documents?${sp.toString()}`);
//     } catch (error) {
//       toast.error(getErrorString(error));
//     }
//   };
//   const [showNumbering, setShowNumbering] = useState(false);
//   return (
//     <div className="max-w-3xl mx-auto px-4">
//       <header>
//         <h1 className="_title">Answer the following Questions</h1>
//         <h6>
//           This information will be shared with{' '}
//           <span className="capitalize first-letter:uppercase">
//             {gig?.smeProfile.companyName?.trim()}
//           </span>
//         </h6>

//         <div className="flex justify-end _small text-secondary">
//           <Button
//             primaryText={showNumbering ? 'Hide numbering' : 'Show numbering'}
//             onClick={() => setShowNumbering((p) => !p)}
//           />
//         </div>
//       </header>

//       <form className="space-y-12 mt-10" onSubmit={handleSubmit}>
//         {testQuestions.map((q, i) => (
//           <AnimateOnView index={i} key={q.id} delay={0.2}>
//             <div className="flex items-start gap-4">
//               {showNumbering && (
//                 <span className="  p-1 rounded-full w-8 h-5 flex justify-center items-center text-black _p italic">
//                   {i + 1}
//                 </span>
//               )}
//               <QuestionInput
//                 name={q.name}
//                 question={q}
//                 onChange={(val) => setFormData({ ...formData, [q.name]: val })}
//                 choice={formData[q.name]}
//                 className="grow "
//                 required={q.required}
//               />
//             </div>
//           </AnimateOnView>
//         ))}

//         <footer className="flex justify-end items-center gap-2">
//           <BackButton className=" _secondaryBtn px-4 py-1" content="Back" />
//           <Button
//             className="_primaryBtn px-4 py-1 "
//             primaryText="Next"
//             type="submit"
//           />
//         </footer>
//       </form>
//     </div>
//   );
// };

// export default SeekerQuestionnaireForm;
