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
import "../styles/ApplicationsTable.css";
import { useSelector } from "react-redux";

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
  const { loading } = useSelector((state: any) => state.authReducer);

  return (
    <Table className="applications-table">
      <TableHead>
        <TableRow className="table-header">
          <TableCell className="header-cell">Company</TableCell>
          <TableCell className="header-cell">Role</TableCell>
          <TableCell className="header-cell">Status</TableCell>
          <TableCell className="header-cell">Date</TableCell>
          <TableCell className="header-cell">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <p>Loading...</p>
        ) : (
          applications?.map((app) => (
            <TableRow key={app.id} hover className="table-row">
              <TableCell>{app.company}</TableCell>
              <TableCell>{app.role}</TableCell>
              <TableCell>
                <span
                  className={`status-badge status-${app.status.toLowerCase()}`}
                >
                  {app.status}
                </span>
              </TableCell>
              <TableCell>{app.date}</TableCell>
              <TableCell>
                <Button
                  className="google-button google-button-danger"
                  onClick={() => removeApplication(app.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
