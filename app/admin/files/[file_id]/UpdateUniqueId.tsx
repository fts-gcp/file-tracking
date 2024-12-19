"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFileUser } from "@/app/admin/files/file.actions";

interface Props {
  file_id: string;
}

const UpdateUniqueId = ({ file_id }: Props) => {
  const [uniqueID, setUniqueID] = useState("");
  return (
    <div>
      <Input
        name="uniqueID"
        placeholder="Unique ID"
        value={uniqueID}
        onChange={(e) => setUniqueID(e.currentTarget.value)}
      />
      <Button
        onClick={async () => {
          await updateFileUser(file_id, uniqueID);
        }}
      >
        Update
      </Button>
    </div>
  );
};

export default UpdateUniqueId;
