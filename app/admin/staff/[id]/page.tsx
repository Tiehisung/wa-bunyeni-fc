"use client";

import { useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Share2,
  Briefcase,
  GraduationCap,
  Heart,
  Activity,
} from "lucide-react";
import {
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetStaffMemberQuery,
} from "@/services/staff.endpoints";
import { Button } from "@/components/buttons/Button";
import { AVATAR } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TABS } from "@/components/ui/tabs";
import { formatDate, getTimeLeftOrAgo } from "@/lib/timeAndDate";
import { smartToast } from "@/utils/toast";
import { IStaff } from "@/types/staff.interface";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TbStatusChange } from "react-icons/tb";
import DataErrorAlert from "../../../../components/error/DataError";
import { maskEmail } from "@/lib/mail-mask";
import { CountupMetricCard } from "@/components/Metrics/Cards";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@/components/loaders/LoadingSpinner";

// Mock data for additional sections (replace with actual data from API)
const mockQualifications = [
  {
    id: 1,
    name: "UEFA A License",
    issuer: "UEFA",
    year: "2020",
    expiry: "2024",
  },
  { id: 2, name: "Sports Science Degree", issuer: "University", year: "2015" },
];

const mockContracts = [
  {
    id: 1,
    type: "Full-time",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    status: "active",
  },
];

const mockAttendance = [
  { date: "2024-01-15", present: true },
  { date: "2024-01-14", present: true },
  { date: "2024-01-13", present: false },
];

