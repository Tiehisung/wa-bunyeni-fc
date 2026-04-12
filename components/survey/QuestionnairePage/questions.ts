// import { IQuestion } from './QuestionInput';

// export const testQuestions: IQuestion[] = [
//   {
//     name: 'age',
//     id: 'age',
//     label: 'How old are you?',
//     type: 'number',
//     required: true,
//     placeholder: 'Enter your age',
//   },
//   {
//     name: 'bio',
//     id: 'bio',
//     label: 'Tell us about yourself',
//     type: 'textarea',
//     required: true,
//     placeholder: 'Write a short bio...',
//   },
//   {
//     name: 'subscribe',
//     id: 'subscribe',
//     label: 'Would you like to receive our newsletter?',
//     type: 'checkbox',
//     required: true,
//   },
//   {
//     name: 'dob',
//     id: 'dob',
//     label: 'Your date of birth',
//     type: 'date',
//     required: true,
//   },
//   {
//     name: 'country',
//     id: 'country',
//     label: 'Which country do you live in?',
//     type: 'select',
//     required: true,
//     placeholder: 'Select your country',
//     options: [
//       { label: 'Ghana', value: 'ghana' },
//       { label: 'Nigeria', value: 'nigeria' },
//       { label: 'Kenya', value: 'kenya' },
//       { label: 'South Africa', value: 'south_africa' },
//     ],
//   },
//   {
//     name: 'language',
//     id: 'language',
//     label: 'Preferred Language',
//     type: 'select',
//     required: false,
//     placeholder: 'Choose one',
//     options: [
//       { label: 'English', value: 'en' },
//       { label: 'Twi', value: 'twi' },
//       { label: 'Ga', value: 'ga' },
//       { label: 'Hausa', value: 'hausa' },
//     ],
//   },
// ];

// export interface IQuestionnaire {
//   jobTitle: string;
//   questions: IQuestion[];
// }
// export const questionnaires: IQuestionnaire[] = [
//   {
//     jobTitle: 'Software Engineer',
//     questions: [
//       {
//         id: 'se1',
//         name: 'programming_languages',
//         label: 'What programming languages are you most proficient in?',
//         type: 'textarea',
//         placeholder: 'E.g., JavaScript, Python, C++',
//         required: true,
//       },
//       {
//         id: 'se2',
//         name: 'years_experience',
//         label:
//           'How many years of experience do you have in software development?',
//         type: 'number',
//         placeholder: 'Enter number of years',
//         required: true,
//       },
//       {
//         id: 'se3',
//         name: 'version_control_experience',
//         label: 'Have you ever worked with version control tools like Git?',
//         type: 'checkbox',
//         required: false,
//       },
//       {
//         id: 'se4',
//         name: 'technical_areas',
//         label:
//           'Which of the following areas do you have hands-on experience with?',
//         type: 'select',
//         required: true,
//         options: [
//           { label: 'Frontend', value: 'frontend' },
//           { label: 'Backend', value: 'backend' },
//           { label: 'DevOps', value: 'devops' },
//           { label: 'Mobile Development', value: 'mobile' },
//           { label: 'Testing', value: 'testing' },
//         ],
//       },
//       {
//         id: 'se5',
//         name: 'technical_challenge',
//         label:
//           'Describe a technical challenge you’ve faced and how you resolved it.',
//         type: 'textarea',
//         placeholder: 'Briefly describe your experience...',
//         required: false,
//       },
//     ],
//   },
//   {
//     jobTitle: 'Data Analyst',
//     questions: [
//       {
//         id: 'da1',
//         name: 'tools_used',
//         label: 'What tools do you use for data analysis?',
//         type: 'textarea',
//         placeholder: 'E.g., Excel, Python, Power BI',
//         required: true,
//       },
//       {
//         id: 'da2',
//         name: 'sql_proficiency',
//         label: 'How would you rate your proficiency in SQL?',
//         type: 'select',
//         required: true,
//         options: [
//           { label: 'Beginner', value: 'beginner' },
//           { label: 'Intermediate', value: 'intermediate' },
//           { label: 'Advanced', value: 'advanced' },
//           { label: 'Expert', value: 'expert' },
//         ],
//       },
//       {
//         id: 'da3',
//         name: 'data_visualization_experience',
//         label: 'Do you have experience with data visualization?',
//         type: 'checkbox',
//         required: false,
//       },
//       {
//         id: 'da4',
//         name: 'dataset_size',
//         label: 'On average, how large were the datasets you worked with?',
//         type: 'number',
//         placeholder: 'E.g., in GB or number of rows',
//         required: false,
//       },
//       {
//         id: 'da5',
//         name: 'impactful_analysis',
//         label:
//           'Explain a time when your analysis directly impacted a business decision.',
//         type: 'textarea',
//         placeholder: 'Describe the scenario...',
//         required: false,
//       },
//     ],
//   },
//   {
//     jobTitle: 'Customer Service Representative',
//     questions: [
//       {
//         id: 'cs1',
//         name: 'experience_years',
//         label: 'How many years of customer-facing experience do you have?',
//         type: 'number',
//         placeholder: 'Enter years',
//         required: true,
//       },
//       {
//         id: 'cs2',
//         name: 'support_channels',
//         label: 'Which channels have you used to support customers?',
//         type: 'select',
//         required: true,
//         options: [
//           { label: 'Phone', value: 'phone' },
//           { label: 'Email', value: 'email' },
//           { label: 'Live Chat', value: 'chat' },
//           { label: 'Social Media', value: 'social' },
//         ],
//       },
//       {
//         id: 'cs3',
//         name: 'crm_experience',
//         label:
//           'Do you have experience using CRM tools (e.g., Salesforce, Zendesk)?',
//         type: 'checkbox',
//         required: false,
//       },
//       {
//         id: 'cs4',
//         name: 'handle_irate',
//         label: 'How do you typically handle an irate customer?',
//         type: 'textarea',
//         placeholder: 'Describe your approach...',
//         required: true,
//       },
//       {
//         id: 'cs5',
//         name: 'communication_rating',
//         label: 'Rate your communication skills.',
//         type: 'select',
//         required: true,
//         options: [
//           { label: 'Poor', value: 'poor' },
//           { label: 'Fair', value: 'fair' },
//           { label: 'Good', value: 'good' },
//           { label: 'Excellent', value: 'excellent' },
//         ],
//       },
//     ],
//   },
// ];
