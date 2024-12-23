import { FileStatus } from "@prisma/client";

interface Props {
  value: string;
}

const Status = ({ value }: Props) => {
  if (value === FileStatus.NOT_RECEIVED) {
    return <span className={"text-gray-600 font-bold"}>Not Received</span>;
  }
  if (value === FileStatus.PROCESSING) {
    return <span className={"text-blue-600 font-bold"}>Processing</span>;
  }
  if (value === FileStatus.MORE_INFO_REQUIRED) {
    return (
      <span className={"text-yellow-600 font-bold"}>More Info Required</span>
    );
  }
  if (value === FileStatus.REJECTED) {
    return <span className={"text-red-600 font-bold"}>Rejected</span>;
  }
  if (value === FileStatus.APPROVED) {
    return <span className={"text-green-600 font-bold"}>Approved</span>;
  }
};

export default Status;