export default function StaffDetailPage() {
  const id = useParams().id;
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetStaffMemberQuery(
    id?.toString()!,
  );
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const staff = data?.data as IStaff;

  useEffect(() => {
    if (error) {
      smartToast({ error });
    }
  }, [error]);

  const handleDelete = async () => {
    try {
      const result = await deleteStaff(id?.toString()!).unwrap();
      smartToast(result);
      router.push("/admin/staff");
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await updateStaff({
        _id: id?.toString()!,
        isActive: !staff.isActive,
      }).unwrap();
      smartToast(result);
      refetch();
    } catch (error) {
      smartToast({ error });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    const roleLower = role?.toLowerCase();
    if (roleLower.includes("coach")) return "default";
    if (roleLower.includes("manager")) return "destructive";
    if (roleLower.includes("medical")) return "secondary";
    if (roleLower.includes("fitness")) return "secondary";
    return "outline";
  };

  if (isLoading) {
    return <LoadingSpinner page />;
  }

  if (error || !staff) {
    return (
      <div className="min-h-screen p-6">
        <DataErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/staff")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="flex flex-wrap gap-6 items-start md:items-center">
            {/* Avatar */}

            <AVATAR
              src={staff.avatar}
              className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl text-2xl md:text-3xl"
              shape="circle"
              alt={staff.fullname}
            />

            {/* Basic Info */}
            <div className="flex-1 ">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {staff.fullname}
                </h1>
                <Badge
                  variant={getRoleBadgeVariant(staff.role)}
                  className="w-fit"
                >
                  {staff.role}
                </Badge>
                <Badge
                  variant={staff.isActive ? "default" : "secondary"}
                  className="w-fit"
                >
                  {staff.isActive ? (
                    <>
                      <UserCheck className="mr-1 h-3 w-3" /> Active
                    </>
                  ) : (
                    <>
                      <UserX className="mr-1 h-3 w-3" /> Inactive
                    </>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center gap-2 ">
                  <Mail className="h-4 w-4" />
                  <span>{maskEmail(staff.email)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Born: {formatDate(staff.dob, "dd/mm/yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Joined: {formatDate(staff.dateSigned, "dd/mm/yyyy")}
                  </span>
                  <span className="text-xs">
                    ({getTimeLeftOrAgo(staff.dateSigned).formatted})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 self-end md:self-center">
              <Button variant="outline" size="icon" onClick={() => {}}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => {}}>
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  router.push(`/admin/staff/edit?staffId=${staff?._id}`);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>

              <ConfirmDialog
                trigger={
                  <>
                    <Trash2 className="h-4 w-4" />
                  </>
                }
                title="Delete Staff Member"
                description="Are you sure you want to delete this staff member? This action cannot be undone."
                onConfirm={handleDelete}
                isLoading={isDeleting}
                variant={"outline"}
              />
              <ConfirmDialog
                trigger={
                  <>
                    <TbStatusChange className="h-4 w-4" />
                  </>
                }
                title="Toggle Staff Member Status"
                description="Are you sure you want to change status of this staff member?"
                onConfirm={handleToggleStatus}
                isLoading={isUpdating}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CountupMetricCard
            icon={<Briefcase className="h-5 w-5 text-blue-500" />}
            description="Years Active"
            value={
              new Date().getFullYear() -
              new Date(staff.dateSigned).getFullYear()
            }
            isLoading={isLoading}
            color="blue"
            className="border-border hover:border-border"
          />
          <CountupMetricCard
            icon={<Heart className="h-5 w-5 " />}
            description="Qualifications"
            value={mockQualifications.length}
            isLoading={isLoading}
            color="green"
            className="border-border hover:border-border"
          />
          <CountupMetricCard
            icon={<Heart className="h-5 w-5 " />}
            description="Attendance Rate"
            value={"94%"}
            isLoading={isLoading}
            color="blue"
            className="border-border hover:border-border"
          />
          <CountupMetricCard
            icon={<Activity className="h-5 w-5 " />}
            description="Contract Status"
            value={"Active"}
            isLoading={isLoading}
            color="green"
            className="border-border hover:border-border"
          />
        </div>
      </div>

      <TABS
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Qualifications", value: "qualifications" },
          { label: "Contract", value: "contract" },
          { label: "Attendance", value: "attendance" },
        ]}
        listClassName="flex w-full overflow-x-auto h-11 rounded-none"
        // triggerClassName={`whitespace-nowrap data-[state=active]:border-Green data-[state=active]:text-Green rounded-none`}
        className="border p-4"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{staff.fullname}</span>

                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-medium">
                  {formatDate(staff.dob, "dd/mm/yyyy")}
                </span>

                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{maskEmail(staff.email)}</span>

                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{staff.phone}</span>

                <span className="text-muted-foreground">Role</span>
                <span className="font-medium">{staff.role}</span>

                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  <Badge variant={staff.isActive ? "default" : "secondary"}>
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Date Signed</span>
                <span className="font-medium">
                  {formatDate(staff.dateSigned, "dd/mm/yyyy")}
                  <span className="text-xs ml-2 text-muted-foreground">
                    ({getTimeLeftOrAgo(staff.dateSigned).formatted})
                  </span>
                </span>

                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">
                  {formatDate(staff.startDate, "dd/mm/yyyy")}
                </span>

                <span className="text-muted-foreground">End Date</span>
                <span className="font-medium">
                  {staff.endDate
                    ? formatDate(staff.endDate, "dd/mm/yyyy")
                    : "Ongoing"}
                </span>

                <span className="text-muted-foreground">Created At</span>
                <span className="font-medium">
                  {formatDate(staff.createdAt, "dd/mm/yyyy")}
                </span>

                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {formatDate(staff.updatedAt, "dd/mm/yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Qualifications & Certifications</CardTitle>
            <Button variant="outline" size="sm">
              <GraduationCap className="mr-2 h-4 w-4" /> Add Qualification
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockQualifications.map((qual) => (
                <div
                  key={qual.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{qual.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {qual.issuer} • {qual.year}
                      {qual.expiry && ` • Expires ${qual.expiry}`}
                    </p>
                  </div>
                  <Badge variant="outline">Verified</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contract Information</CardTitle>
            <Button variant="outline" size="sm">
              <Briefcase className="mr-2 h-4 w-4" /> Renew Contract
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockContracts.map((contract) => (
                <div key={contract.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{contract.type} Contract</h4>
                    <Badge
                      variant={
                        contract.status === "active" ? "default" : "secondary"
                      }
                    >
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start Date</span>
                      <p className="font-medium">
                        {formatDate(contract.startDate, "dd/mm/yyyy")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date</span>
                      <p className="font-medium">
                        {formatDate(contract.endDate, "dd/mm/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockAttendance.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span>{formatDate(record.date, "dd/mm/yyyy")}</span>
                  <Badge variant={record.present ? "default" : "destructive"}>
                    {record.present ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TABS>

      {/* Tabs Section */}

      {/* Timeline Section */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Staff member updated",
                  date: staff.updatedAt,
                  user: "Admin",
                },
                {
                  action: "Contract renewed",
                  date: staff.startDate,
                  user: "HR",
                },
                {
                  action: "Staff member created",
                  date: staff.createdAt,
                  user: "System",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(activity.date, "full")} by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
