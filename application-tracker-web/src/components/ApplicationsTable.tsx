import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Application } from "../types/application";

/**
 * Function component to return the Applications table.
 * @param applications - job applications to be displayed.
 */
export default function ApplicationsTable({
  applications,
  removeApplication,
}: {
  applications: Application[];
  removeApplication: any;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Company</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {applications?.map((app) => (
          <TableRow key={app.id}>
            <TableCell>{app.company}</TableCell>
            <TableCell>{app.role}</TableCell>
            <TableCell>{app.status}</TableCell>
            <TableCell>{app.date}</TableCell>
            <TableCell>
              <Button
                size="small"
                variant="text"
                onClick={() => removeApplication(app.id)}
              >
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
