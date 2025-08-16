import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { Application } from "../types/application";

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Company</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {applications?.map((app) => (
          <TableRow key={app.id}>
            <TableCell>{app.company}</TableCell>
            <TableCell>{app.role}</TableCell>
            <TableCell>{app.status}</TableCell>
            <TableCell>{app.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
