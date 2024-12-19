import prisma from "@/prisma/client";
import GenerateBarcode from "@/app/GenerateBarcode";
import Link from "next/link";

const FilesPage = async () => {
  const files = await prisma.file.findMany();
  return (
    <div>
      <h1>Files</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Barcode</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>
                <GenerateBarcode value={file.barcode} />
              </td>
              <td>{file.status}</td>
              <td>
                <Link
                  className={"text-blue-600"}
                  href={`/admin/files/${file.id}`}
                >
                  View it{" "}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default FilesPage;
