import HEADER from "@/components/Element";
import StaffForm from "../StaffForm";

const NewStaffPage = () => {
  return (
    <div >
      <HEADER title="STAFF REGISTRATION " subtitle="New Personnel" />
      <br />
      <StaffForm className="_page"/>
    </div>
  );
};

export default NewStaffPage;
