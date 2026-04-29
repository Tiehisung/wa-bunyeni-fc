// pages/admin/staff/components/StaffTable.tsx
import { IStaff } from "@/types/staff.interface";
import AdminStaffCard from "./Card";

interface StaffTableProps {
  data: IStaff[];
}

export function StaffTable({ data }: StaffTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-sm font-medium">
              Staff Member
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Date Signed
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-4 py-3 text-right text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((staff) => (
            <AdminStaffCard key={staff._id} staff={staff} viewStyle="list" />
          ))}
        </tbody>
      </table>
    </div>
  );
}
